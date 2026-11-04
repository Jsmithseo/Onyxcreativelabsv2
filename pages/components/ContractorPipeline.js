import { useEffect, useMemo, useState } from 'react';

const workableStages = ['New', 'Contacted', 'Qualified', 'Appointment Set', 'Do Not Call'];
const dispositions = ['Connected — qualified', 'Connected — follow up', 'Left voicemail', 'No answer', 'Not interested'];
const appointmentTypes = ['Discovery call', 'Product demo', 'Technical review', 'Follow-up meeting'];
const lanes = [['appointments', 'Appointments'], ['followups', 'Follow-ups due'], ['open', 'Open'], ['won', 'Won'], ['lost', 'Lost']];
const emptyDashboard = { stats: { calls_today: 0, talk_seconds: 0, appointments_today: 0, deals_closed: 0, connect_rate: 0, follow_ups_due: 0 }, calls: [], followUps: [] };

function money(cents) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format((Number(cents) || 0) / 100);
}

function duration(seconds) {
  const total = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return hours ? `${hours}h ${minutes}m` : minutes ? `${minutes}m` : `${total % 60}s`;
}

function dateLabel(value, includeTime = false) {
  if (!value || Number.isNaN(new Date(value).valueOf())) return '—';
  return new Date(value).toLocaleString([], { month: 'short', day: 'numeric', ...(includeTime ? { hour: 'numeric', minute: '2-digit' } : {}) });
}

