import {
  isAllowedAdmin,
  normaliseEmail,
  readSessionToken,
} from './bdrAuth';
import { findContractor, isActiveContractor } from './contractorStore';

export function readCookie(cookieHeader, name) {
  const pair = String(cookieHeader || '')
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : null;
}

export async function currentOperationsPrincipal(req) {
  const admin = readSessionToken(
    readCookie(req.headers.cookie, 'admin_session'),
    'admin'
  );
  if (admin && isAllowedAdmin(admin.email)) {
    return {
      email: normaliseEmail(admin.email),
      role: 'admin',
      campaignIds: null,
    };
  }

  const contractorClaim = readSessionToken(
    readCookie(req.headers.cookie, 'bdr_session'),
    'contractor'
  );
  if (contractorClaim && (await isActiveContractor(contractorClaim.email))) {
    const contractor = await findContractor(contractorClaim.email);
    return {
      email: normaliseEmail(contractorClaim.email),
      role: 'contractor',
      campaignIds: Array.isArray(contractor?.campaigns)
        ? contractor.campaigns.map(String).filter(Boolean)
        : [],
      goals: {
        calls: contractor?.dailyCallGoal ?? 120,
        appointments: contractor?.dailyAppointmentGoal ?? 3,
      },
    };
  }

  // Keep local previews usable without creating a production credential. A
  // real existing session above always wins, so local validation with an
  // established contractor login exercises the same assignment rule as
  // production. This fallback is unavailable in production behavior.
  if (process.env.NODE_ENV === 'development') {
    return {
      email: 'local-admin-preview@onyx.invalid',
      role: 'admin',
      campaignIds: null,
    };
  }

  return null;
}

export function hasCampaignAccess(principal, campaignId) {
  return Boolean(
    principal &&
      (principal.role === 'admin' || principal.campaignIds.includes(String(campaignId)))
  );
}

export function allowedCampaignIds(principal, allCampaigns = []) {
  if (!principal) return [];
  return principal.role === 'admin'
    ? allCampaigns.map((campaign) => campaign.id)
    : principal.campaignIds;
}
