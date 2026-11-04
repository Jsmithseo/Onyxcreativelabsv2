export const DIALER_WORKSPACE_KEY = 'onyx-dialer-workspace-v1';
const workspaceEvent = 'onyx-dialer-workspace-updated';

const seed = {
  campaigns: [{ id: 'reviews', name: 'Onyx Reviews', active: true }],
  contractors: [
    {
      id: 'onyx-test-contractor',
      email: 'jeremysmith72@gmail.com',
      name: 'Onyx Test Contractor',
      campaignIds: ['reviews'],
    },
  ],
  leads: [
    {
      id: 'onyx-review-001',
      campaignId: 'reviews',
      assignedTo: 'jeremysmith72@gmail.com',
      name: 'Maya Thompson',
      company: 'Thompson Home Services',
      title: 'Owner',
      phone: '(415) 555-0142',
      email: 'maya@thompsonhomeservices.com',
      location: 'Oakland, CA',
      zone: 'PT',
      stage: 'New',
      disposition: '',
      notes: 'Requested more detail about improving the review process.',
    },
    {
      id: 'onyx-review-002',
      campaignId: 'reviews',
      assignedTo: 'jeremysmith72@gmail.com',
      name: 'Jordan Lee',
      company: 'Lee Solar & Roofing',
      title: 'Managing Partner',
      phone: '(510) 555-0187',
      email: 'jordan@leesolarroofing.com',
      location: 'Berkeley, CA',
      zone: 'PT',
      stage: 'Contacted',
      disposition: 'Left voicemail',
      notes: 'Follow up after the current roofing project wraps up.',
    },
    {
      id: 'onyx-review-003',
      campaignId: 'reviews',
      assignedTo: 'jeremysmith72@gmail.com',
      name: 'Riley Martinez',
      company: 'Martinez Plumbing Co.',
      title: 'Operations Director',
      phone: '(925) 555-0129',
      email: 'riley@martinezplumbing.com',
      location: 'Walnut Creek, CA',
      zone: 'PT',
      stage: 'Qualified',
      disposition: 'Connected — qualified',
      notes: 'Interested in seeing the workflow with their office manager.',
    },
  ],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isWorkspace(value) {
  return (
    value &&
    Array.isArray(value.campaigns) &&
    Array.isArray(value.contractors) &&
    Array.isArray(value.leads)
  );
}

export function readDialerWorkspace() {
  if (typeof window === 'undefined') return clone(seed);

  try {
    const saved = JSON.parse(
      window.localStorage.getItem(DIALER_WORKSPACE_KEY) || 'null'
    );
    return isWorkspace(saved) ? saved : clone(seed);
  } catch {
    return clone(seed);
  }
}

export function writeDialerWorkspace(workspace) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DIALER_WORKSPACE_KEY, JSON.stringify(workspace));
  window.dispatchEvent(new Event(workspaceEvent));
}

export function subscribeToDialerWorkspace(listener) {
  if (typeof window === 'undefined') return () => {};

  const onStorage = (event) => {
    if (event.key === DIALER_WORKSPACE_KEY) listener(readDialerWorkspace());
  };
  const onWorkspaceUpdate = () => listener(readDialerWorkspace());

  window.addEventListener('storage', onStorage);
  window.addEventListener(workspaceEvent, onWorkspaceUpdate);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(workspaceEvent, onWorkspaceUpdate);
  };
}
