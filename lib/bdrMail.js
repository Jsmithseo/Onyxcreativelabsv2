import crypto from 'crypto';

function requiredEnvironment(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function encodeHeader(value) {
  return String(value).replace(/[\r\n]/g, ' ');
}

function createRawEmail({ to, subject, html, text, replyTo }) {
  const boundary = `onyx-${crypto.randomUUID()}`;
  const message = [
    `From: ${encodeHeader(requiredEnvironment('BDR_EMAIL_FROM'))}`,
    `To: ${encodeHeader(to)}`,
    `Subject: ${encodeHeader(subject)}`,
    ...(replyTo ? [`Reply-To: ${encodeHeader(replyTo)}`] : []),
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: 8bit',
    '',
    text,
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: 8bit',
    '',
    html,
    `--${boundary}--`,
    '',
  ].join('\r\n');

  return Buffer.from(message).toString('base64url');
}

async function gmailAccessToken() {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: requiredEnvironment('GOOGLE_GMAIL_CLIENT_ID'),
      client_secret: requiredEnvironment('GOOGLE_GMAIL_CLIENT_SECRET'),
      refresh_token: requiredEnvironment('GOOGLE_GMAIL_REFRESH_TOKEN'),
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) throw new Error('Google authorization could not be refreshed');
  const payload = await response.json();
  if (!payload.access_token) throw new Error('Google did not return an access token');
  return payload.access_token;
}

async function sendGmailMessage({ to, subject, html, text, replyTo }) {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await gmailAccessToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: createRawEmail({ to, subject, html, text, replyTo }) }),
  });

  if (!response.ok) throw new Error('Gmail did not accept the message');
  return response.json();
}

export async function sendMagicLinkEmail({ email, token }) {
  const appUrl = requiredEnvironment('BDR_APP_URL').replace(/\/$/, '');
  const verifyUrl = `${appUrl}/api/bdr/verify-magic-link?token=${encodeURIComponent(token)}`;
  const subject = 'Your Onyx BDR Dialer sign-in link';
  const text = `Use this secure link to access your Onyx BDR Dialer workspace: ${verifyUrl}\n\nThis link expires in 15 minutes. If you did not request it, you can ignore this email.`;
  const html = `<p>Use this secure link to access your <strong>Onyx BDR Dialer</strong> workspace.</p><p><a href="${verifyUrl}">Open my dialer</a></p><p>This link expires in 15 minutes. If you did not request it, you can ignore this email.</p>`;
  return sendGmailMessage({ to: email, subject, html, text });
}

export async function sendContactEmail({ email, name, message }) {
  const sender = requiredEnvironment('BDR_EMAIL_FROM');
  const subject = `New web lead from ${email}`;
  const text = `${email}\n${name || ''}\n\n${message || ''}`;
  const html = `<p><strong>From:</strong> ${encodeHeader(email)}</p><p><strong>Name:</strong> ${encodeHeader(name || '')}</p><p>${encodeHeader(message || '').replace(/\n/g, '<br>')}</p>`;
  return sendGmailMessage({ to: sender, subject, html, text, replyTo: email });
}
