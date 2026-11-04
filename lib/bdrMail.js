import crypto from 'crypto';

function requiredEnvironment(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function encodeHeader(value) {
  return String(value).replace(/[\r\n]/g, ' ');
}

function encodeSubject(value) {
  const subject = encodeHeader(value);
  return /[^\x20-\x7E]/.test(subject)
    ? `=?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`
    : subject;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function displayName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ') || 'there';
}

function createRawEmail({ to, subject, html, text, replyTo }) {
  const boundary = `onyx-${crypto.randomUUID()}`;
  const message = [
    `From: ${encodeHeader(requiredEnvironment('BDR_EMAIL_FROM'))}`,
    `To: ${encodeHeader(to)}`,
    `Subject: ${encodeSubject(subject)}`,
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

  if (!response.ok)
    throw new Error('Google authorization could not be refreshed');
  const payload = await response.json();
  if (!payload.access_token)
    throw new Error('Google did not return an access token');
  return payload.access_token;
}

async function sendGmailMessage({ to, subject, html, text, replyTo }) {
  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${await gmailAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: createRawEmail({ to, subject, html, text, replyTo }),
      }),
    }
  );

  if (!response.ok) throw new Error('Gmail did not accept the message');
  return response.json();
}

export async function sendMagicLinkEmail({
  email,
  token,
  role = 'contractor',
  invitation = false,
  recipientName,
  campaigns = [],
}) {
  const appUrl = requiredEnvironment('BDR_APP_URL').replace(/\/$/, '');
  const isAdmin = role === 'admin';
  const verifyUrl = `${appUrl}/api/${
    isAdmin ? 'admin' : 'bdr'
  }/verify-magic-link?token=${encodeURIComponent(token)}`;
  const destination = isAdmin ? 'Onyx Admin' : 'Onyx BDR Dialer';
  const subject = invitation
    ? `Welcome to ${destination}`
    : `Your ${destination} sign-in link`;
  if (invitation && !isAdmin) {
    const name = displayName(recipientName);
    const logoUrl = `${appUrl}/onyx-creative-labs-logo.webp`;
    const campaignList = Array.isArray(campaigns)
      ? campaigns.map((campaign) => String(campaign).trim()).filter(Boolean)
      : [];
    const campaignLines = campaignList.length
      ? campaignList.map((campaign) => `- ${campaign}`).join('\n')
      : '- Your assigned Onyx campaigns';
    const campaignHtml = campaignList.length
      ? `<ul style="margin:12px 0 20px;padding-left:20px;color:#363636;">${campaignList
          .map((campaign) => `<li style="margin:0 0 6px;">${escapeHtml(campaign)}</li>`)
          .join('')}</ul>`
      : '';
    const text = `Welcome to Onyx BDR Dialer, ${name}!\n\nYou have been invited to join Onyx Creative Labs as a contractor. Your assigned campaigns:\n${campaignLines}\n\nUse this secure link to open your calling workspace:\n${verifyUrl}\n\nThis link expires in 15 minutes. If you were not expecting this invitation, you can ignore this email.`;
    const html = `<!doctype html><html><body style="margin:0;background:#f5f5f3;color:#1b1b1b;font-family:Arial,Helvetica,sans-serif;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #deded9;"><tr><td style="padding:30px 32px 12px;"><img src="${escapeHtml(logoUrl)}" width="164" alt="Onyx Creative Labs" style="display:block;height:auto;margin:0 0 26px;max-width:100%;" /><p style="margin:0 0 18px;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:#5b5b57;">Contractor welcome</p><h1 style="margin:0;font-size:30px;line-height:1.15;color:#171717;">Welcome to Onyx BDR Dialer</h1></td></tr><tr><td style="padding:12px 32px 32px;"><p style="margin:0 0 16px;font-size:16px;line-height:1.55;">Hi ${escapeHtml(name)},</p><p style="margin:0 0 16px;font-size:16px;line-height:1.55;">You have been invited to join Onyx Creative Labs as a contractor. Your calling workspace is ready for the campaigns below.</p>${campaignHtml}<p style="margin:0 0 24px;"><a href="${verifyUrl}" style="display:inline-block;background:#171717;color:#ffffff;padding:13px 18px;text-decoration:none;font-size:15px;font-weight:700;border-radius:4px;">Open my dialer</a></p><p style="margin:0;font-size:13px;line-height:1.5;color:#5b5b57;">This secure link expires in 15 minutes. If you were not expecting this invitation, you can ignore this email.</p></td></tr></table></td></tr></table></body></html>`;
    return sendGmailMessage({ to: email, subject, html, text });
  }
  const intro = invitation
    ? `You have been invited to access ${destination}.`
    : `Use this secure link to access ${destination}.`;
  const text = `${intro}\n\n${verifyUrl}\n\nThis link expires in 15 minutes. If you did not request it, you can ignore this email.`;
  const html = `<p>${intro.replace(destination, `<strong>${destination}</strong>`)}</p><p><a href="${verifyUrl}">Open ${
    isAdmin ? 'admin' : 'my dialer'
  }</a></p><p>This link expires in 15 minutes. If you did not request it, you can ignore this email.</p>`;
  return sendGmailMessage({ to: email, subject, html, text });
}

export async function sendContactEmail({ email, name, message }) {
  const sender = requiredEnvironment('BDR_EMAIL_FROM');
  const subject = `New web lead from ${email}`;
  const text = `${email}\n${name || ''}\n\n${message || ''}`;
  const html = `<p><strong>From:</strong> ${encodeHeader(
    email
  )}</p><p><strong>Name:</strong> ${encodeHeader(
    name || ''
  )}</p><p>${encodeHeader(message || '').replace(/\n/g, '<br>')}</p>`;
  return sendGmailMessage({ to: sender, subject, html, text, replyTo: email });
}
