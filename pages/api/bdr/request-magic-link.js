import {
  createMagicLinkToken,
  isAllowedContractor,
  normaliseEmail,
} from '../../../lib/bdrAuth';
import { sendMagicLinkEmail } from '../../../lib/bdrMail';

function hasValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function requestMagicLink(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = normaliseEmail(req.body?.email);
  if (!hasValidEmail(email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }

  // Do not reveal which contractors have access. Requests for an unassigned
  // address get the same successful response without sending mail.
  if (!isAllowedContractor(email)) {
    return res.status(202).json({ accepted: true });
  }

  try {
    await sendMagicLinkEmail({
      email,
      token: createMagicLinkToken(email, 'contractor'),
    });
    return res.status(202).json({ accepted: true });
  } catch (error) {
    console.error('Unable to send BDR magic link', error.message);
    return res.status(503).json({
      error:
        'Sign-in email is temporarily unavailable. Please contact your administrator.',
    });
  }
}
