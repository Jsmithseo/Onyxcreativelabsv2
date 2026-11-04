import {
  createMagicLinkToken,
  isAllowedAdmin,
  normaliseEmail,
  readSessionToken,
} from '../../../lib/bdrAuth';
import { sendMagicLinkEmail } from '../../../lib/bdrMail';
import {
  listContractors,
  markInvitationFailed,
  saveContractor,
} from '../../../lib/contractorStore';

const CAMPAIGN_ID = /^[a-z0-9-]{1,80}$/;

function readCookie(cookieHeader, name) {
  const pair = String(cookieHeader || '')
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : null;
}

function authorisedAdmin(req) {
  const claim = readSessionToken(
    readCookie(req.headers.cookie, 'admin_session'),
    'admin'
  );
  return claim && isAllowedAdmin(claim.email) ? claim : null;
}

function invitePayload(body) {
  const name = String(body?.name || '').trim().replace(/\s+/g, ' ');
  const email = normaliseEmail(body?.email);
  const phone = String(body?.phone || '').trim();
  const campaigns = Array.isArray(body?.campaigns)
    ? [...new Set(body.campaigns.map(String).filter((id) => CAMPAIGN_ID.test(id)))]
    : [];

  if (!name || name.length > 120) {
    throw new Error('Enter a contractor name of 120 characters or fewer.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
    throw new Error('Enter a valid contractor email address.');
  }
  if (phone.length > 32) {
    throw new Error('Phone number must be 32 characters or fewer.');
  }
  if (!campaigns.length) {
    throw new Error('Choose at least one campaign.');
  }

  return { name, email, phone, campaigns };
}

export default async function contractors(req, res) {
  const admin = authorisedAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Administrator access required.' });

  if (req.method === 'GET') {
    try {
      return res.status(200).json({ contractors: await listContractors() });
    } catch (error) {
      console.error('Unable to load contractors', error.message);
      return res.status(503).json({ error: 'Contractor data is temporarily unavailable.' });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  let invite;
  try {
    invite = invitePayload(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const contractor = await saveContractor({ ...invite, invitedBy: admin.email });
    await sendMagicLinkEmail({
      email: contractor.email,
      token: createMagicLinkToken(contractor.email, 'contractor'),
      invitation: true,
    });
    return res.status(201).json({ contractor });
  } catch (error) {
    console.error('Unable to send contractor invitation', error.message);
    try {
      await markInvitationFailed(invite.email);
    } catch (storageError) {
      console.error('Unable to mark failed invitation', storageError.message);
    }
    return res.status(503).json({
      error: 'The contractor was saved, but the invitation email could not be sent. Try again shortly.',
    });
  }
}
