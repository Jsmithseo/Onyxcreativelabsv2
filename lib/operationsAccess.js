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
  if (!contractorClaim || !(await isActiveContractor(contractorClaim.email))) {
    return null;
  }

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
