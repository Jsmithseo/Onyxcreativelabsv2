import { readSessionToken } from '../../../lib/bdrAuth';
import { isActiveContractor } from '../../../lib/contractorStore';

function readCookie(cookieHeader, name) {
  const pair = String(cookieHeader || '')
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : null;
}

export default async function session(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const claim = readSessionToken(
    readCookie(req.headers.cookie, 'bdr_session'),
    'contractor'
  );
  if (claim && (await isActiveContractor(claim.email))) {
    return res.status(200).json({ authenticated: true, email: claim.email });
  }

  // Local `next dev` previews can exercise the workspace without a real
  // magic-link session. This server-side condition is unavailable in
  // production builds and deployments.
  if (process.env.NODE_ENV === 'development') {
    return res.status(200).json({
      authenticated: true,
      email: 'local-bdr-preview@onyx.invalid',
    });
  }

  return res.status(401).json({ authenticated: false });
}
