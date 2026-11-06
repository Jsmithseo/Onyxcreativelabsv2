import { readWorkspaceMetadata, writeWorkspaceMetadata } from './workspaceMetadata.mjs';

const SETTINGS_PATH = 'admin/dashboard-settings.json';
const CAMPAIGN_ID = /^[a-z0-9-]{1,80}$/;
const VOIP_PROVIDERS = new Set(['', 'Twilio', 'Telnyx', 'RingCentral']);

const DEFAULT_SETTINGS = {
  goals: {
    callGoals: {},
    appointmentGoals: {},
    closeRatios: {},
  },
  voipProvider: '',
};

function wholeNumber(value, maximum) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 && number <= maximum
    ? number
    : null;
}

function cleanGoalMap(value, maximum) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([campaignId, goal]) => CAMPAIGN_ID.test(campaignId) && wholeNumber(goal, maximum) !== null)
      .map(([campaignId, goal]) => [campaignId, wholeNumber(goal, maximum)])
  );
}

export function normaliseDashboardSettings(value) {
  const goals = value?.goals || {};
  return {
    goals: {
      callGoals: cleanGoalMap(goals.callGoals, 10000),
      appointmentGoals: cleanGoalMap(goals.appointmentGoals, 1000),
      closeRatios: cleanGoalMap(goals.closeRatios, 100),
    },
    voipProvider: VOIP_PROVIDERS.has(String(value?.voipProvider || '').trim())
      ? String(value?.voipProvider || '').trim()
      : '',
  };
}

export async function getAdminDashboardSettings() {
  const value = await readWorkspaceMetadata(SETTINGS_PATH);
  return value ? normaliseDashboardSettings(value) : DEFAULT_SETTINGS;
}

export async function saveAdminDashboardSettings(settings) {
  const next = normaliseDashboardSettings(settings);
  await writeWorkspaceMetadata(SETTINGS_PATH, next);
  return next;
}
