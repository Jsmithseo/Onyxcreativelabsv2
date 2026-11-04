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
  if (!claim || !(await isActiveContractor(claim.email))) {
    return res.status(401).json({ authenticated: false });
  }

  return res.status(200).json({ authenticated: true, email: claim.email });
}
