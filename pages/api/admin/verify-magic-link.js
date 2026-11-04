import {
  createSessionToken,
  readMagicLinkToken,
  sessionMaxAge,
} from '../../../lib/bdrAuth';

function sessionCookie(value) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `admin_session=${encodeURIComponent(
    value
  )}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionMaxAge}${secure}`;
}

export default function verifyAdminMagicLink(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = Array.isArray(req.query.token)
    ? req.query.token[0]
    : req.query.token;
  const claim = readMagicLinkToken(token, 'admin');
  if (!claim) {
    return res.redirect(302, '/admin?signInError=invalid-link');
  }

  res.setHeader(
    'Set-Cookie',
    sessionCookie(createSessionToken(claim.email, 'admin'))
  );
  return res.redirect(302, '/admin?verified=1');
}
