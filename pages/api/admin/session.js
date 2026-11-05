import { readSessionToken } from '../../../lib/bdrAuth';

function readCookie(cookieHeader, name) {
  const pair = String(cookieHeader || '')
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : null;
}

export default function adminSession(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const claim = readSessionToken(
    readCookie(req.headers.cookie, 'admin_session'),
    'admin'
  );
  if (claim) {
    return res
      .status(200)
      .json({ authenticated: true, email: claim.email, role: 'admin' });
  }

  // Local `next dev` previews can exercise the workspace without a real
  // magic-link session. This server-side condition is unavailable in
  // production builds and deployments.
  if (process.env.NODE_ENV === 'development') {
    return res.status(200).json({
      authenticated: true,
      email: 'local-admin-preview@onyx.invalid',
      role: 'admin',
    });
  }

  return res.status(401).json({ authenticated: false });
}
