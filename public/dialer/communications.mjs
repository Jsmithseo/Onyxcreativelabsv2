const endpoint = '/api/operations/twilio';
let sdkLoading;

async function request(path, { workspace, body, signal } = {}) {
  const headers = new Headers();
  if (workspace === 'bdr') headers.set('X-Onyx-Workspace', 'bdr');
  if (body) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${endpoint}/${path}`, {
    headers, signal, cache: 'no-store',
    ...(body && { method: 'POST', body: JSON.stringify(body) }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Twilio is temporarily unavailable.');
  return data;
}

export function communicationsStatus() {
  return request('status');
}

function loadVoiceSdk() {
  if (sdkLoading) return sdkLoading;
  sdkLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${endpoint}/voice-sdk`;
    script.onload = () => {
      if (window.Twilio?.Device) resolve(window.Twilio.Device);
      else reject(new Error('Unable to load browser calling.'));
    };
    script.onerror = () => reject(new Error('Unable to load browser calling.'));
    document.head.append(script);
  }).catch((error) => {
    sdkLoading = null;
    throw error;
  });
  return sdkLoading;
}

export function dialProspect({ leadId, expectedPhone, workspace, onState }) {
  const controller = new AbortController();
  let device;
  let call;
  let startedAt;
  let attempted = false;
  let ended = false;

  function finish(message) {
    if (ended) return;
    ended = true;
    controller.abort();
    queueMicrotask(() => device?.destroy());
    const durationSeconds = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0;
    onState({ phase: 'ended', durationSeconds, attempted, message });
  }

  (async () => {
    try {
      const [Device, session] = await Promise.all([
        loadVoiceSdk(),
        request('voice-session', { workspace, body: { leadId, expectedPhone }, signal: controller.signal }),
      ]);
      if (ended) return;
      if (!Device.isSupported) throw new Error('This browser does not support VoIP calling.');
      device = new Device(session.token, { closeProtection: true });
      device.on('error', () => finish('Could not connect. Check your microphone permissions and try again.'));
      call = await device.connect({ params: { GrantId: session.grantId } });
      if (ended) return;
      function ringing() {
        if (ended) return;
        attempted = true;
        onState({ phase: 'ringing' });
      }
      function connected() {
        if (ended) return;
        attempted = true;
        startedAt ||= Date.now();
        onState({ phase: 'connected', startedAt });
      }
      call.on('ringing', ringing);
      call.on('accept', connected);
      call.on('reconnecting', () => { if (!ended) onState({ phase: 'reconnecting' }); });
      call.on('reconnected', connected);
      call.on('disconnect', () => finish(startedAt ? 'Call ended.' : 'Call ended before connecting.'));
      call.on('cancel', () => finish('Call canceled.'));
      call.on('reject', () => finish('Call was declined.'));
      call.on('error', () => finish('The call encountered a connection error.'));
      if (call.status() === 'ringing') ringing();
      if (call.status() === 'open') connected();
      if (call.status() === 'closed') finish('Call ended before connecting.');
    } catch (error) {
      finish(error.name === 'NotAllowedError' ? 'Allow microphone access to place a call.' : error.message);
    }
  })();

  return {
    hangUp() {
      finish(startedAt ? 'Call ended.' : 'Call canceled.');
    },
    dispose() {
      ended = true;
      controller.abort();
      device?.destroy();
    },
  };
}

const textStatuses = {
  submitting: 'Submitting',
  'submission-unknown': 'Submission could not be confirmed',
  accepted: 'Accepted by Twilio',
  queued: 'Queued',
  sending: 'Sending',
  sent: 'Sent',
  delivered: 'Delivered',
  undelivered: 'Undelivered',
  failed: 'Failed',
  canceled: 'Canceled',
};

function textStatus(message) {
  if (String(message.error_code) === '21610') return 'Blocked because the recipient opted out';
  if (String(message.error_code) === '30034') return 'Blocked because the US sender registration is incomplete';
  const status = textStatuses[message.status] || 'Pending';
  return message.error_code ? `${status} (Twilio ${message.error_code})` : status;
}

