import {
  createMagicLinkToken,
  isAllowedAdmin,
  normaliseEmail,
} from '../../../lib/bdrAuth';
import { sendMagicLinkEmail } from '../../../lib/bdrMail';

function hasValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function requestAdminMagicLink(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = normaliseEmail(req.body?.email);
  if (!hasValidEmail(email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }

  // Return the same accepted response for every address so the endpoint never
  // discloses who has administrative access.
  if (!isAllowedAdmin(email)) {
    return res.status(202).json({ accepted: true });
  }

  try {
    await sendMagicLinkEmail({
      email,
      token: createMagicLinkToken(email, 'admin'),
      role: 'admin',
    });
    return res.status(202).json({ accepted: true });
  } catch (error) {
    console.error('Unable to send admin magic link', error.message);
    return res.status(503).json({
      error:
        'Sign-in email is temporarily unavailable. Please try again shortly.',
    });
  }
}
