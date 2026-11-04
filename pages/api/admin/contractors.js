import {
  createMagicLinkToken,
  isAllowedAdmin,
  normaliseEmail,
  readSessionToken,
} from '../../../lib/bdrAuth';
import {
  sendCampaignAccessEmail,
  sendMagicLinkEmail,
} from '../../../lib/bdrMail';
import {
  listContractors,
  markInvitationFailed,
  saveContractor,
} from '../../../lib/contractorStore';

const CAMPAIGN_ID = /^[a-z0-9-]{1,80}$/;
const CAMPAIGN_NAMES = {
  school: 'Parsity School',
  'warm-parsity-school': 'Warm Parsity School Leads',
  business: 'Parsity Business',
  reviews: 'Onyx Reviews',
  'quantum-bom': 'Quantum Bom',
};

function optionalGoal(value, label, maximum) {
  if (value === undefined || value === null || value === '') return undefined;
  const goal = Number(value);
  if (!Number.isInteger(goal) || goal < 0 || goal > maximum) {
    throw new Error(`${label} must be a whole number between 0 and ${maximum}.`);
  }
  return goal;
}

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

function contractorPayload(body) {
  const name = String(body?.name || '').trim().replace(/\s+/g, ' ');
  const email = normaliseEmail(body?.email);
  const phone = String(body?.phone || '').trim();
  const notes = String(body?.notes || '').trim();
  const dailyCallGoal = optionalGoal(body?.dailyCallGoal, 'Daily call goal', 10000);
  const dailyAppointmentGoal = optionalGoal(
    body?.dailyAppointmentGoal,
    'Daily appointment goal',
    1000
  );
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
  if (notes.length > 4000) {
    throw new Error('Notes must be 4,000 characters or fewer.');
  }
  if (!campaigns.length) {
    throw new Error('Choose at least one campaign.');
  }

  return {
    name,
    email,
    phone,
    notes,
    campaigns,
    dailyCallGoal,
    dailyAppointmentGoal,
  };
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

  if (!['POST', 'PUT'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, PUT');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  let payload;
  try {
    payload = contractorPayload(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const existing = await listContractors().then((contractors) =>
      contractors.find((contractor) => contractor.email === payload.email)
    );
    if (req.method === 'PUT' && !existing) {
      return res.status(404).json({ error: 'Contractor not found. Send an invitation first.' });
    }
    const contractor = await saveContractor({
      ...payload,
      invitedBy: admin.email,
      sendInvitation: req.method === 'POST',
    });

    if (req.method === 'PUT') {
      const addedCampaigns = contractor.campaigns.filter(
        (campaign) => !existing?.campaigns.includes(campaign)
      );
      if (addedCampaigns.length) {
        await sendCampaignAccessEmail({
          email: contractor.email,
          recipientName: contractor.name,
          campaigns: addedCampaigns.map((campaign) => ({
            id: campaign,
            name: CAMPAIGN_NAMES[campaign] || campaign,
          })),
        });
      }
      return res.status(200).json({
        contractor,
        campaignNoticeSent: addedCampaigns.length > 0,
      });
    }

    await sendMagicLinkEmail({
      email: contractor.email,
      token: createMagicLinkToken(contractor.email, 'contractor'),
      invitation: true,
      recipientName: contractor.name,
      campaigns: contractor.campaigns.map(
        (campaign) => CAMPAIGN_NAMES[campaign] || campaign
      ),
    });
    return res.status(201).json({ contractor });
  } catch (error) {
    console.error('Unable to send contractor invitation', error.message);
    try {
      await markInvitationFailed(payload.email);
    } catch (storageError) {
      console.error('Unable to mark failed invitation', storageError.message);
    }
    return res.status(503).json({
      error: 'The contractor was saved, but the invitation email could not be sent. Try again shortly.',
    });
  }
}
