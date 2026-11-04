import { useEffect, useMemo, useState } from 'react';

const workableStages = [
  'New',
  'Contacted',
  'Qualified',
  'Appointment Set',
  'Do Not Call',
];

const dispositions = [
  'Connected — qualified',
  'Connected — follow up',
  'Left voicemail',
  'No answer',
  'Not interested',
];

function money(cents) {
  const value = Number(cents || 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value / 100);
}

function shortDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? '—'
    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function pipelineLane(lead) {
  if (lead.deal_status === 'won' || lead.stage === 'Won') return 'won';
  if (lead.deal_status === 'lost' || lead.stage === 'Lost') return 'lost';
  if (lead.stage === 'Appointment Set') return 'appointments';
  if (
    lead.disposition === 'Connected — follow up' ||
    lead.next_follow_up_at
  ) {
    return 'followups';
  }
  return 'open';
}

const lanes = [
  { id: 'appointments', label: 'Appointments' },
  { id: 'followups', label: 'Follow-ups' },
  { id: 'open', label: 'Open' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
];

export default function ContractorPipeline({ signedInEmail, onSignOut }) {
  const [workspace, setWorkspace] = useState({ campaigns: [], leads: [] });
  const [activeCampaign, setActiveCampaign] = useState('');
  const [activeView, setActiveView] = useState('pipeline');
  const [selectedLead, setSelectedLead] = useState(null);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activity, setActivity] = useState({
    disposition: '',
    note: '',
    scheduledFor: '',
    nextStage: '',
  });

  async function loadWorkspace({ keepLoading = false } = {}) {
    if (keepLoading) setLoading(true);
    try {
      const response = await fetch('/api/operations/workspace', {
        cache: 'no-store',
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load pipeline.');
      setWorkspace(payload);
      setActiveCampaign((current) => {
        const requested = new URLSearchParams(window.location.search).get('campaign');
        if (requested && payload.campaigns.some((item) => item.id === requested)) {
          return requested;
        }
        if (current && payload.campaigns.some((item) => item.id === current)) {
          return current;
        }
        return payload.campaigns[0]?.id || '';
      });
      setError('');
    } catch (loadError) {
      setError(loadError.message || 'Unable to load pipeline.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkspace({ keepLoading: true });
    const interval = window.setInterval(() => loadWorkspace(), 15000);
    return () => window.clearInterval(interval);
  }, []);

  async function openLead(lead) {
    setSelectedLead(lead);
    setDetail(null);
    setActivity({
      disposition: lead.disposition || '',
      note: '',
      scheduledFor: lead.next_follow_up_at
        ? new Date(lead.next_follow_up_at).toISOString().slice(0, 16)
        : '',
      nextStage: workableStages.includes(lead.stage) ? lead.stage : '',
    });
    try {
      const response = await fetch(`/api/operations/leads/${encodeURIComponent(lead.id)}`, {
        cache: 'no-store',
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load lead details.');
      setDetail(payload);
    } catch (detailError) {
      setError(detailError.message || 'Unable to load lead details.');
    }
  }

  async function saveActivity(event) {
    event.preventDefault();
    if (!selectedLead) return;
    setSaving(true);
    try {
      const response = await fetch('/api/operations/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          activityType: 'call',
          disposition: activity.disposition,
          note: activity.note,
          scheduledFor: activity.scheduledFor || null,
          nextStage: activity.nextStage,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to save call activity.');
      await loadWorkspace();
      await openLead({ ...selectedLead, ...payload.lead });
    } catch (saveError) {
      setError(saveError.message || 'Unable to save call activity.');
    } finally {
      setSaving(false);
    }
  }

  const visibleLeads = useMemo(
    () => workspace.leads.filter((lead) => lead.campaign_id === activeCampaign),
    [activeCampaign, workspace.leads]
  );
  const campaign = workspace.campaigns.find((item) => item.id === activeCampaign);

  return (
    <div className="contractor-pipeline">
      <header className="pipeline-header">
        <div className="pipeline-brand">
          <img
            src="/onyx-creative-labs-logo.webp"
            alt="Onyx Creative Labs"
            width="150"
            height="36"
          />
          <span>BDR Dialer</span>
        </div>
        <nav aria-label="Contractor workspace navigation">
          <button
            className={activeView === 'pipeline' ? 'is-active' : ''}
            type="button"
            onClick={() => setActiveView('pipeline')}
          >
            Pipeline
          </button>
          <button
            className={activeView === 'settings' ? 'is-active' : ''}
            type="button"
            onClick={() => setActiveView('settings')}
          >
            Settings
          </button>
        </nav>
        <div className="pipeline-user">
          <span>{signedInEmail}</span>
          <button type="button" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <main className="pipeline-main">
        {error && <p className="pipeline-error">{error}</p>}
        {activeView === 'pipeline' && (
          <>
            <div className="pipeline-heading">
              <div>
                <p className="eyebrow">Your shared pipeline</p>
                <h1>{campaign?.name || 'Campaign pipeline'}</h1>
                <p>
                  Deal status and commission updates are managed by your
                  administrator. Your call activity is shared with the team.
                </p>
              </div>
              <label>
                Campaign
                <select
                  value={activeCampaign}
                  onChange={(event) => setActiveCampaign(event.target.value)}
                >
                  {workspace.campaigns.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {loading ? (
              <p className="pipeline-empty">Loading your assigned campaigns…</p>
            ) : !workspace.campaigns.length ? (
              <p className="pipeline-empty">
                Your administrator has not assigned a campaign yet.
              </p>
            ) : (
              <section className="pipeline-board" aria-label="Read-only deal pipeline">
                {lanes.map((lane) => {
                  const laneLeads = visibleLeads.filter(
                    (lead) => pipelineLane(lead) === lane.id
                  );
                  return (
                    <section className="pipeline-lane" key={lane.id}>
                      <header>
                        <strong>{lane.label}</strong>
                        <span>{laneLeads.length}</span>
                      </header>
                      <div className="pipeline-cards">
                        {laneLeads.length ? (
                          laneLeads.map((lead) => (
                            <button
                              className="pipeline-card"
                              key={lead.id}
                              type="button"
                              onClick={() => openLead(lead)}
                            >
                              <strong>{lead.name}</strong>
                              <span>{lead.company || 'Individual lead'}</span>
                              <small>{lead.stage}</small>
                              <em>{money(lead.potential_commission_cents)} potential commission</em>
                            </button>
                          ))
                        ) : (
                          <p className="lane-empty">Nothing here yet.</p>
                        )}
                      </div>
                    </section>
                  );
                })}
              </section>
            )}
          </>
        )}

        {activeView === 'settings' && (
          <section className="pipeline-settings">
            <p className="eyebrow">Workspace settings</p>
            <h1>Your access</h1>
            <p>
              You can view and work the campaigns below. Campaign access is
              managed by your administrator.
            </p>
            <ul>
              {workspace.campaigns.map((item) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {selectedLead && (
        <aside className="lead-drawer" aria-label="Lead details">
          <header>
            <div>
              <p className="eyebrow">Lead details</p>
              <h2>{selectedLead.name}</h2>
              <p>{selectedLead.company || 'Individual lead'}</p>
            </div>
            <button type="button" onClick={() => setSelectedLead(null)}>
              Close
            </button>
          </header>
          <div className="lead-facts">
            <span><strong>Stage</strong>{detail?.lead.stage || selectedLead.stage}</span>
            <span><strong>Deal</strong>{detail?.lead.deal_status || selectedLead.deal_status}</span>
            <span><strong>Potential commission</strong>{money(detail?.lead.potential_commission_cents ?? selectedLead.potential_commission_cents)}</span>
            <span><strong>Phone</strong>{detail?.lead.phone || selectedLead.phone || '—'}</span>
          </div>
          <form className="activity-form" onSubmit={saveActivity}>
            <h3>Log call activity</h3>
            <label>
              Outcome
              <select
                value={activity.disposition}
                onChange={(event) => setActivity({ ...activity, disposition: event.target.value })}
              >
                <option value="">Choose outcome</option>
                {dispositions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              Lead progress
              <select
                value={activity.nextStage}
                onChange={(event) => setActivity({ ...activity, nextStage: event.target.value })}
              >
                <option value="">Keep current stage</option>
                {workableStages.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              Follow-up
              <input
                type="datetime-local"
                value={activity.scheduledFor}
                onChange={(event) => setActivity({ ...activity, scheduledFor: event.target.value })}
              />
            </label>
            <label>
              Notes
              <textarea
                value={activity.note}
                onChange={(event) => setActivity({ ...activity, note: event.target.value })}
                placeholder="Record what happened on the call."
              />
            </label>
            <button className="save-activity" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save call activity'}
            </button>
          </form>
          <section className="activity-history">
            <h3>Shared history</h3>
            {detail ? (
              detail.activities.length ? detail.activities.map((item) => (
                <article key={item.id}>
                  <strong>{item.activity_type.replace('_', ' ')}</strong>
                  <span>{item.actor_email} · {shortDate(item.created_at)}</span>
                  {item.note && <p>{item.note}</p>}
                </article>
              )) : <p>No shared activity yet.</p>
            ) : <p>Loading lead history…</p>}
          </section>
        </aside>
      )}

      <style jsx>{`
        .contractor-pipeline { min-height: 100vh; background: #f7f7f5; color: #171717; }
        .pipeline-header { align-items: center; background: #fff; border-bottom: 1px solid #deded9; display: grid; gap: 26px; grid-template-columns: auto 1fr auto; min-height: 70px; padding: 12px max(28px, calc((100vw - 1240px) / 2)); }
        .pipeline-brand { align-items: center; display: flex; gap: 14px; }
        .pipeline-brand img { display: block; height: auto; width: 150px; }
        .pipeline-brand span { border-left: 1px solid #deded9; font-size: 14px; font-weight: 700; padding-left: 14px; }
        nav { display: flex; gap: 22px; }
        nav button, .pipeline-user button, .lead-drawer header button { background: transparent; border: 0; color: #666; cursor: pointer; font: inherit; padding: 8px 0; }
        nav button.is-active { border-bottom: 2px solid #171717; color: #171717; font-weight: 700; }
        .pipeline-user { align-items: center; display: flex; font-size: 13px; gap: 12px; }
        .pipeline-user button { color: #171717; font-weight: 700; }
        .pipeline-main { margin: 0 auto; max-width: 1240px; padding: 38px 28px 64px; }
        .pipeline-heading { align-items: end; display: flex; gap: 24px; justify-content: space-between; margin-bottom: 28px; }
        .eyebrow { color: #16724b; font-size: 11px; font-weight: 800; letter-spacing: .1em; margin: 0 0 8px; text-transform: uppercase; }
        h1, h2, h3, p { margin-top: 0; }
        h1 { font-size: 32px; letter-spacing: -.045em; margin-bottom: 8px; }
        .pipeline-heading p:not(.eyebrow), .pipeline-settings p, .lead-drawer header p:not(.eyebrow) { color: #666; line-height: 1.5; margin-bottom: 0; }
        .pipeline-heading label { color: #666; display: grid; font-size: 11px; gap: 6px; min-width: 220px; }
        select, input, textarea { background: #fff; border: 1px solid #d6d6d0; border-radius: 5px; color: #171717; font: inherit; padding: 10px 11px; width: 100%; }
        textarea { min-height: 94px; resize: vertical; }
        .pipeline-board { display: grid; gap: 13px; grid-template-columns: repeat(5, minmax(190px, 1fr)); overflow-x: auto; padding-bottom: 10px; }
        .pipeline-lane { background: #efefec; border: 1px solid #deded9; min-height: 380px; min-width: 190px; }
        .pipeline-lane > header { align-items: center; border-bottom: 1px solid #deded9; display: flex; justify-content: space-between; padding: 13px; }
        .pipeline-lane > header span { color: #666; font-size: 12px; }
        .pipeline-cards { display: grid; gap: 9px; padding: 9px; }
        .pipeline-card { background: #fff; border: 1px solid #deded9; cursor: pointer; display: grid; gap: 6px; padding: 13px; text-align: left; }
        .pipeline-card:hover { border-color: #171717; }
        .pipeline-card strong { font-size: 14px; }
        .pipeline-card span, .pipeline-card small { color: #666; font-size: 12px; }
        .pipeline-card em { color: #16724b; font-size: 11px; font-style: normal; font-weight: 700; }
        .lane-empty, .pipeline-empty { color: #777; font-size: 13px; }
        .pipeline-empty { background: #fff; border: 1px solid #deded9; padding: 28px; }
        .pipeline-settings { background: #fff; border: 1px solid #deded9; max-width: 680px; padding: 28px; }
        .pipeline-settings ul { line-height: 1.8; padding-left: 20px; }
        .pipeline-error { background: #fff0ee; border: 1px solid #f0b7ad; color: #9f2e1d; margin-bottom: 20px; padding: 12px; }
        .lead-drawer { background: #fff; border-left: 1px solid #deded9; box-shadow: -12px 0 35px #1111; height: 100vh; overflow-y: auto; padding: 26px; position: fixed; right: 0; top: 0; width: min(100%, 470px); z-index: 10; }
        .lead-drawer > header { align-items: start; display: flex; justify-content: space-between; margin-bottom: 24px; }
        .lead-drawer h2 { font-size: 25px; letter-spacing: -.04em; margin-bottom: 5px; }
        .lead-facts { border-bottom: 1px solid #deded9; border-top: 1px solid #deded9; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 16px 0; }
        .lead-facts span { color: #444; display: grid; font-size: 13px; gap: 3px; }
        .lead-facts strong { color: #777; font-size: 10px; letter-spacing: .06em; text-transform: uppercase; }
        .activity-form, .activity-history { border-bottom: 1px solid #deded9; display: grid; gap: 13px; padding: 22px 0; }
        .activity-form h3, .activity-history h3 { font-size: 15px; margin-bottom: 0; }
        .activity-form label { color: #555; display: grid; font-size: 12px; gap: 6px; }
        .save-activity { background: #171717; border: 0; color: #fff; cursor: pointer; font: inherit; font-weight: 700; padding: 12px 14px; }
        .save-activity:disabled { opacity: .65; }
        .activity-history article { border-top: 1px solid #ecece8; padding: 12px 0; }
        .activity-history article strong, .activity-history article span { display: block; }
        .activity-history article strong { font-size: 13px; text-transform: capitalize; }
        .activity-history article span, .activity-history > p { color: #777; font-size: 12px; }
        .activity-history article p { font-size: 13px; line-height: 1.45; margin: 6px 0 0; }
        @media (max-width: 800px) { .pipeline-header { grid-template-columns: 1fr auto; gap: 8px; padding: 12px 16px; } .pipeline-header nav { grid-column: 1 / -1; order: 3; } .pipeline-brand span, .pipeline-user span { display: none; } .pipeline-main { padding: 26px 16px; } .pipeline-heading { align-items: stretch; flex-direction: column; } .pipeline-heading label { min-width: 0; } }
      `}</style>
    </div>
  );
}
