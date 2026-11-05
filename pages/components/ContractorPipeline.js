import { useEffect, useMemo, useRef, useState } from 'react';
import { previewContractorCsv } from '../../lib/contractorLeadImport.mjs';

const workableStages = ['New', 'Contacted', 'Qualified', 'Appointment Set', 'Pitched', 'Do Not Call'];
const dispositions = ['Connected — qualified', 'Connected — follow up', 'Left voicemail', 'No answer', 'Not interested'];
const appointmentTypes = ['Discovery call', 'Product demo', 'Technical review', 'Follow-up meeting'];
const calendlyDiscoveryUrl = 'https://calendly.com/softwaresmitty/discovery';
const lanes = [['followups', 'Follow-ups'], ['appointments', 'Appointments'], ['pitched', 'Pitched / presented'], ['won', 'Wins'], ['lost', 'Loss']];
const emptyDashboard = { stats: { calls_today: 0, talk_seconds: 0, appointments_today: 0, deals_closed: 0, connect_rate: 0, follow_ups_due: 0 }, calls: [], followUps: [] };
const zoneDefinitions = [['PT', 'Pacific', 'America/Los_Angeles'], ['MT', 'Mountain', 'America/Denver'], ['CT', 'Central', 'America/Chicago'], ['ET', 'Eastern', 'America/New_York']];
const queuePageSize = 20;

async function responseJson(response, fallbackMessage) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) throw new Error(fallbackMessage);
  return response.json();
}

function money(cents) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format((Number(cents) || 0) / 100);
}

function duration(seconds) {
  const total = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return hours ? `${hours}h ${minutes}m` : minutes ? `${minutes}m` : `${total % 60}s`;
}

function goalProgress(value, target) {
  if (!target) return 0;
  return Math.min(100, Math.round((Math.max(0, Number(value) || 0) / target) * 100));
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

function phoneLink(value) {
  const phone = String(value || '').replace(/[^\d+]/g, '');
  return phone.length >= 7 ? `tel:${phone}` : '';
}

function leadIndustry(lead) {
  return String(lead?.notes || '').match(/^Industry:\s*(.+)$/im)?.[1]?.trim() || 'Not specified';
}

function pipelineLane(lead) {
  if (lead.deal_status === 'won' || lead.stage === 'Won') return 'won';
  if (lead.deal_status === 'lost' || lead.stage === 'Lost') return 'lost';
  const followUp = lead.next_follow_up_at ? new Date(lead.next_follow_up_at).valueOf() : NaN;
  if (Number.isFinite(followUp) && followUp <= Date.now()) return 'followups';
  if (lead.disposition === 'Connected — follow up' && !lead.next_follow_up_at) return 'followups';
  if (lead.stage === 'Appointment Set') return 'appointments';
  if (lead.stage === 'Pitched' || lead.stage === 'Qualified') return 'pitched';
  return null;
}

function preferredZone(leads) {
  const hour = new Date().getHours();
  const order = hour < 9 ? ['ET', 'CT', 'MT', 'PT'] : hour < 11 ? ['CT', 'ET', 'MT', 'PT'] : hour < 13 ? ['MT', 'CT', 'PT', 'ET'] : ['PT', 'MT', 'CT', 'ET'];
  return order.find((zone) => leads.some((lead) => lead.time_zone === zone)) || order[0];
}

function queueZoneOrder() {
  const hour = new Date().getHours();
  return hour < 9
    ? ['ET', 'CT', 'MT', 'PT']
    : hour < 11
      ? ['CT', 'ET', 'MT', 'PT']
      : hour < 13
        ? ['MT', 'CT', 'PT', 'ET']
        : ['PT', 'MT', 'CT', 'ET'];
}

function isDue(lead) {
  const followUp = lead.next_follow_up_at
    ? new Date(lead.next_follow_up_at).valueOf()
    : NaN;
  return Number.isFinite(followUp) && followUp <= Date.now();
}

function sameLocalDate(value, dateInput) {
  if (!dateInput || !value || Number.isNaN(new Date(value).valueOf())) {
    return !dateInput;
  }
  return new Date(value).toLocaleDateString('en-CA') === dateInput;
}

function CallingWindows({ leads }) {
  const [now, setNow] = useState(Date.now());
  const [selectedZone, setSelectedZone] = useState('');
  const priority = selectedZone || preferredZone(leads);
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(interval);
  }, []);
  return <>
    <section className="timezone-map" aria-label="United States calling time zones">
    <div className="timezone-head"><strong>U.S. calling windows</strong><span>{priority} leads prioritized</span></div>
    <div className="timezone-content">
      <svg className="us-map" viewBox="0 0 360 90" role="img" aria-label="Select a United States calling time zone">
        <path tabIndex="0" role="button" aria-label="Prioritize Pacific time leads" aria-pressed={priority === 'PT'} onClick={() => setSelectedZone('PT')} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && setSelectedZone('PT')} className={`zone-shape zone-pt ${priority === 'PT' ? 'active' : ''}`} d="M11 15 L76 9 L83 29 L71 48 L84 76 L49 80 L37 66 L18 69 L10 48 Z" />
        <path tabIndex="0" role="button" aria-label="Prioritize Mountain time leads" aria-pressed={priority === 'MT'} onClick={() => setSelectedZone('MT')} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && setSelectedZone('MT')} className={`zone-shape zone-mt ${priority === 'MT' ? 'active' : ''}`} d="M76 9 L137 10 L144 24 L137 42 L151 65 L130 78 L84 76 L71 48 L83 29 Z" />
        <path tabIndex="0" role="button" aria-label="Prioritize Central time leads" aria-pressed={priority === 'CT'} onClick={() => setSelectedZone('CT')} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && setSelectedZone('CT')} className={`zone-shape zone-ct ${priority === 'CT' ? 'active' : ''}`} d="M137 10 L211 16 L232 29 L226 48 L240 68 L205 80 L151 65 L137 42 L144 24 Z" />
        <path tabIndex="0" role="button" aria-label="Prioritize Eastern time leads" aria-pressed={priority === 'ET'} onClick={() => setSelectedZone('ET')} onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && setSelectedZone('ET')} className={`zone-shape zone-et ${priority === 'ET' ? 'active' : ''}`} d="M211 16 L296 13 L340 28 L349 45 L334 57 L346 77 L311 83 L292 70 L240 68 L226 48 L232 29 Z" />
        <text className="map-label" x="51" y="51">PT</text><text className="map-label" x="111" y="47">MT</text><text className="map-label" x="190" y="48">CT</text><text className="map-label" x="294" y="50">ET</text>
      </svg>
      <div className="zone-times">{zoneDefinitions.map(([id, label, timeZone]) => <button type="button" aria-pressed={priority === id} className={`zone-time ${priority === id ? 'active' : ''}`} key={id} onClick={() => setSelectedZone(id)}><strong>{label}</strong><span>{new Intl.DateTimeFormat([], { timeZone, hour: 'numeric', minute: '2-digit' }).format(now)}</span></button>)}</div>
    </div>
    </section>
    <style jsx global>{`
      .bdr-workspace .timezone-map{position:relative;overflow:hidden;min-height:120px;padding:13px 16px;border:1px solid #171717;border-radius:7px;color:#fff;background:#171717}
      .bdr-workspace .timezone-map:before{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 0 38%,rgba(255,255,255,.075) 49%,transparent 62%);animation:bdr-calling-window-sweep 8s ease-in-out infinite;pointer-events:none}
      .bdr-workspace .timezone-head{position:relative;z-index:1;display:flex;justify-content:space-between;align-items:baseline;margin-bottom:7px}
      .bdr-workspace .timezone-head strong{font-size:12px;letter-spacing:.02em;text-transform:uppercase}
      .bdr-workspace .timezone-head span{padding:3px 7px;border:1px solid rgba(255,255,255,.23);border-radius:999px;color:#fff;font-size:10px}
      .bdr-workspace .timezone-content{position:relative;z-index:1;display:grid;grid-template-columns:1.08fr 1fr;align-items:center;gap:20px}
      .bdr-workspace .us-map{width:100%;max-width:330px;height:67px;display:block}
      .bdr-workspace .zone-shape{cursor:pointer;stroke:rgba(255,255,255,.25);stroke-width:1.2}.bdr-workspace .zone-shape:focus{outline:none}.bdr-workspace .zone-shape:focus-visible{stroke:#fff;stroke-width:2.5}
      .bdr-workspace .zone-shape.active{fill:#fff;filter:drop-shadow(0 0 7px rgba(255,255,255,.45))}
      .bdr-workspace .zone-pt{fill:#343434}.bdr-workspace .zone-mt{fill:#4c4c4c}.bdr-workspace .zone-ct{fill:#666}.bdr-workspace .zone-et{fill:#858585}
      .bdr-workspace .map-label{fill:#fff;font:700 7px Inter,ui-sans-serif,system-ui,sans-serif;text-anchor:middle}
      .bdr-workspace .zone-times{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px 12px}
      .bdr-workspace .zone-time{padding:5px 8px;border:1px solid rgba(255,255,255,.14);border-radius:4px;color:#bdbdbd;background:transparent;text-align:left;font:inherit;font-size:10px;line-height:1.2;cursor:pointer}.bdr-workspace .zone-time:hover{border-color:rgba(255,255,255,.7)}
      .bdr-workspace .zone-time strong{display:block;color:#fff;font-size:11px}.bdr-workspace .zone-time.active{border-color:#fff;background:#fff;color:#555}.bdr-workspace .zone-time.active strong{color:#171717}
      @keyframes bdr-calling-window-sweep{0%,100%{transform:translateX(-55%);opacity:.2}50%{transform:translateX(55%);opacity:.85}}
      @media(max-width:700px){.bdr-workspace .timezone-content{grid-template-columns:1fr}.bdr-workspace .us-map{max-width:none}.bdr-workspace .zone-times{grid-template-columns:repeat(4,minmax(0,1fr))}}
      @media(max-width:520px){.bdr-workspace .timezone-content{gap:6px}.bdr-workspace .zone-times{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `}</style>
  </>;
}

