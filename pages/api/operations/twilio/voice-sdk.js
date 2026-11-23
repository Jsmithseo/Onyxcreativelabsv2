import { readFile } from 'node:fs/promises';
import path from 'node:path';

export default async function voiceSdk(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  const asset = await readFile(path.join(
    process.cwd(), 'node_modules', '@twilio', 'voice-sdk', 'dist', 'twilio.min.js'
  ));
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  return res.status(200).send(asset);
}
