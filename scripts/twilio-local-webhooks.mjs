import { createServer, request } from 'node:http';
import { pathToFileURL } from 'node:url';

const webhookPath = /^\/api\/operations\/twilio\/(?:voice|(?:sms-status|recording-status)\?id=[a-f0-9-]{36})$/i;

export function createTwilioWebhookRelay(appPort) {
  return createServer((incoming, response) => {
    if (incoming.method !== 'POST' || !webhookPath.test(incoming.url)) {
      response.writeHead(404).end();
      return;
    }
    const signature = incoming.headers['x-twilio-signature'];
    const contentType = incoming.headers['content-type'];
    if (!signature || !/^application\/x-www-form-urlencoded(?:;|$)/i.test(contentType || '')) {
      response.writeHead(403).end();
      return;
    }
    const upstream = request({
      hostname: '127.0.0.1',
      port: appPort,
      path: incoming.url,
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'X-Twilio-Signature': signature,
      },
    }, (result) => {
      const type = result.headers['content-type'];
      response.writeHead(result.statusCode, type ? { 'Content-Type': type } : {});
      result.on('error', () => response.destroy());
      result.pipe(response);
    });
    upstream.setTimeout(15000, () => upstream.destroy(new Error('Local app timed out')));
    upstream.on('error', () => {
      if (!response.headersSent) response.writeHead(502).end();
      else response.destroy();
    });
    response.on('close', () => upstream.destroy());
    incoming.pipe(upstream);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const appPort = Number(process.argv[2] || 3000);
  const relayPort = Number(process.argv[3] || 3010);
  if ([appPort, relayPort].some((port) => !Number.isInteger(port) || port < 1 || port > 65535)
      || appPort === relayPort) {
    throw new Error('Provide two different TCP ports for the local app and webhook relay.');
  }
  createTwilioWebhookRelay(appPort).listen(relayPort, '127.0.0.1', () => {
    console.log(`Twilio webhook relay listening on http://127.0.0.1:${relayPort}`);
  });
}