export default function ContractorPipeline({ signedInEmail, onSignOut }) {
  const [workspace, setWorkspace] = useState({ campaigns: [], campaignSummaries: [], leads: [] });
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [activeCampaign, setActiveCampaign] = useState('');
  const [activeView, setActiveView] = useState('operations');
  const [selectedLead, setSelectedLead] = useState(null);
  const [pipelineReadOnly, setPipelineReadOnly] = useState(false);
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [liveCall, setLiveCall] = useState(null);
  const [callSeconds, setCallSeconds] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [queueFilters, setQueueFilters] = useState({
    query: '',
    zone: '',
    stage: '',
    disposition: '',
    activityDate: '',
  });
  const [queuePage, setQueuePage] = useState(0);
  const [showScheduler, setShowScheduler] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [importCsv, setImportCsv] = useState('');
  const [importPreview, setImportPreview] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState('');
  const calendarEmbedRef = useRef(null);
  const calendlyBookingRef = useRef('');
  const [activity, setActivity] = useState({ activityType: 'call', disposition: '', note: '', scheduledFor: '', nextStage: '', appointmentType: appointmentTypes[0] });

  async function loadWorkspace({ keepLoading = false } = {}) {
    if (keepLoading) setLoading(true);
    try {
      const response = await fetch('/api/operations/workspace', { cache: 'no-store' });
      const payload = await responseJson(response, 'The workspace service returned an unexpected response. Refresh and try again.');
      if (!response.ok) throw new Error(payload.error || 'Unable to load your workspace.');
      setWorkspace(payload);
      setActiveCampaign((current) => {
        const requested = new URLSearchParams(window.location.search).get('campaign');
        if (requested && payload.campaigns.some((item) => item.id === requested)) return requested;
        if (current && payload.campaigns.some((item) => item.id === current)) return current;
        return payload.campaigns[0]?.id || '';
      });
      setError('');
    } catch (loadError) {
      setError(loadError.message || 'Unable to load your workspace.');
    } finally {
      setLoading(false);
    }
  }

  async function loadDashboard(campaignId = activeCampaign) {
    if (!campaignId) { setDashboard(emptyDashboard); return; }
    setDashboardLoading(true);
    try {
      const response = await fetch(`/api/operations/dashboard?campaign=${encodeURIComponent(campaignId)}`, { cache: 'no-store' });
      const payload = await responseJson(response, 'Today’s activity could not be loaded. Refresh and try again.');
      if (!response.ok) throw new Error(payload.error || 'Unable to load today’s activity.');
      setDashboard(payload);
    } catch (dashboardError) {
      setError(dashboardError.message || 'Unable to load today’s activity.');
    } finally {
      setDashboardLoading(false);
    }
  }

  useEffect(() => {
    loadWorkspace({ keepLoading: true });
    const interval = window.setInterval(() => loadWorkspace(), 15000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeCampaign) { setDashboard(emptyDashboard); return undefined; }
    loadDashboard(activeCampaign);
    const interval = window.setInterval(() => loadDashboard(activeCampaign), 30000);
    return () => window.clearInterval(interval);
  }, [activeCampaign]);

  useEffect(() => {
    if (!liveCall) return undefined;
    const interval = window.setInterval(() => setCallSeconds(Math.max(0, Math.floor((Date.now() - liveCall.startedAt) / 1000))), 1000);
    return () => window.clearInterval(interval);
  }, [liveCall]);

  useEffect(() => {
    if (!calendarOpen || !calendarEmbedRef.current || !selectedLead) return undefined;

    const initialiseCalendar = () => {
      const container = calendarEmbedRef.current;
      if (!container || !window.Calendly) return;
      const name = selectedLead.name || '';
      const [firstName = '', ...lastNameParts] = name.split(/\s+/);
      container.replaceChildren();
      window.Calendly.initInlineWidget({
        url: calendlyDiscoveryUrl,
        parentElement: container,
        prefill: {
          name,
          firstName,
          lastName: lastNameParts.join(' '),
          email: selectedLead.email || '',
          customAnswers: selectedLead.phone ? { a1: selectedLead.phone } : {},
        },
        utm: {
          utmSource: 'onyx-bdr',
          utmContent: selectedLead.id,
        },
      });
    };

    if (window.Calendly) {
      initialiseCalendar();
      return undefined;
    }

    const existing = document.getElementById('calendly-widget-script');
    if (existing) {
      existing.addEventListener('load', initialiseCalendar, { once: true });
      return () => existing.removeEventListener('load', initialiseCalendar);
    }

    const script = document.createElement('script');
    script.id = 'calendly-widget-script';
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.addEventListener('load', initialiseCalendar, { once: true });
    document.head.appendChild(script);
    return () => script.removeEventListener('load', initialiseCalendar);
  }, [calendarOpen, selectedLead]);

  useEffect(() => {
    async function recordCalendlyBooking(event) {
      if (event.origin !== 'https://calendly.com' || event.data?.event !== 'calendly.event_scheduled' || !selectedLead) return;
      const payload = event.data?.payload || {};
      const bookingKey = payload.event?.uri || payload.invitee?.uri || '';
      if (bookingKey && calendlyBookingRef.current === bookingKey) return;
      calendlyBookingRef.current = bookingKey || `${selectedLead.id}:${Date.now()}`;
      const scheduledFor = payload.event?.start_time || payload.event?.startTime || payload.invitee?.scheduled_event?.start_time || null;

      setCalendarOpen(false);
      setShowScheduler(false);
      setSaving(true);
      try {
        const response = await fetch('/api/operations/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId: selectedLead.id,
            activityType: 'appointment',
            note: scheduledFor ? 'Appointment booked through Calendly.' : 'Appointment booked through Calendly. The meeting time is managed in Calendly.',
            durationSeconds: 0,
            scheduledFor,
            nextStage: 'Appointment Set',
          }),
        });
        const result = await responseJson(response, 'The appointment could not be recorded. Refresh and try again.');
        if (!response.ok) throw new Error(result.error || 'Unable to record the Calendly appointment.');
        await loadWorkspace();
        await loadDashboard(selectedLead.campaign_id);
        await openLead({ ...selectedLead, ...result.lead });
      } catch (bookingError) {
        setError(bookingError.message || 'Unable to record the Calendly appointment.');
      } finally {
        setSaving(false);
      }
    }

    window.addEventListener('message', recordCalendlyBooking);
    return () => window.removeEventListener('message', recordCalendlyBooking);
  }, [selectedLead]);

  async function openLead(lead, { readOnlyPipeline = false } = {}) {
    setSelectedLead(lead);
    setPipelineReadOnly(readOnlyPipeline);
    setDetail(null);
    setDetailError('');
    setCallSeconds(0);
    setShowScheduler(false);
    setCalendarOpen(false);
    calendlyBookingRef.current = '';
    setActivity({ activityType: 'call', disposition: lead.disposition || '', note: '', scheduledFor: inputDateTime(lead.next_follow_up_at), nextStage: workableStages.includes(lead.stage) ? lead.stage : '', appointmentType: appointmentTypes[0] });
    try {
      const response = await fetch(`/api/operations/leads/${encodeURIComponent(lead.id)}`, { cache: 'no-store' });
      const payload = await responseJson(response, 'Lead details could not be loaded. Refresh and try again.');
      if (!response.ok) throw new Error(payload.error || 'Unable to load lead details.');
      setDetail(payload);
    } catch (loadError) {
      const message = loadError.message || 'Unable to load lead details.';
      setDetailError(message);
      setError(message);
    }
  }

  function openCampaign(id) {
    setActiveCampaign(id);
    setQueueFilters({ query: '', zone: '', stage: '', disposition: '', activityDate: '' });
    setQueuePage(0);
    setSelectedLead(null);
    setPipelineReadOnly(false);
    setDetail(null);
    setActiveView('leads');
  }

  function switchView(view) {
    if (view === 'pipeline' && liveCall) {
      setError('End the active call before opening the read-only pipeline.');
      return;
    }
    setActiveView(view);
    setPipelineReadOnly(view === 'pipeline');
  }

  function updateQueueFilters(updates) {
    setQueueFilters((current) => ({ ...current, ...updates }));
    setQueuePage(0);
  }

  async function previewImport(event) {
    const file = event.target.files?.[0];
    setImportResult('');
    if (!file) return;
    const csv = await file.text();
    setImportCsv(csv);
    setImportPreview(previewContractorCsv(csv));
    event.target.value = '';
  }

  async function importLeads() {
    if (!activeCampaign || !importPreview?.accepted?.length || !importCsv) return;
    setImporting(true);
    setImportResult('');
    try {
      const response = await fetch('/api/operations/contractor-lead-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: activeCampaign, csv: importCsv }),
      });
      const payload = await responseJson(response, 'The lead import service returned an unexpected response.');
      if (!response.ok) throw new Error(payload.error || 'Unable to import leads.');
      setImportResult(`${payload.imported} imported · ${payload.skipped} skipped · ${payload.rejected} rejected`);
      setImportCsv('');
      setImportPreview(null);
      await loadWorkspace();
      await loadDashboard(activeCampaign);
    } catch (importError) {
      setImportResult(importError.message || 'Unable to import leads.');
    } finally {
      setImporting(false);
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
    if (activity.activityType === 'call' && callSeconds > 0 && !activity.disposition) {
      setError('Choose an outcome before saving a recorded call.');
      return;
    }
    if (activity.activityType === 'appointment' && !activity.scheduledFor) { setError('Choose an appointment date and time.'); return; }
    setSaving(true);
    try {
      const appointment = activity.activityType === 'appointment';
      const note = appointment ? [`${activity.appointmentType} scheduled.`, activity.note.trim()].filter(Boolean).join(' ') : activity.note;
      const response = await fetch('/api/operations/activities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId: selectedLead.id, activityType: activity.activityType, disposition: activity.disposition, note, durationSeconds: appointment ? 0 : callSeconds, scheduledFor: activity.scheduledFor || null, nextStage: appointment ? 'Appointment Set' : activity.nextStage }) });
      const payload = await responseJson(response, 'The lead activity could not be saved. Refresh and try again.');
      if (!response.ok) throw new Error(payload.error || 'Unable to save activity.');
      setCallSeconds(0);
      await loadWorkspace();
      await loadDashboard(selectedLead.campaign_id);
      await openLead({ ...selectedLead, ...payload.lead });
    } catch (saveError) {
      setError(saveError.message || 'Unable to save activity.');
    } finally {
      setSaving(false);
    }
  }

  const active = workspace.campaigns.find((campaign) => campaign.id === activeCampaign);
  const activeSummary = workspace.campaignSummaries?.find((summary) => summary.campaign_id === activeCampaign) || {};
  const visibleLeads = useMemo(() => workspace.leads.filter((lead) => lead.campaign_id === activeCampaign), [workspace.leads, activeCampaign]);
  const pipelineLeads = useMemo(() => visibleLeads.filter((lead) => lead.worked_by_principal), [visibleLeads]);
  const queueLeads = useMemo(() => {
    const query = queueFilters.query.trim().toLowerCase();
    const zones = queueZoneOrder();
    return visibleLeads
      .filter((lead) => {
        const haystack = [lead.name, lead.company, lead.phone, lead.email]
          .join(' ')
          .toLowerCase();
        return (
          (!query || haystack.includes(query)) &&
          (!queueFilters.zone || lead.time_zone === queueFilters.zone) &&
          (!queueFilters.stage || lead.stage === queueFilters.stage) &&
          (!queueFilters.disposition || lead.disposition === queueFilters.disposition) &&
          sameLocalDate(lead.last_activity_at, queueFilters.activityDate)
        );
      })
      .sort((left, right) => {
        const leftDue = isDue(left);
        const rightDue = isDue(right);
        if (leftDue !== rightDue) return leftDue ? -1 : 1;
        if (leftDue && rightDue) {
          return new Date(left.next_follow_up_at) - new Date(right.next_follow_up_at);
        }
        const zoneDifference = zones.indexOf(left.time_zone) - zones.indexOf(right.time_zone);
        if (zoneDifference) return zoneDifference;
        return String(left.name).localeCompare(String(right.name));
      });
  }, [queueFilters, visibleLeads]);
  const queuePageCount = Math.max(1, Math.ceil(queueLeads.length / queuePageSize));
  const safeQueuePage = Math.min(queuePage, queuePageCount - 1);
  const queuePageLeads = queueLeads.slice(
    safeQueuePage * queuePageSize,
    safeQueuePage * queuePageSize + queuePageSize
  );
  const queueRangeStart = queueLeads.length ? safeQueuePage * queuePageSize + 1 : 0;
  const queueRangeEnd = Math.min((safeQueuePage + 1) * queuePageSize, queueLeads.length);
  const queuePriority = queueZoneOrder()[0];
  const currentLead = detail?.lead || selectedLead;
  const activeCall = liveCall?.leadId === selectedLead?.id;
  const today = new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  const campaignPicker = <label className="campaign-picker">Campaign<select value={activeCampaign} onChange={(event) => setActiveCampaign(event.target.value)}>{workspace.campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}</select></label>;
  const metrics = [['Calls today', dashboard.stats?.calls_today || 0], ['Talk time', duration(dashboard.stats?.talk_seconds)], ['Appointments', dashboard.stats?.appointments_today || 0], ['Deals closed', dashboard.stats?.deals_closed || 0], ['Connect rate', `${dashboard.stats?.connect_rate || 0}%`], ['Follow-ups due', dashboard.stats?.follow_ups_due || 0]];
  const goals = [['Calls today', dashboard.stats?.calls_today || 0, workspace.goals?.calls ?? 120], ['Appointments today', dashboard.stats?.appointments_today || 0, workspace.goals?.appointments ?? 3]];

  return <div className="bdr-workspace">
    <header className="workspace-header"><div className="header-left"><img className="logo" src="/onyx-creative-labs-logo.webp" alt="Onyx Creative Labs" width="150" height="36" /><nav><button className={activeView === 'operations' ? 'active' : ''} type="button" onClick={() => switchView('operations')}>Dashboard</button><button className={activeView === 'pipeline' ? 'active' : ''} type="button" onClick={() => switchView('pipeline')}>Pipeline</button><button className={activeView === 'leads' ? 'active' : ''} type="button" onClick={() => switchView('leads')}>Leads</button></nav></div><div className="rep"><span className="dot" />{signedInEmail}<button type="button" onClick={onSignOut}>Sign out</button></div></header>
    <main>
      {error && <p className="error">{error}</p>}
      {activeView === 'operations' && <section>
        <div className="page-head"><h1>Business development dashboard</h1><span>BDR workspace</span></div>
        <div className="home-controls"><div className="control-box campaign-control">{workspace.campaigns.length ? <>{campaignPicker}<button className="primary" type="button" disabled={!activeCampaign} onClick={() => openCampaign(activeCampaign)}>Open campaign <span aria-hidden="true">→</span></button></> : <div className="campaign-empty"><span className="campaign-empty-label">Campaign</span><strong>No campaign assigned</strong><p>Your administrator will assign a campaign before you can begin calling.</p></div>}</div><CallingWindows leads={visibleLeads} /></div>
        <div className="stats-heading"><strong>{active?.name || 'Your campaigns'} · {today}</strong><div className="stats-controls"><span>Campaign</span><button type="button" onClick={() => loadDashboard()} disabled={dashboardLoading}>{dashboardLoading ? 'Refreshing…' : 'Refresh'}</button></div></div>
        <div className="metrics">{metrics.map(([label, value], index) => <article className={`metric ${index === 2 ? 'metric-action' : ''}`} key={label} onClick={index === 2 ? () => setShowHistory(!showHistory) : undefined}><span>{label}</span><strong>{value}</strong></article>)}</div>
        <section className="panel bdr-goals"><div className="panel-head"><span>My goals</span><span>Daily targets</span></div><div className="goals-grid">{goals.map(([label, value, target]) => <article className="goal-card" key={label}><span>{label}</span><strong>{value} / {target}</strong><div className="goal-track" aria-label={`${label}: ${value} of ${target}`}><i style={{ width: `${goalProgress(value, target)}%` }} /></div></article>)}</div></section>
        <section className="panel campaign-panel"><div className="panel-head"><span>Campaigns</span><span>{workspace.campaigns.length} active</span></div>{loading ? <div className="empty">Loading assigned campaigns…</div> : workspace.campaigns.map((campaign) => { const summary = workspace.campaignSummaries?.find((row) => row.campaign_id === campaign.id) || {}; return <div className="campaign-row" key={campaign.id}><span><strong>{campaign.name}</strong><small>Active</small></span><span>{summary.lead_count || 0} leads</span><span>{summary.call_count || 0} calls</span><span>{summary.appointment_count || 0} appts</span><span>{summary.won_count || 0} won</span><button className="campaign-open" type="button" onClick={() => openCampaign(campaign.id)}>Open queue <span aria-hidden="true">→</span></button></div>; })}{!loading && !workspace.campaigns.length && <div className="empty">Your administrator has not assigned a campaign yet.</div>}</section>
        <div className="operations-grid"><section className="panel"><div className="panel-head"><span>Today’s calls</span><span>{dashboard.calls?.length || 0} logged</span></div>{showHistory && dashboard.calls?.length ? <div>{dashboard.calls.map((call) => <button className="history-row" type="button" key={call.id} onClick={() => openLead({ id: call.lead_id, name: call.lead_name, campaign_id: activeCampaign })}><span><strong>{call.lead_name}</strong><small>{call.disposition || 'Call logged'}</small></span><span>{duration(call.duration_seconds)}</span><span>{dateLabel(call.created_at, true)}</span></button>)}</div> : <div className="empty">Select Appointments above to view your call history.</div>}</section><section className="panel"><div className="panel-head"><span>Follow-ups due</span><span>{dashboard.stats?.follow_ups_due || 0} due</span></div>{dashboard.followUps?.length ? <div>{dashboard.followUps.map((lead) => <button className="history-row" type="button" key={lead.id} onClick={() => openLead(lead)}><span><strong>{lead.name}</strong><small>{lead.company || lead.phone || 'Open lead'}</small></span><span>Due</span><span>{dateLabel(lead.next_follow_up_at, true)}</span></button>)}</div> : <div className="empty">Scheduled follow-ups appear here on the day they are due and remain until you log the next call.</div>}</section></div>
      </section>}
      {activeView === 'pipeline' && <section><div className="page-head"><div><h1>{active?.name || 'Campaign'} pipeline</h1><p>Only leads you have worked appear here. This is a read-only view; your saved call and appointment activity updates it automatically.</p></div>{campaignPicker}</div>{!activeCampaign ? <div className="empty">Choose a campaign to open its pipeline.</div> : <div className="pipeline-board">{lanes.map(([id, label]) => { const cards = pipelineLeads.filter((lead) => pipelineLane(lead) === id); return <section className="pipeline-lane" key={id}><header><strong>{label}</strong><span>{cards.length}</span></header>{cards.length ? cards.map((lead) => <button className="pipeline-card" type="button" key={lead.id} onClick={() => openLead(lead, { readOnlyPipeline: true })}><strong>{lead.name}</strong><span>{lead.company || 'Individual lead'}</span><small>{id === 'followups' && lead.next_follow_up_at ? `Due ${dateLabel(lead.next_follow_up_at, true)}` : lead.stage}</small><em>{money(lead.potential_commission_cents)} potential commission</em></button>) : <p className="lane-empty">No {label.toLowerCase()} yet.</p>}</section>; })}</div>}</section>}
      {activeView === 'leads' && (
        <section className="queue-view">
          <div className="page-head queue-page-head">
            <h1>Call queue</h1>
            <span>{queueLeads.length ? `${queuePriority} leads prioritized · ${queuePageSize} per page` : 'No matching leads'}</span>
          </div>
          <section className="queue-workspace" aria-label="Campaign lead queue">
            <div className="queue-title">{active?.name || 'Campaign'} · prioritized leads</div>
            <div className="queue-search">
              <label htmlFor="queue-search">Search leads</label>
              <input
                id="queue-search"
                type="search"
                value={queueFilters.query}
                onChange={(event) => updateQueueFilters({ query: event.target.value })}
                placeholder="Search name, company, phone, or email — press Enter"
              />
            </div>
            <div className="queue-filters">
              <select aria-label="Filter by time zone" value={queueFilters.zone} onChange={(event) => updateQueueFilters({ zone: event.target.value })}>
                <option value="">All time zones</option>
                <option value="ET">Eastern</option>
                <option value="CT">Central</option>
                <option value="MT">Mountain</option>
                <option value="PT">Pacific</option>
              </select>
              <select aria-label="Filter by stage" value={queueFilters.stage} onChange={(event) => updateQueueFilters({ stage: event.target.value })}>
                <option value="">All stages</option>
                {['New', 'Contacted', 'Qualified', 'Appointment Set', 'Won', 'Lost', 'Do Not Call'].map((stage) => <option key={stage}>{stage}</option>)}
              </select>
              <select aria-label="Filter by disposition" value={queueFilters.disposition} onChange={(event) => updateQueueFilters({ disposition: event.target.value })}>
                <option value="">All dispositions</option>
                {dispositions.map((disposition) => <option key={disposition}>{disposition}</option>)}
              </select>
              <input aria-label="Filter by last activity date" type="date" value={queueFilters.activityDate} onChange={(event) => updateQueueFilters({ activityDate: event.target.value })} />
              <button type="button" onClick={() => updateQueueFilters({ query: '', zone: '', stage: '', disposition: '', activityDate: '' })}>Clear filters</button>
            </div>
            <div className="queue-scroll">
              <div className="queue-sheet">
                <div className="queue-grid queue-grid-head"><span></span><span>Name</span><span>Company</span><span>Phone</span><span>Time zone</span><span>Follow-up</span><span>Status</span></div>
                {queuePageLeads.map((lead, index) => (
                  <button type="button" className={`queue-grid queue-row ${selectedLead?.id === lead.id ? 'is-selected' : ''} ${index === 0 ? 'is-next' : ''}`} key={lead.id} onClick={() => openLead(lead)}>
                    <span className="queue-number">{queueRangeStart + index}</span>
                    <span className="queue-name">{lead.name}</span>
                    <span>{lead.company || '—'}</span>
                    <span>{lead.phone || '—'}</span>
                    <span>{lead.time_zone || '—'}</span>
                    <span className={isDue(lead) ? 'queue-due' : ''}>{lead.next_follow_up_at ? dateLabel(lead.next_follow_up_at) : '—'}</span>
                    <span><i className="queue-status">{lead.stage || 'New'}</i></span>
                  </button>
                ))}
                {!queuePageLeads.length && <div className="queue-empty">No leads match this queue.</div>}
              </div>
            </div>
            <div className="queue-footer">
              <span>{queueLeads.length ? `${queueRangeStart}–${queueRangeEnd} of ${queueLeads.length}` : '0 leads'}</span>
              <div><button type="button" disabled={safeQueuePage === 0} onClick={() => setQueuePage((page) => Math.max(0, page - 1))}>Previous</button><button type="button" disabled={safeQueuePage >= queuePageCount - 1} onClick={() => setQueuePage((page) => Math.min(queuePageCount - 1, page + 1))}>Next</button></div>
            </div>
          </section>
          <section className="lead-import panel" aria-label="Import leads">
            <div className="panel-head"><span>Import leads</span><span>{active?.name || 'Choose a campaign'}</span></div>
            <div className="lead-import-body">
              <p>Upload a CSV for this assigned campaign. Accepted new leads are securely assigned to you. Supported columns include name, company, title, phone, email, LinkedIn, location, time zone, industry, and notes.</p>
              <label className="secondary import-file">Choose CSV<input type="file" accept=".csv,text/csv" onChange={previewImport} disabled={!activeCampaign || importing} /></label>
              {importPreview && <div className="import-preview"><strong>{importPreview.accepted.length} ready · {importPreview.rejected.length} rejected</strong>{importPreview.rejected.slice(0, 5).map((row) => <small key={`${row.row}:${row.errors?.join('|')}`}>Row {row.row}: {row.errors.join(' ')}</small>)}<button className="primary" type="button" onClick={importLeads} disabled={!importPreview.accepted.length || importing}>{importing ? 'Importing…' : `Import ${importPreview.accepted.length} leads`}</button></div>}
              {importResult && <p className="import-result" role="status">{importResult}</p>}
            </div>
          </section>
        </section>
      )}
      {activeView === 'settings' && <section className="settings"><h1>Settings</h1><p>Your administrator controls campaign access, commission defaults, and deal closure. You can work only the campaigns listed below.</p><ul>{workspace.campaigns.map((campaign) => <li key={campaign.id}>{campaign.name}</li>)}</ul></section>}
    </main>
    {selectedLead && (
      <aside className="detail queue-detail" aria-live="polite">
        <header className="queue-detail-head">
          <div><h2>{currentLead?.name || selectedLead.name}</h2><p>{currentLead?.title && currentLead?.company ? `${currentLead.title} · ${currentLead.company}` : `${active?.name || 'Campaign'} lead`}</p></div>
          <button type="button" aria-label="Close lead details" disabled={activeCall} onClick={() => { setSelectedLead(null); setPipelineReadOnly(false); }}>×</button>
        </header>
        {!pipelineReadOnly && <div className="queue-detail-actions">
          {activeCall ? <button className="secondary" type="button" onClick={endCall}>End call</button> : <button className="primary" type="button" disabled={!phoneLink(currentLead?.phone)} onClick={startCall}>Call lead</button>}
          <button className="secondary" type="button" onClick={() => { setShowScheduler(true); setCalendarOpen(true); setActivity((current) => ({ ...current, activityType: 'appointment' })); }}>Appointment scheduler</button>
        </div>}
        {activeCall && <div className="queue-call-state">Live call · {duration(callSeconds)}</div>}
        {pipelineReadOnly ? <section className="queue-read-only"><h3>Read-only pipeline record</h3><p>Administrators manage pipeline placement. Use the Leads workspace to record calls, follow-ups, and appointments.</p></section> : <form className="queue-wrap-up" onSubmit={saveActivity}>
          <h3>{showScheduler ? 'Appointment scheduler' : 'Wrap up'}</h3>
          {showScheduler && <><p className="calendar-helper">Book the time in Calendly, then record the appointment here.</p><button className="secondary calendar-reopen" type="button" onClick={() => setCalendarOpen(true)}>Open Calendly calendar</button><label>Meeting type<select value={activity.appointmentType} onChange={(event) => setActivity({ ...activity, appointmentType: event.target.value })}>{appointmentTypes.map((item) => <option key={item}>{item}</option>)}</select></label><label>Appointment date and time<input type="datetime-local" value={activity.scheduledFor} onChange={(event) => setActivity({ ...activity, scheduledFor: event.target.value })} required /></label></>}
          {!showScheduler && <div className="queue-form-row"><label>Disposition<select value={activity.disposition} onChange={(event) => setActivity({ ...activity, disposition: event.target.value })}><option value="">Choose outcome</option>{dispositions.map((item) => <option key={item}>{item}</option>)}</select></label><label>Follow-up<input type="date" value={activity.scheduledFor.slice(0, 10)} onChange={(event) => setActivity({ ...activity, scheduledFor: event.target.value })} /></label></div>}
          <div className="queue-save-row"><button className="primary" type="submit" disabled={saving || activeCall}>{saving ? 'Saving…' : showScheduler ? 'Schedule appointment' : 'Save lead'}</button></div>
        </form>}
        <div className="queue-detail-grid">
          <label className="wide">Industry<input value={leadIndustry(currentLead)} readOnly /></label>
          <div><small>Company</small><strong>{currentLead?.company || '—'}</strong></div><div><small>Title</small><strong>{currentLead?.title || '—'}</strong></div>
          <div><small>Phone</small><strong>{currentLead?.phone || '—'}</strong></div><div><small>Email</small><strong>{currentLead?.email || '—'}</strong></div>
          <div className="wide"><small>LinkedIn</small>{currentLead?.linkedin_url ? <a href={currentLead.linkedin_url} target="_blank" rel="noreferrer">View LinkedIn profile ↗</a> : <strong>Not specified</strong>}</div>
          <div><small>Time zone</small><strong>{currentLead?.time_zone || '—'}</strong></div><div><small>Campaign</small><strong>{currentLead?.campaign_name || active?.name || '—'}</strong></div>
          <div><small>Attempts</small><strong>{detail?.activities?.filter((item) => item.activity_type === 'call').length || 0}</strong></div>{pipelineReadOnly ? <div><small>Stage</small><strong>{currentLead?.stage || 'New'}</strong></div> : <label><small>Stage</small><select value={activity.nextStage || currentLead?.stage || 'New'} onChange={(event) => setActivity({ ...activity, nextStage: event.target.value })}>{workableStages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>}
          <div className="wide"><small>Disposition</small><strong>{currentLead?.disposition || 'Not recorded'}</strong></div>
        </div>
        <section className="queue-notes"><div><h3>Notes</h3><span>{detailError || (detail ? pipelineReadOnly ? 'Shared read-only' : 'Shared with your team' : 'Loading lead history…')}</span></div>{pipelineReadOnly ? <p>{currentLead?.notes || 'No notes recorded.'}</p> : <textarea value={activity.note} onChange={(event) => setActivity({ ...activity, note: event.target.value })} placeholder="Record what happened on the call." />}</section>
        {currentLead?.campaign_id === 'reviews' && <section className="review-script"><h3>15-minute review-growth call</h3><ol><li>“Could I speak with whoever handles marketing or customer reviews?”</li><li>“Hi, I’m calling from Onyx Creative Labs. I noticed you already have reviews, and we help businesses earn more of them—and more business from them.”</li><li>“Would a quick 15-minute call in the next couple of days be useful? I have tomorrow at 10 or 11.”</li></ol></section>}
        <section className="queue-history"><h3>Lead call history</h3>{detail?.activities?.length ? detail.activities.map((item) => <article key={item.id}><strong>{item.activity_type.replace('_', ' ')}</strong><span>{dateLabel(item.created_at, true)}{item.disposition ? ` · ${item.disposition}` : ''}{item.activity_type === 'appointment' ? item.scheduled_for ? ` · Scheduled ${dateLabel(item.scheduled_for, true)}` : ' · Calendly confirmed' : ''}{item.actor_email ? ` · Booked by ${item.actor_email}` : ''}</span>{item.note && <p>{item.note}</p>}</article>) : <p>{detailError || (detail ? 'No shared activity yet.' : 'Loading lead history…')}</p>}</section>
      </aside>
    )}
    {calendarOpen && <div className="calendar-modal" role="dialog" aria-modal="true" aria-labelledby="calendar-modal-title" onMouseDown={(event) => { if (event.target === event.currentTarget) setCalendarOpen(false); }}><section className="calendar-modal-card"><header><div><h2 id="calendar-modal-title">Book an appointment</h2><p>{currentLead?.name || selectedLead?.name || 'Lead'} · Calendly</p></div><button type="button" aria-label="Close calendar" onClick={() => setCalendarOpen(false)}>×</button></header><div className="calendly-embed" ref={calendarEmbedRef} /></section></div>}
    <style jsx>{`
      .bdr-workspace{--ink:#171717;--muted:#737373;--line:#ddd;--soft:#f6f6f6;--green:#1b7348;color:var(--ink);background:#fff;font:16px/1.4 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;min-height:100vh}.workspace-header{height:60px;padding:0 24px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between}.header-left{display:flex;align-items:center;gap:28px}.logo{width:150px;height:36px;object-fit:contain;display:block}nav{display:flex;align-self:stretch;gap:20px}nav button{border:0;border-bottom:2px solid transparent;background:#fff;color:var(--muted);padding:0 2px;font-size:13px;cursor:pointer}nav button.active{color:var(--ink);border-bottom-color:var(--ink);font-weight:700}.rep{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:13px}.rep button{border:0;background:transparent;color:var(--ink);font:inherit;font-weight:700;cursor:pointer}.dot{width:8px;height:8px;border-radius:50%;background:#2b9a61}main{padding:28px 24px 48px}.page-head{display:flex;justify-content:space-between;align-items:end;margin-bottom:18px}.page-head h1{margin:0;font-size:23px;letter-spacing:-.03em}.page-head p{margin:5px 0 0;color:var(--muted);font-size:13px;max-width:680px}.page-head>span,.page-head div>span{color:var(--muted);font-size:14px}.error{margin:0 24px;padding:10px 12px;background:#fff0ee;border:1px solid #f0b7ad;color:#9f2e1d;font-size:13px}.home-controls{display:grid;grid-template-columns:minmax(240px,360px) minmax(360px,1fr);gap:12px;margin-bottom:18px}.control-box{border:1px solid var(--line);padding:14px}.campaign-picker{display:block;color:var(--muted);font-size:11px;margin-bottom:8px}.campaign-picker select,select,input,textarea{width:100%;height:38px;border:1px solid var(--line);border-radius:6px;padding:0 9px;color:var(--ink);background:#fff;font:inherit;margin-top:4px}textarea{height:auto;min-height:94px;padding:9px;resize:vertical}.control-box .primary{width:100%;margin-top:8px}.primary,.secondary{min-height:38px;border-radius:6px;padding:0 12px;font-size:13px;font-weight:700;cursor:pointer}.primary{border:1px solid var(--ink);background:var(--ink);color:#fff}.primary:disabled{opacity:.5;cursor:not-allowed}.secondary{border:1px solid var(--line);background:#fff;color:var(--ink)}.timezone-map{position:relative;overflow:hidden;min-height:120px;padding:13px 16px;border:1px solid #171717;border-radius:7px;color:#fff;background:#171717}.timezone-map:before{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 0 38%,rgba(255,255,255,.075) 49%,transparent 62%);animation:sweep 8s ease-in-out infinite;pointer-events:none}.timezone-head{position:relative;z-index:1;display:flex;justify-content:space-between;align-items:baseline;margin-bottom:7px}.timezone-head strong{font-size:12px;letter-spacing:.02em;text-transform:uppercase}.timezone-head span{padding:3px 7px;border:1px solid rgba(255,255,255,.23);border-radius:999px;color:#fff;font-size:10px}.timezone-content{position:relative;z-index:1;display:grid;grid-template-columns:1.08fr 1fr;align-items:center;gap:20px}.us-map{width:100%;max-width:330px;height:67px;display:block}.zone-shape{stroke:rgba(255,255,255,.25);stroke-width:1.2}.zone-shape.active{fill:#fff;filter:drop-shadow(0 0 7px rgba(255,255,255,.45))}.zone-pt{fill:#343434}.zone-mt{fill:#4c4c4c}.zone-ct{fill:#666}.zone-et{fill:#858585}.map-label{fill:#fff;font:700 7px Inter,ui-sans-serif,system-ui,sans-serif;text-anchor:middle}.zone-times{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px 12px}.zone-time{padding:5px 8px;border:1px solid rgba(255,255,255,.14);border-radius:4px;color:#bdbdbd;font-size:10px;line-height:1.2}.zone-time strong{display:block;color:#fff;font-size:11px}.zone-time.active{border-color:#fff;background:#fff;color:#555}.zone-time.active strong{color:#171717}@keyframes sweep{0%,100%{transform:translateX(-55%);opacity:.2}50%{transform:translateX(55%);opacity:.85}}.stats-heading{display:flex;justify-content:space-between;align-items:center;margin:18px 0 8px;font-size:13px}.stats-controls{display:flex;align-items:center;gap:8px}.stats-controls span{border:1px solid var(--ink);background:var(--ink);color:white;border-radius:6px;padding:6px 12px;font-size:12px}.stats-controls button{border:1px solid var(--line);background:#fff;border-radius:6px;padding:6px 12px;font:inherit;font-size:12px;cursor:pointer}.metrics{display:grid;grid-template-columns:repeat(6,1fr);border-top:1px solid var(--line);border-left:1px solid var(--line);margin-bottom:20px}.metric{padding:14px;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}.metric span{display:block;color:var(--muted);font-size:11px;margin-bottom:6px}.metric strong{font-size:22px;letter-spacing:-.03em}.metric-action{cursor:pointer}.metric-action:hover{background:var(--soft)}.metric-action span:after{content:"View";float:right;color:var(--ink);font-weight:700;opacity:.65}.panel,.lead-table,.settings{border:1px solid var(--line)}.panel-head{min-height:44px;padding:0 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);font-size:13px;font-weight:700}.bdr-goals{margin-bottom:12px}.goals-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.goal-card{padding:14px;border-right:1px solid var(--line)}.goal-card:last-child{border-right:0}.goal-card span{display:block;color:var(--muted);font-size:11px}.goal-card strong{display:block;margin:4px 0 9px;font-size:19px;letter-spacing:-.025em}.goal-track{height:5px;overflow:hidden;border-radius:999px;background:#e7e7e7}.goal-track i{display:block;height:100%;border-radius:inherit;background:var(--ink);transition:width .25s ease}.campaign-row{display:grid;grid-template-columns:1.3fr .6fr .65fr .65fr .6fr auto;align-items:center;min-height:49px;border-bottom:1px solid var(--line);font-size:12px}.campaign-row:last-child{border-bottom:0}.campaign-row>span{padding:0 10px}.campaign-row strong{display:block;font-size:13px}.campaign-row small{color:var(--muted)}.campaign-row button{margin-right:8px;height:30px;border:1px solid var(--line);border-radius:5px;background:white;font-size:11px;font-weight:700;cursor:pointer}.operations-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}.history-row{width:100%;border:0;border-bottom:1px solid var(--line);background:#fff;display:grid;grid-template-columns:1.4fr .6fr .9fr;min-height:52px;align-items:center;text-align:left;font:inherit;font-size:12px;cursor:pointer}.history-row:hover{background:#fafafa}.history-row span{padding:0 12px}.history-row strong,.history-row small{display:block}.history-row small{color:var(--muted);font-size:11px}.empty{padding:18px 12px;color:var(--muted);font-size:13px}.pipeline-board{display:grid;grid-template-columns:repeat(5,minmax(190px,1fr));gap:10px;overflow-x:auto}.pipeline-lane{background:var(--soft);border:1px solid var(--line);min-height:270px;padding:9px}.pipeline-lane header{display:flex;justify-content:space-between;padding:4px 4px 10px;font-size:12px}.pipeline-lane header span{color:var(--muted)}.pipeline-card{display:grid;gap:4px;width:100%;padding:10px;margin:0 0 8px;border:1px solid var(--line);border-radius:5px;background:#fff;text-align:left;cursor:pointer}.pipeline-card strong{font-size:13px}.pipeline-card span,.pipeline-card small{font-size:11px;color:var(--muted)}.pipeline-card em{font-style:normal;color:var(--green);font-size:10px;font-weight:700}.lane-empty{color:var(--muted);font-size:12px;padding:12px 4px}.lead-head,.lead-row{display:grid;grid-template-columns:1.25fr 1.05fr 1fr .62fr .9fr .78fr}.lead-head{background:var(--soft);color:var(--muted);font-size:12px;font-weight:650;border-bottom:1px solid var(--line)}.lead-head span{padding:10px;border-right:1px solid var(--line)}.lead-row{width:100%;border:0;border-bottom:1px solid var(--line);background:#fff;color:var(--ink);text-align:left;padding:0;cursor:pointer}.lead-row:hover{background:#fafafa}.lead-row span{min-width:0;height:48px;padding:0 10px;display:flex;align-items:center;border-right:1px solid var(--line);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.settings{max-width:700px;padding:22px}.settings h1{margin:0 0 8px;font-size:23px}.settings p{color:var(--muted);line-height:1.5}.settings li{margin:8px 0}.detail{position:fixed;z-index:20;top:0;right:0;bottom:0;width:min(480px,100%);padding:22px;overflow:auto;background:#fff;border-left:1px solid var(--line);box-shadow:-12px 0 30px rgba(0,0,0,.08)}.detail>header{display:flex;justify-content:space-between;gap:14px;padding-bottom:20px;border-bottom:1px solid var(--line)}.detail>header p{margin:0 0 4px;color:var(--muted);font-size:12px}.detail h2{margin:0;font-size:23px;letter-spacing:-.025em}.detail header span{color:var(--muted);font-size:13px}.detail>header button{width:30px;height:30px;border:1px solid var(--line);border-radius:6px;background:#fff;font-size:18px;cursor:pointer}.detail-grid{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line);border-left:1px solid var(--line);margin-top:20px}.detail-grid div{min-width:0;padding:10px;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}.detail-grid small{display:block;color:var(--muted);font-size:10px;margin-bottom:3px}.detail-grid strong{display:block;font-size:12px;overflow-wrap:anywhere}.linkedin{display:inline-block;margin-top:16px;color:var(--ink);font-size:13px;font-weight:700}.notes,.call-control,.activity-form,.activity-history{padding:20px 0;border-bottom:1px solid var(--line)}.notes h3,.activity-form h3,.activity-history h3{margin:0 0 8px;font-size:14px}.notes p{margin:0;color:var(--muted);font-size:13px;white-space:pre-wrap}.call-control{display:flex;justify-content:space-between;align-items:center}.call-control small{display:block;color:var(--muted);font-size:10px}.call-control strong{font-size:13px}.activity-form{display:grid;gap:11px}.activity-form label{display:grid;gap:4px;color:var(--muted);font-size:11px}.activity-form .primary{height:40px}.activity-history article{padding:10px 0;border-top:1px solid var(--line)}.activity-history article strong,.activity-history article span,.activity-history article small{display:block}.activity-history article strong{font-size:12px;text-transform:capitalize}.activity-history article span,.activity-history article small{color:var(--muted);font-size:11px}.activity-history article p{margin:5px 0 0;font-size:12px;line-height:1.45}@media(max-width:1000px){.metrics{grid-template-columns:repeat(3,1fr)}.operations-grid{grid-template-columns:1fr}.pipeline-board{grid-template-columns:repeat(5,220px)}}@media(max-width:700px){.workspace-header{padding:0 14px;height:auto;min-height:60px;align-items:flex-start;padding-top:12px}.header-left{display:block}.logo{margin-bottom:8px}nav{gap:12px;height:34px}.rep{padding-top:8px}.home-controls{grid-template-columns:1fr}.timezone-content{grid-template-columns:1fr}.us-map{max-width:none}.zone-times{grid-template-columns:repeat(4,minmax(0,1fr))}.goals-grid{grid-template-columns:1fr}.goal-card{border-right:0;border-bottom:1px solid var(--line)}.goal-card:last-child{border-bottom:0}.lead-table{overflow-x:auto}.lead-head,.lead-row{min-width:780px}.campaign-row{grid-template-columns:1fr auto;padding:8px}.campaign-row>span:not(:first-child){display:none}}@media(max-width:520px){main{padding:20px 14px}.metrics{grid-template-columns:repeat(2,1fr)}.timezone-content{gap:6px}.zone-times{grid-template-columns:repeat(2,minmax(0,1fr))}.page-head{align-items:flex-start;gap:12px;flex-direction:column}.stats-heading{align-items:flex-start;gap:8px;flex-direction:column}.detail{padding:18px}.detail-grid{grid-template-columns:1fr}}
    `}</style>
    <style jsx global>{`
      .bdr-workspace .campaign-control{display:flex;flex-direction:column;justify-content:center;min-height:120px;background:linear-gradient(135deg,#fff 0%,#f8f8f8 100%)}
      .bdr-workspace .campaign-empty{display:grid;align-content:center;min-height:90px}
      .bdr-workspace .campaign-empty-label{color:var(--muted);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
      .bdr-workspace .campaign-empty strong{margin-top:6px;font-size:16px;letter-spacing:-.02em}
      .bdr-workspace .campaign-empty p{max-width:260px;margin:5px 0 0;color:var(--muted);font-size:12px;line-height:1.45}
      .bdr-workspace .campaign-control .campaign-picker{margin-bottom:0}
      .bdr-workspace .campaign-control .primary{margin-top:8px}
      .bdr-workspace .campaign-control .primary span{margin-left:7px;font-size:15px}
      .bdr-workspace .queue-page-head{align-items:end}
      .bdr-workspace .campaign-row .campaign-open{display:inline-flex;align-items:center;gap:7px;height:34px;margin-right:12px;padding:0 11px;border-color:#cfcfcf;border-radius:7px;color:var(--ink);font-weight:700}.bdr-workspace .campaign-row .campaign-open:hover{border-color:var(--ink);background:var(--soft)}.bdr-workspace .campaign-row .campaign-open span{padding:0;font-size:15px;line-height:1}
      .bdr-workspace .queue-workspace{border:1px solid var(--line);min-height:680px;background:#fff}
      .bdr-workspace .queue-title{height:49px;display:flex;align-items:center;padding:0 14px;border-bottom:1px solid var(--line);font-size:14px;font-weight:700}
      .bdr-workspace .queue-search{padding:10px 14px;border-bottom:1px solid var(--line);background:var(--soft)}
      .bdr-workspace .queue-search label{display:block;margin-bottom:4px;color:var(--muted);font-size:11px}
      .bdr-workspace .queue-search input{margin:0}
      .bdr-workspace .queue-filters{display:grid;grid-template-columns:repeat(4,minmax(120px,1fr)) auto;gap:8px;padding:10px;border-bottom:1px solid var(--line);background:var(--soft)}
      .bdr-workspace .queue-filters select,.bdr-workspace .queue-filters input{margin:0}
      .bdr-workspace .queue-filters button,.bdr-workspace .queue-footer button{height:38px;border:1px solid var(--line);border-radius:6px;background:#fff;color:var(--ink);font:inherit;font-size:12px;cursor:pointer}
      .bdr-workspace .queue-filters button{padding:0 12px;white-space:nowrap}
      .bdr-workspace .queue-scroll{overflow-x:auto}
      .bdr-workspace .queue-sheet{min-width:860px}
      .bdr-workspace .queue-grid{display:grid;grid-template-columns:46px 1.25fr 1.05fr 1fr .62fr .9fr .78fr}
      .bdr-workspace .queue-grid-head{border-bottom:1px solid var(--line);background:var(--soft);color:var(--muted);font-size:12px;font-weight:650}
      .bdr-workspace .queue-grid-head span{height:38px;display:flex;align-items:center;padding:0 10px;border-right:1px solid var(--line)}
      .bdr-workspace .queue-row{width:100%;padding:0;border:0;border-bottom:1px solid var(--line);background:#fff;color:var(--ink);text-align:left;cursor:pointer}
      .bdr-workspace .queue-row:hover{background:#fafafa}.bdr-workspace .queue-row.is-selected{background:#f0f0f0}.bdr-workspace .queue-row.is-next{background:#dff4e7}.bdr-workspace .queue-row.is-next:hover{background:#d5eedf}
      .bdr-workspace .queue-row span{min-width:0;height:48px;display:flex;align-items:center;padding:0 10px;border-right:1px solid var(--line);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .bdr-workspace .queue-row .queue-number{justify-content:center;padding:0;color:#9a9a9a;font-size:12px}.bdr-workspace .queue-row .queue-name{font-weight:650}.bdr-workspace .queue-due{color:#a23a3a;font-weight:700}
      .bdr-workspace .queue-status{display:inline-flex;align-items:center;align-self:center;height:23px;width:max-content;margin-left:9px;padding:0 8px;border-radius:999px;background:#eef6f1;color:var(--green);font-size:11px;font-style:normal}
      .bdr-workspace .queue-empty{min-height:120px;display:grid;place-items:center;padding:24px;color:var(--muted);font-size:14px}
      .bdr-workspace .queue-footer{height:48px;display:flex;align-items:center;justify-content:space-between;padding:0 13px;border-top:1px solid var(--line);color:var(--muted);font-size:12px}.bdr-workspace .queue-footer div{display:flex;gap:6px}.bdr-workspace .queue-footer button{min-width:68px;height:30px}.bdr-workspace .queue-footer button:disabled{cursor:default;background:var(--soft);color:#aaa}
      .bdr-workspace .queue-detail{position:fixed;z-index:20;top:60px;right:0;bottom:0;width:min(420px,100%);padding:22px;overflow:auto;background:#fff;border-left:1px solid var(--line);box-shadow:-12px 0 30px rgba(0,0,0,.08)}
      .bdr-workspace .queue-detail-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding-bottom:20px;border-bottom:1px solid var(--line)}.bdr-workspace .queue-detail-head h2{margin:0;font-size:21px;letter-spacing:-.025em}.bdr-workspace .queue-detail-head p{margin:4px 0 0;color:var(--muted);font-size:14px}.bdr-workspace .queue-detail-head button{width:30px;height:30px;flex:0 0 auto;border:1px solid var(--line);border-radius:6px;background:#fff;color:var(--ink);font-size:18px;line-height:1;cursor:pointer}
      .bdr-workspace .queue-detail-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:17px}.bdr-workspace .queue-detail-actions button{height:50px}.bdr-workspace .queue-call-state{display:flex;justify-content:center;margin-top:12px;padding:9px 11px;background:#edf8f2;color:var(--green);font-size:13px;font-weight:700}
      .bdr-workspace .queue-wrap-up,.bdr-workspace .queue-read-only{margin-top:20px;padding-top:20px;border-top:1px solid var(--line)}.bdr-workspace .queue-wrap-up h3,.bdr-workspace .queue-read-only h3,.bdr-workspace .queue-notes h3,.bdr-workspace .queue-history h3{margin:0;font-size:13px}.bdr-workspace .queue-read-only p{margin:8px 0 0;color:var(--muted);font-size:12px;line-height:1.5}.bdr-workspace .queue-form-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.bdr-workspace .queue-wrap-up label{display:grid;gap:3px;color:var(--muted);font-size:11px}.bdr-workspace .queue-wrap-up select,.bdr-workspace .queue-wrap-up input{margin:0}.bdr-workspace .calendar-helper{margin:10px 0 8px;color:var(--muted);font-size:12px}.bdr-workspace .calendar-reopen{width:100%;margin:0 0 10px}.bdr-workspace .queue-save-row{display:flex;justify-content:flex-end;margin-top:10px}
      .bdr-workspace .queue-detail-grid{display:grid;grid-template-columns:1fr 1fr;margin-top:24px;border-top:1px solid var(--line);border-left:1px solid var(--line)}.bdr-workspace .queue-detail-grid>div,.bdr-workspace .queue-detail-grid>label{min-width:0;margin:0;padding:10px;border-right:1px solid var(--line);border-bottom:1px solid var(--line)}.bdr-workspace .queue-detail-grid .wide{grid-column:1/-1}.bdr-workspace .queue-detail-grid small{display:block;margin-bottom:3px;color:var(--muted);font-size:11px}.bdr-workspace .queue-detail-grid strong,.bdr-workspace .queue-detail-grid a{display:block;color:var(--ink);font-size:13px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.bdr-workspace .queue-detail-grid input,.bdr-workspace .queue-detail-grid select{margin:0}.bdr-workspace .queue-detail-grid label{color:var(--muted);font-size:11px}
      .bdr-workspace .queue-notes,.bdr-workspace .queue-history{margin-top:20px;padding-top:20px;border-top:1px solid var(--line)}.bdr-workspace .queue-notes>div{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px}.bdr-workspace .queue-notes span{color:var(--muted);font-size:11px}.bdr-workspace .queue-notes textarea{width:100%;margin:0}.bdr-workspace .queue-history article{padding:10px 0;border-top:1px solid var(--line)}.bdr-workspace .queue-history article:first-of-type{margin-top:9px}.bdr-workspace .queue-history article strong,.bdr-workspace .queue-history article span{display:block;font-size:12px}.bdr-workspace .queue-history article span,.bdr-workspace .queue-history p{color:var(--muted);font-size:11px}.bdr-workspace .queue-history article p{margin:5px 0 0;font-size:12px;line-height:1.45}
      .bdr-workspace .calendar-modal{position:fixed;z-index:50;inset:0;display:grid;place-items:center;padding:20px;background:rgba(23,23,23,.32)}.bdr-workspace .calendar-modal-card{width:min(980px,100%);height:min(760px,calc(100vh - 40px));overflow:hidden;border:1px solid var(--line);border-radius:10px;background:#fff;box-shadow:0 20px 60px rgba(0,0,0,.2)}.bdr-workspace .calendar-modal-card header{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:15px 18px;border-bottom:1px solid var(--line)}.bdr-workspace .calendar-modal-card h2{margin:0;font-size:17px;letter-spacing:-.02em}.bdr-workspace .calendar-modal-card p{margin:3px 0 0;color:var(--muted);font-size:12px}.bdr-workspace .calendar-modal-card header button{width:30px;height:30px;flex:0 0 auto;border:1px solid var(--line);border-radius:6px;background:#fff;color:var(--ink);font-size:18px;line-height:1;cursor:pointer}.bdr-workspace .calendly-embed{height:calc(100% - 62px)}.bdr-workspace .calendly-embed iframe{display:block;width:100%;height:100%;border:0}
      @media(max-width:700px){.bdr-workspace .queue-workspace{border-left:0;border-right:0}.bdr-workspace .queue-filters{grid-template-columns:1fr}.bdr-workspace .queue-detail{top:0;padding:20px 14px}.bdr-workspace .queue-detail-actions,.bdr-workspace .queue-form-row{grid-template-columns:1fr}}
    `}</style>
  </div>;
}