function inputDateTime(value) {
  if (!value || Number.isNaN(new Date(value).valueOf())) return '';
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function pipelineLane(lead) {
  if (lead.deal_status === 'won' || lead.stage === 'Won') return 'won';
  if (lead.deal_status === 'lost' || lead.stage === 'Lost') return 'lost';
  if (lead.stage === 'Appointment Set') return 'appointments';
  const followUp = lead.next_follow_up_at ? new Date(lead.next_follow_up_at).valueOf() : NaN;
  if (Number.isFinite(followUp) && followUp <= Date.now()) return 'followups';
  if (lead.disposition === 'Connected — follow up' && !lead.next_follow_up_at) return 'followups';
  return 'open';
}

function phoneLink(value) {
  const phone = String(value || '').replace(/[^\d+]/g, '');
  return phone.length >= 7 ? `tel:${phone}` : '';
}

export default function ContractorPipeline({ signedInEmail, onSignOut }) {
  const [workspace, setWorkspace] = useState({ campaigns: [], leads: [] });
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [activeCampaign, setActiveCampaign] = useState('');
  const [activeView, setActiveView] = useState('pipeline');
  const [selectedLead, setSelectedLead] = useState(null);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [liveCall, setLiveCall] = useState(null);
  const [callSeconds, setCallSeconds] = useState(0);
  const [activity, setActivity] = useState({ activityType: 'call', disposition: '', note: '', scheduledFor: '', nextStage: '', appointmentType: appointmentTypes[0] });

  async function loadWorkspace({ keepLoading = false } = {}) {
    if (keepLoading) setLoading(true);
    try {
      const response = await fetch('/api/operations/workspace', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load pipeline.');
      setWorkspace(payload);
      setActiveCampaign((current) => {
        const requested = new URLSearchParams(window.location.search).get('campaign');
        if (requested && payload.campaigns.some((item) => item.id === requested)) return requested;
        if (current && payload.campaigns.some((item) => item.id === current)) return current;
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

  useEffect(() => {
    if (!activeCampaign) { setDashboard(emptyDashboard); return undefined; }
    let mounted = true;
    async function loadDashboard() {
      setDashboardLoading(true);
      try {
        const response = await fetch(`/api/operations/dashboard?campaign=${encodeURIComponent(activeCampaign)}`, { cache: 'no-store' });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Unable to load today’s activity.');
        if (mounted) setDashboard(payload);
      } catch (dashboardError) {
        if (mounted) setError(dashboardError.message || 'Unable to load today’s activity.');
      } finally {
        if (mounted) setDashboardLoading(false);
      }
    }
    loadDashboard();
    const interval = window.setInterval(loadDashboard, 30000);
    return () => { mounted = false; window.clearInterval(interval); };
  }, [activeCampaign]);

  useEffect(() => {
    if (!liveCall) return undefined;
    const interval = window.setInterval(() => setCallSeconds(Math.max(0, Math.floor((Date.now() - liveCall.startedAt) / 1000))), 1000);
    return () => window.clearInterval(interval);
  }, [liveCall]);

  async function openLead(lead) {
    setSelectedLead(lead);
    setDetail(null);
    setCallSeconds(0);
    setActivity({ activityType: 'call', disposition: lead.disposition || '', note: '', scheduledFor: inputDateTime(lead.next_follow_up_at), nextStage: workableStages.includes(lead.stage) ? lead.stage : '', appointmentType: appointmentTypes[0] });
    try {
      const response = await fetch(`/api/operations/leads/${encodeURIComponent(lead.id)}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load lead details.');
      setDetail(payload);
    } catch (detailError) {
      setError(detailError.message || 'Unable to load lead details.');
    }
  }

  function startCall() {
    const link = phoneLink(detail?.lead.phone || selectedLead?.phone);
    if (!link) { setError('This lead does not have a callable phone number.'); return; }
    setCallSeconds(0);
    setLiveCall({ leadId: selectedLead.id, startedAt: Date.now() });
    window.location.href = link;
  }

  function endCall() {
    if (!liveCall) return;
    setCallSeconds(Math.max(0, Math.floor((Date.now() - liveCall.startedAt) / 1000)));
    setLiveCall(null);
    setActivity((current) => ({ ...current, activityType: 'call', nextStage: current.nextStage || 'Contacted' }));
  }

  async function saveActivity(event) {
    event.preventDefault();
    if (!selectedLead) return;
    if (liveCall?.leadId === selectedLead.id) { setError('End the active call before saving its activity.'); return; }
    if (activity.activityType === 'appointment' && !activity.scheduledFor) { setError('Choose an appointment date and time.'); return; }
    setSaving(true);
    try {
      const appointment = activity.activityType === 'appointment';
      const note = appointment ? [`${activity.appointmentType} scheduled.`, activity.note.trim()].filter(Boolean).join(' ') : activity.note;
      const response = await fetch('/api/operations/activities', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: selectedLead.id, activityType: activity.activityType, disposition: activity.disposition, note, durationSeconds: appointment ? 0 : callSeconds, scheduledFor: activity.scheduledFor || null, nextStage: appointment ? 'Appointment Set' : activity.nextStage }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to save activity.');
      setCallSeconds(0);
      await loadWorkspace();
      await openLead({ ...selectedLead, ...payload.lead });
    } catch (saveError) {
      setError(saveError.message || 'Unable to save activity.');
    } finally {
      setSaving(false);
    }
  }

  const visibleLeads = useMemo(() => workspace.leads.filter((lead) => lead.campaign_id === activeCampaign), [activeCampaign, workspace.leads]);
  const campaign = workspace.campaigns.find((item) => item.id === activeCampaign);
  const currentLead = detail?.lead || selectedLead;
  const activeCall = liveCall?.leadId === selectedLead?.id;
  const stats = [
    ['Calls today', dashboard.stats?.calls_today || 0], ['Talk time', duration(dashboard.stats?.talk_seconds)], ['Appointments', dashboard.stats?.appointments_today || 0], ['Deals closed', dashboard.stats?.deals_closed || 0], ['Connect rate', `${dashboard.stats?.connect_rate || 0}%`], ['Follow-ups due', dashboard.stats?.follow_ups_due || 0],
  ];

  const campaignPicker = <label className="campaign-picker">Campaign<select value={activeCampaign} onChange={(event) => setActiveCampaign(event.target.value)}>{workspace.campaigns.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>;

  return <div className="contractor-pipeline">
    <header className="pipeline-header">
      <div className="pipeline-brand"><img src="/onyx-creative-labs-logo.webp" alt="Onyx Creative Labs" width="150" height="36" /><span>BDR Dialer</span></div>
      <nav aria-label="Contractor workspace navigation">
        <button className={activeView === 'pipeline' ? 'is-active' : ''} type="button" onClick={() => setActiveView('pipeline')}>Pipeline</button>
        <button className={activeView === 'campaigns' ? 'is-active' : ''} type="button" onClick={() => setActiveView('campaigns')}>Campaigns</button>
        <button className={activeView === 'today' ? 'is-active' : ''} type="button" onClick={() => setActiveView('today')}>My day</button>
        <button className={activeView === 'settings' ? 'is-active' : ''} type="button" onClick={() => setActiveView('settings')}>Settings</button>
      </nav>
      <div className="pipeline-user"><span>{signedInEmail}</span><button type="button" onClick={onSignOut}>Sign out</button></div>
    </header>
    <main className="pipeline-main">
      {error && <p className="pipeline-error">{error}</p>}
      {activeView === 'pipeline' && <>
        <div className="pipeline-heading"><div><p className="eyebrow">Your shared pipeline</p><h1>{campaign?.name || 'Campaign pipeline'}</h1><p>Open a lead to call, schedule a follow-up or appointment, and keep shared notes up to date. Only your administrator closes deals.</p></div>{campaignPicker}</div>
        {loading ? <p className="pipeline-empty">Loading your assigned campaigns…</p> : !workspace.campaigns.length ? <p className="pipeline-empty">Your administrator has not assigned a campaign yet.</p> : <section className="pipeline-board" aria-label="Read-only deal pipeline">{lanes.map(([id, label]) => { const leadRows = visibleLeads.filter((lead) => pipelineLane(lead) === id); return <section className="pipeline-lane" key={id}><header><strong>{label}</strong><span>{leadRows.length}</span></header><div className="pipeline-cards">{leadRows.length ? leadRows.map((lead) => <button className="pipeline-card" key={lead.id} type="button" onClick={() => openLead(lead)}><strong>{lead.name}</strong><span>{lead.company || 'Individual lead'}</span><small>{lead.next_follow_up_at && id === 'followups' ? `Due ${dateLabel(lead.next_follow_up_at, true)}` : lead.stage}</small><em>{money(lead.potential_commission_cents)} potential commission</em></button>) : <p className="lane-empty">Nothing here yet.</p>}</div></section>; })}</section>}
      </>}
      {activeView === 'campaigns' && <section><div className="view-heading"><div><p className="eyebrow">Your campaign access</p><h1>Campaigns</h1><p>Select a campaign to open its shared calling queue.</p></div></div><div className="campaign-list">{workspace.campaigns.map((item) => { const count = workspace.leads.filter((lead) => lead.campaign_id === item.id).length; return <article className="campaign-card" key={item.id}><div><p className="eyebrow">Assigned</p><h2>{item.name}</h2><p>{item.description || 'Shared calling campaign.'}</p><small>{count} visible leads</small></div><button type="button" onClick={() => { setActiveCampaign(item.id); setActiveView('pipeline'); }}>Open campaign</button></article>; })}{!loading && !workspace.campaigns.length && <p className="pipeline-empty">Your administrator has not assigned a campaign yet.</p>}</div></section>}
      {activeView === 'today' && <section><div className="pipeline-heading"><div><p className="eyebrow">Your daily calling work</p><h1>My day</h1><p>Your calls and talk time are personal. Deal closures reflect the active campaign because only an administrator can close a deal.</p></div>{campaignPicker}</div><div className="metric-grid">{stats.map(([label, value]) => <article className="metric-card" key={label}><span>{label}</span><strong>{value}</strong></article>)}</div><div className="today-grid"><section className="today-panel"><header><div><p className="eyebrow">Action queue</p><h2>Follow-ups due</h2></div><span>{dashboard.stats?.follow_ups_due || 0}</span></header>{dashboardLoading ? <p>Loading today’s queue…</p> : dashboard.followUps?.length ? <div className="queue-list">{dashboard.followUps.map((lead) => <button type="button" key={lead.id} onClick={() => openLead(lead)}><strong>{lead.name}</strong><span>{lead.company || lead.phone || 'Open lead'}</span><small>Due {dateLabel(lead.next_follow_up_at, true)}</small></button>)}</div> : <p>No follow-ups are due. A scheduled follow-up stays here until you log the next call or schedule a new one.</p>}</section><section className="today-panel"><header><div><p className="eyebrow">Personal history</p><h2>Today’s calls</h2></div><span>{dashboard.stats?.calls_today || 0}</span></header>{dashboardLoading ? <p>Loading your call history…</p> : dashboard.calls?.length ? <div className="history-list">{dashboard.calls.map((call) => <article key={call.id}><strong>{call.lead_name}</strong><span>{call.disposition || 'Call logged'} · {duration(call.duration_seconds)}</span><small>{dateLabel(call.created_at, true)}</small>{call.note && <p>{call.note}</p>}</article>)}</div> : <p>Your completed calls will appear here today.</p>}</section></div></section>}
      {activeView === 'settings' && <section className="pipeline-settings"><p className="eyebrow">Workspace settings</p><h1>Your access</h1><p>You can view and work the campaigns below. Campaign access, deal closure, and commission defaults are managed by your administrator.</p><ul>{workspace.campaigns.map((item) => <li key={item.id}>{item.name}</li>)}</ul></section>}
    </main>
    {selectedLead && <aside className="lead-drawer" aria-label="Lead details"><header><div><p className="eyebrow">Lead details</p><h2>{selectedLead.name}</h2><p>{currentLead?.title || 'Lead'} {currentLead?.company ? `· ${currentLead.company}` : ''}</p></div><button type="button" disabled={activeCall} onClick={() => setSelectedLead(null)}>Close</button></header><div className="lead-facts"><span><strong>Stage</strong>{currentLead?.stage || 'New'}</span><span><strong>Deal</strong>{currentLead?.deal_status || 'open'}</span><span><strong>Potential commission</strong>{money(currentLead?.potential_commission_cents)}</span><span><strong>Phone</strong>{currentLead?.phone || '—'}</span><span><strong>Email</strong>{currentLead?.email || '—'}</span><span><strong>Time zone</strong>{currentLead?.time_zone || '—'}</span><span><strong>Campaign</strong>{currentLead?.campaign_name || campaign?.name || '—'}</span><span><strong>Source</strong>{currentLead?.source || '—'}</span></div>{currentLead?.linkedin_url && <a className="profile-link" href={currentLead.linkedin_url} target="_blank" rel="noreferrer">View LinkedIn profile ↗</a>}<section className="lead-notes"><h3>Lead notes</h3><p>{currentLead?.notes || 'No notes yet.'}</p></section><section className="call-controls"><div><p className="eyebrow">Call timer</p><strong>{activeCall ? `Live call · ${duration(callSeconds)}` : callSeconds ? `Last call · ${duration(callSeconds)}` : 'Ready to call'}</strong></div>{activeCall ? <button type="button" className="end-call" onClick={endCall}>End call</button> : <button type="button" className="start-call" disabled={!phoneLink(currentLead?.phone)} onClick={startCall}>Start call</button>}</section><form className="activity-form" onSubmit={saveActivity}><h3>{activity.activityType === 'appointment' ? 'Schedule appointment' : 'Log call activity'}</h3><label>Activity<select value={activity.activityType} onChange={(event) => setActivity({ ...activity, activityType: event.target.value })}><option value="call">Completed call / follow-up</option><option value="appointment">Schedule appointment</option></select></label>{activity.activityType === 'appointment' && <label>Meeting type<select value={activity.appointmentType} onChange={(event) => setActivity({ ...activity, appointmentType: event.target.value })}>{appointmentTypes.map((item) => <option key={item}>{item}</option>)}</select></label>}<label>Outcome<select value={activity.disposition} onChange={(event) => setActivity({ ...activity, disposition: event.target.value })}><option value="">Choose outcome</option>{dispositions.map((item) => <option key={item}>{item}</option>)}</select></label>{activity.activityType === 'call' && <label>Lead progress<select value={activity.nextStage} onChange={(event) => setActivity({ ...activity, nextStage: event.target.value })}><option value="">Keep current stage</option>{workableStages.map((item) => <option key={item}>{item}</option>)}</select></label>}<label>{activity.activityType === 'appointment' ? 'Appointment date and time' : 'Schedule follow-up (optional)'}<input type="datetime-local" value={activity.scheduledFor} onChange={(event) => setActivity({ ...activity, scheduledFor: event.target.value })} /></label><label>Notes<textarea value={activity.note} onChange={(event) => setActivity({ ...activity, note: event.target.value })} placeholder="Record what happened on the call." /></label><button className="save-activity" type="submit" disabled={saving || activeCall}>{saving ? 'Saving…' : activity.activityType === 'appointment' ? 'Schedule appointment' : 'Save call activity'}</button></form><section className="activity-history"><h3>Shared history</h3>{detail ? detail.activities.length ? detail.activities.map((item) => <article key={item.id}><strong>{item.activity_type.replace('_', ' ')}</strong><span>{item.actor_email} · {dateLabel(item.created_at, true)}{item.duration_seconds ? ` · ${duration(item.duration_seconds)}` : ''}</span>{item.scheduled_for && <small>Scheduled for {dateLabel(item.scheduled_for, true)}</small>}{item.note && <p>{item.note}</p>}</article>) : <p>No shared activity yet.</p> : <p>Loading lead history…</p>}</section></aside>}
    <style jsx>{`
      .contractor-pipeline{min-height:100vh;background:#f7f7f5;color:#171717}.pipeline-header{align-items:center;background:#fff;border-bottom:1px solid #deded9;display:grid;gap:26px;grid-template-columns:auto 1fr auto;min-height:70px;padding:12px max(28px,calc((100vw - 1240px)/2))}.pipeline-brand{align-items:center;display:flex;gap:14px}.pipeline-brand img{display:block;height:auto;width:150px}.pipeline-brand span{border-left:1px solid #deded9;font-size:14px;font-weight:700;padding-left:14px}nav{display:flex;gap:22px}nav button,.pipeline-user button,.lead-drawer header button{background:transparent;border:0;color:#666;cursor:pointer;font:inherit;padding:8px 0}nav button.is-active{border-bottom:2px solid #171717;color:#171717;font-weight:700}.pipeline-user{align-items:center;display:flex;font-size:13px;gap:12px}.pipeline-user button{color:#171717;font-weight:700}.pipeline-main{margin:0 auto;max-width:1240px;padding:38px 28px 64px}.pipeline-heading,.view-heading{align-items:end;display:flex;gap:24px;justify-content:space-between;margin-bottom:28px}.eyebrow{color:#16724b;font-size:11px;font-weight:800;letter-spacing:.1em;margin:0 0 8px;text-transform:uppercase}h1,h2,h3,p{margin-top:0}h1{font-size:32px;letter-spacing:-.045em;margin-bottom:8px}h2{font-size:20px;letter-spacing:-.025em;margin-bottom:6px}.pipeline-heading p:not(.eyebrow),.view-heading p:not(.eyebrow),.pipeline-settings p,.lead-drawer header p:not(.eyebrow){color:#666;line-height:1.5;margin-bottom:0}.campaign-picker{color:#666;display:grid;font-size:11px;gap:6px;min-width:220px}select,input,textarea{background:#fff;border:1px solid #d6d6d0;border-radius:5px;box-sizing:border-box;color:#171717;font:inherit;padding:10px 11px;width:100%}textarea{min-height:94px;resize:vertical}.pipeline-board{display:grid;gap:13px;grid-template-columns:repeat(5,minmax(190px,1fr));overflow-x:auto;padding-bottom:10px}.pipeline-lane{background:#efefec;border:1px solid #deded9;min-height:380px;min-width:190px}.pipeline-lane>header{align-items:center;border-bottom:1px solid #deded9;display:flex;justify-content:space-between;padding:13px}.pipeline-lane>header span{color:#666;font-size:12px}.pipeline-cards{display:grid;gap:9px;padding:9px}.pipeline-card{background:#fff;border:1px solid #deded9;cursor:pointer;display:grid;gap:6px;padding:13px;text-align:left}.pipeline-card:hover{border-color:#171717}.pipeline-card strong{font-size:14px}.pipeline-card span,.pipeline-card small{color:#666;font-size:12px}.pipeline-card em{color:#16724b;font-size:11px;font-style:normal;font-weight:700}.lane-empty,.pipeline-empty{color:#777;font-size:13px}.pipeline-empty{background:#fff;border:1px solid #deded9;padding:28px}.pipeline-error{background:#fff0ee;border:1px solid #f0b7ad;color:#9f2e1d;margin-bottom:20px;padding:12px}.campaign-list{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(270px,1fr))}.campaign-card{align-items:end;background:#fff;border:1px solid #deded9;display:flex;gap:20px;justify-content:space-between;min-height:190px;padding:22px}.campaign-card p{color:#666;line-height:1.45}.campaign-card small{color:#777}.campaign-card button,.start-call,.end-call{background:#171717;border:1px solid #171717;color:#fff;cursor:pointer;font:inherit;font-weight:700;padding:11px 13px;white-space:nowrap}.campaign-card button:hover,.start-call:hover{background:#333}.start-call:disabled{cursor:not-allowed;opacity:.45}.end-call{background:#fff;color:#171717}.metric-grid{border:1px solid #deded9;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));margin-bottom:14px}.metric-card{background:#fff;border-right:1px solid #deded9;padding:18px}.metric-card:last-child{border-right:0}.metric-card span{color:#666;display:block;font-size:12px}.metric-card strong{display:block;font-size:25px;letter-spacing:-.04em;margin-top:7px}.today-grid{display:grid;gap:14px;grid-template-columns:1fr 1fr}.today-panel{background:#fff;border:1px solid #deded9;padding:20px}.today-panel>header{align-items:start;border-bottom:1px solid #ecece8;display:flex;justify-content:space-between;margin-bottom:12px;padding-bottom:12px}.today-panel>header>span{color:#666;font-size:13px}.today-panel>p{color:#777;font-size:13px;line-height:1.5}.queue-list,.history-list{display:grid}.queue-list button{background:transparent;border:0;border-bottom:1px solid #ecece8;cursor:pointer;display:grid;gap:4px;padding:12px 0;text-align:left}.queue-list button:last-child,.history-list article:last-child{border-bottom:0}.queue-list span,.queue-list small,.history-list span,.history-list small{color:#666;font-size:12px}.history-list article{border-bottom:1px solid #ecece8;padding:12px 0}.history-list strong,.history-list span,.history-list small{display:block}.history-list p{font-size:13px;line-height:1.4;margin:7px 0 0}.pipeline-settings{background:#fff;border:1px solid #deded9;max-width:680px;padding:28px}.pipeline-settings ul{line-height:1.8;padding-left:20px}.lead-drawer{background:#fff;border-left:1px solid #deded9;box-shadow:-12px 0 35px #1111;height:100vh;overflow-y:auto;padding:26px;position:fixed;right:0;top:0;width:min(100%,500px);z-index:10}.lead-drawer>header{align-items:start;display:flex;justify-content:space-between;margin-bottom:24px}.lead-drawer h2{font-size:25px;letter-spacing:-.04em;margin-bottom:5px}.lead-facts{border-bottom:1px solid #deded9;border-top:1px solid #deded9;display:grid;gap:16px;grid-template-columns:1fr 1fr;padding:16px 0}.lead-facts span{color:#444;display:grid;font-size:13px;gap:3px;min-width:0;overflow-wrap:anywhere}.lead-facts strong{color:#777;font-size:10px;letter-spacing:.06em;text-transform:uppercase}.profile-link{color:#171717;display:inline-block;font-size:13px;font-weight:700;margin-top:16px}.lead-notes{border-bottom:1px solid #deded9;padding:20px 0}.lead-notes h3{font-size:15px;margin-bottom:7px}.lead-notes p{color:#555;font-size:13px;line-height:1.5;margin-bottom:0;white-space:pre-wrap}.call-controls{align-items:center;border-bottom:1px solid #deded9;display:flex;justify-content:space-between;padding:18px 0}.call-controls .eyebrow{margin-bottom:4px}.call-controls strong{font-size:14px}.activity-form,.activity-history{border-bottom:1px solid #deded9;display:grid;gap:13px;padding:22px 0}.activity-form h3,.activity-history h3{font-size:15px;margin-bottom:0}.activity-form label{color:#555;display:grid;font-size:12px;gap:6px}.save-activity{background:#171717;border:0;color:#fff;cursor:pointer;font:inherit;font-weight:700;padding:12px 14px}.save-activity:disabled{opacity:.65}.activity-history article{border-top:1px solid #ecece8;padding:12px 0}.activity-history article strong,.activity-history article span,.activity-history article small{display:block}.activity-history article strong{font-size:13px;text-transform:capitalize}.activity-history article span,.activity-history article small,.activity-history>p{color:#777;font-size:12px}.activity-history article p{font-size:13px;line-height:1.45;margin:6px 0 0}@media(max-width:900px){.metric-grid{grid-template-columns:repeat(3,1fr)}.metric-card:nth-child(3){border-right:0}.metric-card:nth-child(-n+3){border-bottom:1px solid #deded9}}@media(max-width:800px){.pipeline-header{grid-template-columns:1fr auto;gap:8px;padding:12px 16px}.pipeline-header nav{grid-column:1/-1;order:3;overflow-x:auto}.pipeline-brand span,.pipeline-user span{display:none}.pipeline-main{padding:26px 16px}.pipeline-heading,.view-heading{align-items:stretch;flex-direction:column}.campaign-picker{min-width:0}.today-grid{grid-template-columns:1fr}}@media(max-width:520px){.metric-grid{grid-template-columns:repeat(2,1fr)}.metric-card:nth-child(3){border-right:1px solid #deded9}.metric-card:nth-child(2n){border-right:0}.metric-card:nth-child(-n+4){border-bottom:1px solid #deded9}.campaign-card{align-items:start;flex-direction:column}}
    `}</style>
  </div>;
}