export function mountTextComposer(container, { resolveLeadId, workspace }) {
  container.innerHTML = `
    <button type="button" class="onyx-text-button">Text lead</button>
    <dialog class="onyx-text-dialog" aria-label="Text prospect">
      <header><h3>Text prospect</h3><button type="button" data-close aria-label="Close text composer">×</button></header>
      <p data-recipient></p>
      <form>
        <label>Message<textarea name="text" rows="4" maxlength="1500" required></textarea></label>
        <label>Written consent record<input name="reference" maxlength="500" placeholder="For example, opt-in form and date" required></label>
        <label class="onyx-text-checkbox"><input type="checkbox" name="consent" required> The prospect gave written consent to receive this text at this number.</label>
        <p>The message includes the business name and a STOP opt-out.</p>
        <button type="submit">Send text</button>
      </form>
      <p role="status"></p>
      <section aria-label="Text history">
        <header><h4>Text history</h4><button type="button" data-refresh>Refresh</button></header>
        <ul></ul>
      </section>
    </dialog>`;
  const open = container.querySelector('.onyx-text-button');
  const dialog = container.querySelector('dialog');
  const form = dialog.querySelector('form');
  const list = dialog.querySelector('ul');
  const recipient = dialog.querySelector('[data-recipient]');
  const status = dialog.querySelector('[role="status"]');
  const send = form.querySelector('[type="submit"]');
  const close = dialog.querySelector('[data-close]');
  const refresh = dialog.querySelector('[data-refresh]');
  const controller = new AbortController();
  let leadId;
  let expectedPhone;
  let pending;
  let historyRequest = 0;

  function renderHistory(messages) {
    list.replaceChildren();
    for (const message of messages) {
      const item = document.createElement('li');
      const summary = document.createElement('small');
      summary.textContent = `${textStatus(message)} · ${new Date(message.created_at).toLocaleString()}`;
      const body = document.createElement('p');
      body.textContent = message.body;
      item.append(summary, body);
      list.append(item);
    }
    if (!messages.length) {
      const empty = document.createElement('li');
      empty.textContent = 'No texts sent.';
      list.append(empty);
    }
  }

  async function loadHistory() {
    const attempt = ++historyRequest;
    try {
      const data = await request(`texts?leadId=${encodeURIComponent(leadId)}`, { workspace, signal: controller.signal });
      if (attempt !== historyRequest) return;
      if (expectedPhone !== data.recipient) {
        form.elements.consent.checked = false;
        expectedPhone = data.recipient;
        pending = null;
      }
      recipient.textContent = expectedPhone ? `To ${expectedPhone}` : 'No valid text number.';
      renderHistory(data.messages);
    } catch (error) {
      if (attempt === historyRequest && !controller.signal.aborted) {
        list.textContent = '';
        const item = document.createElement('li');
        item.textContent = error.message;
        list.append(item);
      }
    }
  }

  dialog.addEventListener('cancel', (event) => {
    if (close.disabled) event.preventDefault();
  });
  close.onclick = () => dialog.close();
  refresh.onclick = async () => {
    refresh.disabled = true;
    await loadHistory();
    refresh.disabled = false;
    if (!close.disabled) send.disabled = !expectedPhone;
  };
  open.onclick = async () => {
    open.disabled = true;
    send.disabled = true;
    refresh.disabled = true;
    recipient.textContent = 'Loading recipient…';
    status.textContent = '';
    dialog.showModal();
    try {
      leadId = await resolveLeadId();
      if (controller.signal.aborted) return;
      await refresh.onclick();
    } catch (error) {
      if (!controller.signal.aborted) {
        recipient.textContent = '';
        status.textContent = error.message;
      }
    } finally {
      open.disabled = false;
    }
  };

  form.onsubmit = async (event) => {
    event.preventDefault();
    if (send.disabled || !leadId || !expectedPhone) return;
    const data = new FormData(form);
    const text = data.get('text').trim();
    const consentReference = data.get('reference').trim();
    const signature = JSON.stringify([text, consentReference, expectedPhone]);
    if (pending?.signature !== signature) pending = { signature, id: crypto.randomUUID() };
    send.disabled = true;
    close.disabled = true;
    refresh.disabled = true;
    status.textContent = 'Submitting text…';
    try {
      const { message } = await request('texts', {
        workspace, signal: controller.signal,
        body: { leadId, expectedPhone, id: pending.id, text, consentReference, consentConfirmed: data.has('consent') },
      });
      form.reset();
      pending = null;
      status.textContent = textStatus(message);
      await loadHistory();
    } catch (error) {
      if (!controller.signal.aborted) status.textContent = error.message;
    } finally {
      send.disabled = !expectedPhone;
      close.disabled = false;
      refresh.disabled = false;
    }
  };

  return () => {
    controller.abort();
    container.replaceChildren();
  };
}
