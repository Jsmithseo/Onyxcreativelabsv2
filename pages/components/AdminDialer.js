import { useEffect, useMemo, useState } from 'react';
import {
  readDialerWorkspace,
  subscribeToDialerWorkspace,
  writeDialerWorkspace,
} from '../../lib/dialerWorkspace';

const stages = [
  'New',
  'Contacted',
  'Qualified',
  'Appointment Set',
  'Won',
  'Lost',
  'Do Not Call',
];

const dispositions = [
  'Connected — qualified',
  'Connected — follow up',
  'Left voicemail',
  'No answer',
  'Not interested',
];

function firstName(email) {
  const raw = String(email || '').split('@')[0];
  return raw
    ? raw
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : 'Admin';
}

function stageClass(stage) {
  return String(stage || 'New')
    .toLowerCase()
    .replace(/\s+/g, '-');
}

export default function AdminDialer({
  signedInEmail,
  onSignOut,
  role = 'admin',
}) {
  const [activeView, setActiveView] = useState('leads');
  const [leads, setLeads] = useState(() => readDialerWorkspace().leads);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [query, setQuery] = useState('');
  const [zone, setZone] = useState('');
  const [stage, setStage] = useState('');
  const [callStatus, setCallStatus] = useState('');
  const [goalCalls, setGoalCalls] = useState(120);
  const [goalAppointments, setGoalAppointments] = useState(3);
  const [voipProvider, setVoipProvider] = useState('');
  const isAdmin = role === 'admin';

  useEffect(
    () =>
      subscribeToDialerWorkspace((workspace) => {
        setLeads(workspace.leads);
      }),
    []
  );

  const workspaceLeads = useMemo(
    () =>
      isAdmin
        ? leads
        : leads.filter(
            (lead) =>
              lead.assignedTo === signedInEmail && lead.campaignId === 'reviews'
          ),
    [isAdmin, leads, signedInEmail]
  );
  const selectedLead =
    workspaceLeads.find((lead) => lead.id === selectedLeadId) || null;
  const filteredLeads = useMemo(() => {
    const search = query.trim().toLowerCase();
    return workspaceLeads.filter((lead) => {
      const searchable = [lead.name, lead.company, lead.phone, lead.email]
        .join(' ')
        .toLowerCase();
      return (
        (!search || searchable.includes(search)) &&
        (!zone || lead.zone === zone) &&
        (!stage || lead.stage === stage)
      );
    });
  }, [query, stage, workspaceLeads, zone]);

  const metrics = useMemo(
    () => ({
      calls: workspaceLeads.filter((lead) => lead.disposition).length,
      appointments: workspaceLeads.filter(
        (lead) => lead.stage === 'Appointment Set'
      ).length,
      deals: workspaceLeads.filter((lead) => lead.stage === 'Won').length,
      followups: workspaceLeads.filter(
        (lead) => lead.disposition === 'Connected — follow up'
      ).length,
    }),
    [workspaceLeads]
  );

  function updateLead(id, updates) {
    const workspace = readDialerWorkspace();
    const nextLeads = workspace.leads.map((lead) =>
      lead.id === id ? { ...lead, ...updates } : lead
    );
    setLeads(nextLeads);
    writeDialerWorkspace({ ...workspace, leads: nextLeads });
  }

  function openLead(id) {
    setSelectedLeadId(id);
    setCallStatus('');
  }

  function setView(view) {
    setActiveView(view);
    if (view !== 'leads') setSelectedLeadId(null);
  }

  return (
    <div className="onyx-admin-dialer">
      <header className="dialer-header">
        <div className="dialer-header-left">
          <a
            className="dialer-brand"
            href="/"
            aria-label="Onyx Creative Labs home"
          >
            <img
              src="/onyx-creative-labs-logo.webp"
              alt="Onyx Creative Labs"
              width="150"
              height="36"
            />
          </a>
          <nav className="dialer-nav" aria-label="Dialer workspace navigation">
            {isAdmin ? (
              <>
                <button
                  className={activeView === 'home' ? 'is-active' : ''}
                  type="button"
                  onClick={() => setView('home')}
                >
                  Home
                </button>
                <button
                  className={activeView === 'board' ? 'is-active' : ''}
                  type="button"
                  onClick={() => setView('board')}
                >
                  Prospecting board
                </button>
                <button
                  className={activeView === 'leads' ? 'is-active' : ''}
                  type="button"
                  onClick={() => setView('leads')}
                >
                  Leads
                </button>
                <button
                  className={activeView === 'settings' ? 'is-active' : ''}
                  type="button"
                  onClick={() => setView('settings')}
                >
                  Settings
                </button>
              </>
            ) : (
              <span className="dialer-contractor-label">My assigned leads</span>
            )}
          </nav>
        </div>
        <div className="dialer-rep">
          <span className="dialer-dot" aria-hidden="true" />
          <span>{signedInEmail}</span>
          <button type="button" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </header>

      <main className="dialer-main">
        {isAdmin && activeView === 'home' && (
          <section className="dialer-view">
            <div className="dialer-page-head">
              <div>
                <h1>Welcome, {firstName(signedInEmail)}</h1>
                <span>Onyx Reviews campaign</span>
              </div>
              <button
                className="dialer-primary"
                type="button"
                onClick={() => setView('leads')}
              >
                Open call queue
              </button>
            </div>
            <section className="dialer-panel contractor-panel">
              <div className="dialer-panel-head">
                <strong>Contractors</strong>
                <button type="button">Invite contractor</button>
              </div>
              <div className="contractor-copy">
                <div>
                  <strong>Manage BDR access</strong>
                  <p>
                    Add callers, assign campaigns, and review the work queue
                    from one place.
                  </p>
                </div>
                <span>0 active contractors</span>
              </div>
            </section>
            <div className="dashboard-controls">
              <label>
                Campaign
                <select defaultValue="reviews">
                  <option value="reviews">Onyx Reviews</option>
                </select>
              </label>
              <section className="calling-windows">
                <div>
                  <strong>U.S. calling windows</strong>
                  <span>Live priority</span>
                </div>
                <p>Pacific · 9:00 AM — 5:00 PM</p>
              </section>
            </div>
            <div className="dialer-metrics">
              <Metric label="Calls today" value={metrics.calls} />
              <Metric
                label="Talk time"
                value={metrics.calls ? `${metrics.calls * 3}m` : '0m'}
              />
              <Metric label="Appointments" value={metrics.appointments} />
              <Metric label="Deals closed" value={metrics.deals} />
              <Metric
                label="Connect rate"
                value={metrics.calls ? '67%' : '0%'}
              />
              <Metric label="Follow-ups due" value={metrics.followups} />
            </div>
            <section className="dialer-panel">
              <div className="dialer-panel-head">
                <strong>Campaigns</strong>
                <span>1 active</span>
              </div>
              <button
                className="campaign-row"
                type="button"
                onClick={() => setView('leads')}
              >
                <span>
                  <strong>Onyx Reviews</strong>
                  <small>Client review outreach</small>
                </span>
                <span>{workspaceLeads.length} leads</span>
                <span>{metrics.calls} calls</span>
                <span>{metrics.appointments} appointments</span>
                <span className="campaign-status">Active</span>
              </button>
            </section>
          </section>
        )}

        {activeView === 'leads' && (
          <section className="dialer-view">
            <div className="dialer-page-head">
              <div>
                <h1>Call queue</h1>
                <span>
                  {filteredLeads.length}{' '}
                  {isAdmin ? 'Onyx Reviews leads' : 'assigned leads'}
                </span>
              </div>
            </div>
            <section
              className="lead-workspace"
              aria-label="Onyx Reviews call queue"
            >
              <div className="lead-table-pane">
                <div className="lead-table-title">
                  {isAdmin
                    ? 'Onyx Reviews · prioritized leads'
                    : 'Onyx Reviews · your assigned leads'}
                </div>
                <div className="lead-search">
                  <label htmlFor="admin-lead-search">Search leads</label>
                  <input
                    id="admin-lead-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search name, company, phone, or email"
                  />
                </div>
                <div className="lead-filters">
                  <select
                    value={zone}
                    onChange={(event) => setZone(event.target.value)}
                    aria-label="Filter by time zone"
                  >
                    <option value="">All time zones</option>
                    <option value="ET">ET</option>
                    <option value="CT">CT</option>
                    <option value="MT">MT</option>
                    <option value="PT">PT</option>
                  </select>
                  <select
                    value={stage}
                    onChange={(event) => setStage(event.target.value)}
                    aria-label="Filter by stage"
                  >
                    <option value="">All stages</option>
                    {stages.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setZone('');
                      setStage('');
                    }}
                  >
                    Clear filters
                  </button>
                </div>
                <div className="lead-sheet-scroll">
                  <div className="lead-sheet">
                    <div className="lead-grid lead-grid-head">
                      <span>#</span>
                      <span>Name</span>
                      <span>Company</span>
                      <span>Phone</span>
                      <span>Time zone</span>
                      <span>Follow-up</span>
                      <span>Status</span>
                    </div>
                    {filteredLeads.map((lead, index) => (
                      <button
                        className={`lead-grid lead-grid-row ${
                          lead.id === selectedLeadId ? 'is-selected' : ''
                        }`}
                        key={lead.id}
                        type="button"
                        onClick={() => openLead(lead.id)}
                      >
                        <span className="row-number">{index + 1}</span>
                        <span className="lead-name">{lead.name}</span>
                        <span>{lead.company}</span>
                        <span>{lead.phone}</span>
                        <span>{lead.zone}</span>
                        <span>
                          {lead.disposition === 'Connected — follow up'
                            ? 'Due today'
                            : '—'}
                        </span>
                        <span>
                          <i
                            className={`lead-status ${stageClass(lead.stage)}`}
                          >
                            {lead.stage}
                          </i>
                        </span>
                      </button>
                    ))}
                    {!filteredLeads.length && (
                      <div className="dialer-empty">
                        No leads match those filters.
                      </div>
                    )}
                  </div>
                </div>
                <div className="lead-table-footer">
                  <span>
                    Showing {filteredLeads.length} of {workspaceLeads.length}{' '}
                    leads
                  </span>
                  <span>Onyx Reviews</span>
                </div>
              </div>
              <LeadDrawer
                lead={selectedLead}
                callStatus={callStatus}
                onClose={() => setSelectedLeadId(null)}
                onCall={() => setCallStatus('Calling in test mode')}
                onUpdate={updateLead}
              />
            </section>
          </section>
        )}

        {isAdmin && activeView === 'board' && (
          <section className="dialer-view">
            <div className="dialer-page-head">
              <div>
                <h1>Prospecting board</h1>
                <span>Onyx Reviews pipeline</span>
              </div>
              <button className="dialer-primary" type="button">
                Add prospect
              </button>
            </div>
            <section className="dialer-panel">
              <div className="dialer-panel-head">
                <strong>Sales pipeline</strong>
                <span>Drag-and-drop workflow connects next</span>
              </div>
              <div className="sales-board">
                {['Appointment Set', 'Qualified', 'Contacted', 'Won'].map(
                  (column) => (
                    <div className="sales-column" key={column}>
                      <div>
                        <strong>{column}</strong>
                        <span>
                          {
                            workspaceLeads.filter(
                              (lead) => lead.stage === column
                            ).length
                          }
                        </span>
                      </div>
                      {workspaceLeads
                        .filter((lead) => lead.stage === column)
                        .map((lead) => (
                          <button
                            type="button"
                            key={lead.id}
                            onClick={() => {
                              setActiveView('leads');
                              openLead(lead.id);
                            }}
                          >
                            <strong>{lead.name}</strong>
                            <span>{lead.company}</span>
                          </button>
                        ))}
                      {!workspaceLeads.some(
                        (lead) => lead.stage === column
                      ) && <p>No prospects</p>}
                    </div>
                  )
                )}
              </div>
            </section>
          </section>
        )}

        {isAdmin && activeView === 'settings' && (
          <section className="dialer-view">
            <div className="dialer-page-head">
              <div>
                <h1>Settings</h1>
                <span>Dialer configuration</span>
              </div>
            </div>
            <div className="settings-stack">
              <section className="dialer-panel">
                <div className="dialer-panel-head">
                  <strong>Campaign goals</strong>
                  <span>Daily targets</span>
                </div>
                <div className="settings-grid">
                  <label>
                    Daily calls
                    <input
                      type="number"
                      min="0"
                      value={goalCalls}
                      onChange={(event) => setGoalCalls(event.target.value)}
                    />
                  </label>
                  <label>
                    Daily appointments
                    <input
                      type="number"
                      min="0"
                      value={goalAppointments}
                      onChange={(event) =>
                        setGoalAppointments(event.target.value)
                      }
                    />
                  </label>
                  <label>
                    Admin close ratio %
                    <input type="number" min="0" max="99" defaultValue="0" />
                  </label>
                  <button type="button">Save goals</button>
                </div>
              </section>
              <section className="dialer-panel">
                <div className="dialer-panel-head">
                  <strong>VOIP provider</strong>
                  <span>{voipProvider || 'Not connected'}</span>
                </div>
                <div className="settings-grid single">
                  <label>
                    Calling provider
                    <select
                      value={voipProvider}
                      onChange={(event) => setVoipProvider(event.target.value)}
                    >
                      <option value="">Choose provider</option>
                      <option>Twilio</option>
                      <option>Telnyx</option>
                      <option>RingCentral</option>
                    </select>
                  </label>
                  <button type="button">Save provider</button>
                </div>
              </section>
            </div>
          </section>
        )}
      </main>

      <style jsx>{`
        .onyx-admin-dialer {
          --ink: #171717;
          --muted: #737373;
          --line: #ddd;
          --soft: #f6f6f6;
          --green: #1b7348;
          background: #fff;
          color: var(--ink);
          font:
            16px/1.4 Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            sans-serif;
          min-height: 100vh;
        }
        * {
          box-sizing: border-box;
        }
        button,
        input,
        select,
        textarea {
          font: inherit;
        }
        button {
          cursor: pointer;
        }
        .dialer-header {
          align-items: center;
          border-bottom: 1px solid var(--line);
          display: flex;
          height: 60px;
          justify-content: space-between;
          padding: 0 24px;
        }
        .dialer-header-left,
        .dialer-nav,
        .dialer-rep {
          align-items: center;
          display: flex;
        }
        .dialer-header-left {
          gap: 28px;
          min-width: 0;
        }
        .dialer-brand {
          display: block;
          line-height: 0;
        }
        .dialer-brand img {
          display: block;
          height: 36px;
          object-fit: contain;
          width: 150px;
        }
        .dialer-nav {
          align-self: stretch;
          gap: 20px;
        }
        .dialer-nav button {
          background: #fff;
          border: 0;
          border-bottom: 2px solid transparent;
          color: var(--muted);
          font-size: 13px;
          padding: 0 2px;
        }
        .dialer-nav button.is-active {
          border-bottom-color: var(--ink);
          color: var(--ink);
          font-weight: 700;
        }
        .dialer-contractor-label {
          align-items: center;
          color: var(--ink);
          display: inline-flex;
          font-size: 13px;
          font-weight: 700;
        }
        .dialer-rep {
          color: var(--muted);
          font-size: 12px;
          gap: 8px;
        }
        .dialer-dot {
          background: #2b9a61;
          border-radius: 50%;
          height: 8px;
          width: 8px;
        }
        .dialer-rep button {
          background: transparent;
          border: 0;
          color: var(--ink);
          font-size: 12px;
          font-weight: 700;
          padding: 4px;
        }
        .dialer-main {
          margin: auto;
          max-width: 1500px;
          padding: 28px 24px 48px;
        }
        .dialer-page-head {
          align-items: end;
          display: flex;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .dialer-page-head h1 {
          font-size: 23px;
          letter-spacing: -0.03em;
          margin: 0;
        }
        .dialer-page-head span {
          color: var(--muted);
          font-size: 14px;
        }
        .dialer-primary,
        .settings-grid button {
          background: var(--ink);
          border: 1px solid var(--ink);
          border-radius: 7px;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          min-height: 38px;
          padding: 0 12px;
        }
        .dialer-panel {
          border: 1px solid var(--line);
        }
        .dialer-panel-head {
          align-items: center;
          border-bottom: 1px solid var(--line);
          display: flex;
          font-size: 13px;
          justify-content: space-between;
          min-height: 44px;
          padding: 0 12px;
        }
        .dialer-panel-head span {
          color: var(--muted);
          font-size: 12px;
        }
        .dialer-panel-head button {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 5px;
          font-size: 11px;
          font-weight: 700;
          height: 30px;
          padding: 0 10px;
        }
        .contractor-panel {
          margin-bottom: 18px;
        }
        .contractor-copy {
          align-items: center;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 14px;
        }
        .contractor-copy p {
          color: var(--muted);
          font-size: 12px;
          margin: 4px 0 0;
        }
        .contractor-copy > span {
          color: var(--muted);
          font-size: 12px;
        }
        .dashboard-controls {
          display: grid;
          gap: 12px;
          grid-template-columns: minmax(240px, 360px) minmax(360px, 1fr);
          margin-bottom: 18px;
        }
        .dashboard-controls > label {
          border: 1px solid var(--line);
          color: var(--muted);
          display: grid;
          font-size: 11px;
          gap: 6px;
          padding: 14px;
        }
        .dashboard-controls select {
          border: 1px solid var(--line);
          border-radius: 6px;
          height: 38px;
          padding: 0 9px;
        }
        .calling-windows {
          background: var(--ink);
          color: #fff;
          min-height: 102px;
          padding: 13px 16px;
        }
        .calling-windows > div {
          align-items: center;
          display: flex;
          font-size: 12px;
          justify-content: space-between;
          text-transform: uppercase;
        }
        .calling-windows span {
          border: 1px solid #666;
          border-radius: 999px;
          font-size: 10px;
          padding: 3px 7px;
        }
        .calling-windows p {
          color: #ddd;
          font-size: 12px;
          margin: 22px 0 0;
        }
        .dialer-metrics {
          border-left: 1px solid var(--line);
          border-top: 1px solid var(--line);
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          margin-bottom: 20px;
        }
        .metric {
          border-bottom: 1px solid var(--line);
          border-right: 1px solid var(--line);
          padding: 14px;
        }
        .metric span {
          color: var(--muted);
          display: block;
          font-size: 11px;
          margin-bottom: 6px;
        }
        .metric strong {
          font-size: 22px;
          letter-spacing: -0.03em;
        }
        .campaign-row {
          align-items: center;
          background: #fff;
          border: 0;
          display: grid;
          font-size: 12px;
          grid-template-columns: 1.3fr 0.7fr 0.6fr 0.75fr auto;
          min-height: 55px;
          text-align: left;
          width: 100%;
        }
        .campaign-row > span {
          padding: 0 12px;
        }
        .campaign-row strong,
        .campaign-row small {
          display: block;
        }
        .campaign-row strong {
          font-size: 13px;
        }
        .campaign-row small {
          color: var(--muted);
        }
        .campaign-status {
          color: var(--green);
          font-weight: 700;
        }
        .lead-workspace {
          border: 1px solid var(--line);
          min-height: 680px;
          position: relative;
        }
        .lead-table-title {
          align-items: center;
          border-bottom: 1px solid var(--line);
          display: flex;
          font-size: 14px;
          font-weight: 700;
          height: 49px;
          padding: 0 14px;
        }
        .lead-search {
          background: var(--soft);
          border-bottom: 1px solid var(--line);
          display: grid;
          gap: 4px;
          padding: 10px 14px;
        }
        .lead-search label,
        .settings-grid label {
          color: var(--muted);
          font-size: 11px;
        }
        .lead-search input,
        .lead-filters select,
        .settings-grid input,
        .settings-grid select {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 6px;
          color: var(--ink);
          height: 38px;
          padding: 0 9px;
        }
        .lead-filters {
          background: var(--soft);
          border-bottom: 1px solid var(--line);
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(2, minmax(120px, 1fr)) auto;
          padding: 10px;
        }
        .lead-filters button {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 6px;
          font-size: 12px;
        }
        .lead-sheet-scroll {
          overflow-x: auto;
        }
        .lead-sheet {
          min-width: 860px;
        }
        .lead-grid {
          display: grid;
          grid-template-columns: 38px 1.25fr 1.05fr 1fr 0.62fr 0.9fr 0.78fr;
        }
        .lead-grid-head {
          background: var(--soft);
          border-bottom: 1px solid var(--line);
          color: var(--muted);
          font-size: 12px;
          font-weight: 650;
        }
        .lead-grid-head span {
          align-items: center;
          border-right: 1px solid var(--line);
          display: flex;
          height: 38px;
          padding: 0 10px;
        }
        .lead-grid-row {
          background: #fff;
          border: 0;
          border-bottom: 1px solid var(--line);
          color: var(--ink);
          padding: 0;
          text-align: left;
          width: 100%;
        }
        .lead-grid-row:hover {
          background: #fafafa;
        }
        .lead-grid-row.is-selected {
          background: #f0f0f0;
        }
        .lead-grid-row span {
          align-items: center;
          border-right: 1px solid var(--line);
          display: flex;
          font-size: 13px;
          height: 48px;
          overflow: hidden;
          padding: 0 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .lead-grid-row .row-number {
          color: #9a9a9a;
          justify-content: center;
          padding: 0;
        }
        .lead-name {
          font-weight: 650;
        }
        .lead-status {
          align-self: center;
          background: #eef6f1;
          border-radius: 999px;
          color: var(--green);
          font-size: 11px;
          font-style: normal;
          height: 23px;
          margin-left: 9px;
          padding: 3px 8px;
          white-space: nowrap;
        }
        .lead-status.new {
          background: #f3f4f6;
          color: #52525b;
        }
        .lead-status.qualified,
        .lead-status.appointment-set,
        .lead-status.won {
          background: #eef6f1;
          color: var(--green);
        }
        .lead-status.lost,
        .lead-status.do-not-call {
          background: #fdf0f0;
          color: #b93b3b;
        }
        .dialer-empty {
          color: var(--muted);
          min-height: 120px;
          padding: 30px;
          text-align: center;
        }
        .lead-table-footer {
          align-items: center;
          border-top: 1px solid var(--line);
          color: var(--muted);
          display: flex;
          font-size: 12px;
          height: 48px;
          justify-content: space-between;
          padding: 0 13px;
        }
        .lead-drawer {
          background: #fff;
          border-left: 1px solid var(--line);
          bottom: 0;
          box-shadow: -12px 0 30px rgba(0, 0, 0, 0.08);
          overflow: auto;
          padding: 22px;
          position: absolute;
          right: 0;
          top: 0;
          width: min(420px, 100%);
          z-index: 5;
        }
        .drawer-top {
          align-items: flex-start;
          border-bottom: 1px solid var(--line);
          display: flex;
          gap: 14px;
          justify-content: space-between;
          padding-bottom: 20px;
        }
        .drawer-top h2 {
          font-size: 21px;
          letter-spacing: -0.025em;
          margin: 0;
        }
        .drawer-top p {
          color: var(--muted);
          font-size: 14px;
          margin: 4px 0 0;
        }
        .drawer-close {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 6px;
          font-size: 18px;
          height: 30px;
          width: 30px;
        }
        .drawer-actions {
          display: grid;
          gap: 8px;
          grid-template-columns: 1fr 1fr;
          margin-top: 17px;
        }
        .drawer-actions button,
        .drawer-save {
          border-radius: 7px;
          font-size: 13px;
          font-weight: 700;
          min-height: 40px;
          padding: 0 12px;
        }
        .drawer-actions button:first-child,
        .drawer-save {
          background: var(--ink);
          border: 1px solid var(--ink);
          color: #fff;
        }
        .drawer-actions button:last-child {
          background: #fff;
          border: 1px solid var(--line);
          color: var(--ink);
        }
        .call-state {
          background: #edf8f2;
          color: var(--green);
          font-size: 13px;
          margin-top: 12px;
          padding: 9px 11px;
        }
        .drawer-section {
          border-top: 1px solid var(--line);
          margin-top: 20px;
          padding-top: 20px;
        }
        .drawer-section h3 {
          font-size: 13px;
          margin: 0 0 9px;
        }
        .drawer-form {
          display: grid;
          gap: 8px;
          grid-template-columns: 1fr 1fr;
        }
        .drawer-form label {
          color: var(--muted);
          font-size: 11px;
        }
        .drawer-form select,
        .drawer-form input,
        .drawer-section textarea {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 6px;
          color: var(--ink);
          font-size: 13px;
          margin-top: 4px;
          min-height: 38px;
          padding: 0 9px;
          width: 100%;
        }
        .drawer-section textarea {
          min-height: 102px;
          padding: 10px;
          resize: vertical;
        }
        .drawer-save {
          float: right;
          margin-top: 10px;
        }
        .drawer-details {
          border-left: 1px solid var(--line);
          border-top: 1px solid var(--line);
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-top: 20px;
        }
        .drawer-detail {
          border-bottom: 1px solid var(--line);
          border-right: 1px solid var(--line);
          min-width: 0;
          padding: 10px;
        }
        .drawer-detail.wide {
          grid-column: 1 / -1;
        }
        .drawer-detail span {
          color: var(--muted);
          display: block;
          font-size: 11px;
          margin-bottom: 3px;
        }
        .drawer-detail strong {
          display: block;
          font-size: 13px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sales-board {
          background: var(--soft);
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, minmax(190px, 1fr));
          overflow-x: auto;
          padding: 10px;
        }
        .sales-column {
          background: #fff;
          border: 1px solid var(--line);
          min-height: 190px;
          padding: 8px;
        }
        .sales-column > div {
          align-items: center;
          border-bottom: 1px solid var(--line);
          display: flex;
          font-size: 12px;
          justify-content: space-between;
          margin: -8px -8px 8px;
          padding: 10px;
        }
        .sales-column > div span {
          color: var(--muted);
        }
        .sales-column button {
          background: #fff;
          border: 1px solid var(--line);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          display: block;
          margin-bottom: 7px;
          padding: 9px 10px;
          text-align: left;
          width: 100%;
        }
        .sales-column button strong,
        .sales-column button span {
          display: block;
        }
        .sales-column button strong {
          font-size: 12px;
        }
        .sales-column button span,
        .sales-column p {
          color: var(--muted);
          font-size: 11px;
        }
        .sales-column p {
          text-align: center;
        }
        .settings-stack {
          display: grid;
          gap: 16px;
          max-width: 700px;
        }
        .settings-grid {
          align-items: end;
          display: grid;
          gap: 8px;
          grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
          padding: 12px;
        }
        .settings-grid label {
          display: grid;
          gap: 4px;
        }
        .settings-grid.single {
          grid-template-columns: 1fr auto;
        }
        @media (max-width: 900px) {
          .dialer-metrics {
            grid-template-columns: repeat(3, 1fr);
          }
          .sales-board {
            grid-template-columns: repeat(4, 220px);
          }
        }
        @media (max-width: 700px) {
          .dialer-header {
            align-items: flex-start;
            height: auto;
            padding: 12px 14px;
          }
          .dialer-header-left {
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
          }
          .dialer-nav {
            gap: 12px;
          }
          .dialer-rep {
            align-self: center;
          }
          .dialer-rep span:not(.dialer-dot) {
            display: none;
          }
          .dialer-main {
            padding: 22px 14px 32px;
          }
          .dashboard-controls,
          .settings-grid,
          .settings-grid.single {
            grid-template-columns: 1fr;
          }
          .dialer-metrics {
            grid-template-columns: repeat(2, 1fr);
          }
          .campaign-row {
            grid-template-columns: 1fr auto;
            padding: 8px;
          }
          .campaign-row > span:not(:first-child):not(:last-child) {
            display: none;
          }
          .lead-workspace {
            border-left: 0;
            border-right: 0;
          }
          .lead-filters {
            grid-template-columns: 1fr;
          }
          .lead-drawer {
            bottom: 0;
            position: fixed;
            top: 0;
            z-index: 30;
          }
          .drawer-form {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LeadDrawer({ lead, callStatus, onClose, onCall, onUpdate }) {
  const [followUp, setFollowUp] = useState('');
  const [notes, setNotes] = useState('');

  if (!lead) return null;

  return (
    <aside className="lead-drawer" aria-label={`${lead.name} details`}>
      <div className="drawer-top">
        <div>
          <h2>{lead.name}</h2>
          <p>
            {lead.title} · {lead.company}
          </p>
        </div>
        <button
          className="drawer-close"
          type="button"
          onClick={onClose}
          aria-label="Close lead details"
        >
          ×
        </button>
      </div>
      <div className="drawer-actions">
        <button type="button" onClick={onCall}>
          Call lead
        </button>
        <button
          type="button"
          onClick={() => onUpdate(lead.id, { stage: 'Appointment Set' })}
        >
          Mark appointment set
        </button>
      </div>
      {callStatus && <div className="call-state">{callStatus}</div>}
      <section className="drawer-section">
        <h3>Wrap up</h3>
        <div className="drawer-form">
          <label>
            Disposition
            <select
              value={lead.disposition}
              onChange={(event) =>
                onUpdate(lead.id, { disposition: event.target.value })
              }
            >
              <option value="">Choose outcome</option>
              {dispositions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Follow-up
            <input
              type="date"
              value={followUp}
              onChange={(event) => setFollowUp(event.target.value)}
            />
          </label>
        </div>
        <button
          className="drawer-save"
          type="button"
          onClick={() =>
            onUpdate(lead.id, {
              stage:
                lead.disposition === 'Connected — qualified'
                  ? 'Qualified'
                  : lead.stage,
            })
          }
        >
          Save lead
        </button>
      </section>
      <div className="drawer-details">
        <Detail label="Company" value={lead.company} />
        <Detail label="Title" value={lead.title} />
        <Detail label="Phone" value={lead.phone} />
        <Detail label="Email" value={lead.email} />
        <Detail label="Time zone" value={lead.location} />
        <Detail label="Campaign" value="Onyx Reviews" />
        <Detail label="Stage" value={lead.stage} />
      </div>
      <section className="drawer-section">
        <h3>Notes</h3>
        <textarea
          value={notes || lead.notes}
          onChange={(event) => setNotes(event.target.value)}
          onBlur={() => onUpdate(lead.id, { notes: notes || lead.notes })}
          aria-label="Lead notes"
        />
      </section>
    </aside>
  );
}

function Detail({ label, value }) {
  return (
    <div className="drawer-detail">
      <span>{label}</span>
      <strong>{value || '—'}</strong>
    </div>
  );
}
