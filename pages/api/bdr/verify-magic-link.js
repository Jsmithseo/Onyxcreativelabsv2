import {
  createSessionToken,
  readMagicLinkToken,
  sessionMaxAge,
} from '../../../lib/bdrAuth';
import { isActiveContractor } from '../../../lib/contractorStore';

function sessionCookie(value) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `bdr_session=${encodeURIComponent(
    value
  )}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionMaxAge}${secure}`;
}

export default async function verifyMagicLink(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = Array.isArray(req.query.token)
    ? req.query.token[0]
    : req.query.token;
  const claim = readMagicLinkToken(token, 'contractor');
  if (!claim || !(await isActiveContractor(claim.email))) {
    return res.redirect(302, '/bdr?signInError=invalid-link');
  }

  res.setHeader(
    'Set-Cookie',
    sessionCookie(createSessionToken(claim.email, 'contractor'))
  );
  return res.redirect(302, claim.returnTo || '/bdr?verified=1');
}
