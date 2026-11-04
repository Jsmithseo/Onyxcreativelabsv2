import { useEffect, useState } from 'react';
import Header from './components/shared/Header';
import AdminDialer from './components/AdminDialer';

const campaignLeads = [
  {
    id: 'onyx-review-001',
    name: 'Maya Thompson',
    company: 'Thompson Home Services',
    phone: '(415) 555-0142',
    location: 'Oakland, CA',
  },
  {
    id: 'onyx-review-002',
    name: 'Jordan Lee',
    company: 'Lee Solar & Roofing',
    phone: '(510) 555-0187',
    location: 'Berkeley, CA',
  },
  {
    id: 'onyx-review-003',
    name: 'Riley Martinez',
    company: 'Martinez Plumbing Co.',
    phone: '(925) 555-0129',
    location: 'Walnut Creek, CA',
  },
];

const dispositions = ['Connected', 'Left voicemail', 'No answer', 'Follow up'];

export default function AdminPage() {
  const [screen, setScreen] = useState('login');
  const [email, setEmail] = useState('');
  const [signedInEmail, setSignedInEmail] = useState('');
  const [requestError, setRequestError] = useState('');
  const [isRequestingLink, setIsRequestingLink] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(campaignLeads[0].id);
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState({});
  const [callStatus, setCallStatus] = useState('Ready');

  const selectedLead = campaignLeads.find((lead) => lead.id === selectedLeadId);

  useEffect(() => {
    async function restoreSession() {
      try {
        const response = await fetch('/api/admin/session');
        if (!response.ok) return;
        const session = await response.json();
        setSignedInEmail(session.email);
        setScreen('workspace');
      } catch {
        // Leave visitors at the sign-in screen when a session cannot be restored.
      }
    }

    restoreSession();
  }, []);

  async function requestMagicLink(event) {
    event.preventDefault();
    if (!email.trim()) return;
    if (!email.trim().toLowerCase().endsWith('@gmail.com')) {
      setRequestError(
        'Use the Google email address approved for Onyx administrator access.'
      );
      return;
    }

    setIsRequestingLink(true);
    setRequestError('');

    try {
      const response = await fetch('/api/admin/request-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || 'Unable to send sign-in email.');
      setScreen('check-email');
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setIsRequestingLink(false);
    }
  }

  async function signOut() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      setSignedInEmail('');
      setEmail('');
      setScreen('login');
    }
  }

  function saveNote() {
    if (!note.trim()) return;
    setSavedNotes((notes) => ({ ...notes, [selectedLeadId]: note.trim() }));
    setNote('');
  }

  return (
    <>
      {screen !== 'workspace' && <Header />}
      {screen === 'workspace' && (
        <AdminDialer signedInEmail={signedInEmail} onSignOut={signOut} />
      )}
      {screen !== 'workspace' && (
        <main className="admin-page">
          <section className="admin-shell" aria-live="polite">
            {screen !== 'workspace' && (
              <header className="admin-brand">
                <span>Onyx Creative Labs</span>
                <span className="admin-brand-divider" aria-hidden="true">
                  /
                </span>
                <span className="admin-brand-product">Admin</span>
              </header>
            )}

            {screen === 'login' && (
              <section className="admin-card">
                <p className="admin-eyebrow">Secure administrator access</p>
                <h1>Sign in to Onyx Admin</h1>
                <p className="admin-copy">
                  Enter your approved Google email and we’ll send a secure,
                  password-free sign-in link.
                </p>
                <form onSubmit={requestMagicLink}>
                  <label htmlFor="admin-email">Google email</label>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@gmail.com"
                    required
                  />
                  <button
                    className="admin-primary"
                    type="submit"
                    disabled={isRequestingLink}
                  >
                    {isRequestingLink ? 'Sending link…' : 'Send magic link'}
                  </button>
                </form>
                {requestError && (
                  <p className="admin-error" role="alert">
                    {requestError}
                  </p>
                )}
                <p className="admin-helper">
                  Administrator access is kept separate from contractor access.
                </p>
              </section>
            )}

            {screen === 'check-email' && (
              <section className="admin-card">
                <div className="admin-success-icon" aria-hidden="true">
                  ✓
                </div>
                <p className="admin-eyebrow">Check your email</p>
                <h1>Your secure link is on its way.</h1>
                <p className="admin-copy">
                  If this address has administrator access, a sign-in link is on
                  its way to <strong>{email}</strong>.
                </p>
                <p className="admin-note">
                  The link expires in 15 minutes and opens only the Onyx Admin
                  session.
                </p>
                <button
                  className="admin-link"
                  type="button"
                  onClick={() => setScreen('login')}
                >
                  Use a different email
                </button>
              </section>
            )}

            {screen === 'workspace' && selectedLead && (
              <section
                className="admin-workspace"
                aria-label="Onyx BDR Dialer admin workspace"
              >
                <header className="admin-workspace-header">
                  <div>
                    <p className="admin-eyebrow">Administrator access</p>
                    <h1>Onyx BDR Dialer</h1>
                  </div>
                  <div className="admin-header-actions">
                    <span className="admin-session-email">{signedInEmail}</span>
                    <button
                      className="admin-signout"
                      type="button"
                      onClick={signOut}
                    >
                      Sign out
                    </button>
                  </div>
                </header>
                <div className="admin-workspace-grid">
                  <aside className="admin-leads" aria-label="Campaign leads">
                    <div className="admin-panel-heading">
                      <div>
                        <p className="admin-eyebrow">Campaign leads</p>
                        <h2>Onyx Reviews</h2>
                      </div>
                      <span>{campaignLeads.length}</span>
                    </div>
                    {campaignLeads.map((lead) => (
                      <button
                        className={`admin-lead ${
                          lead.id === selectedLeadId ? 'is-selected' : ''
                        }`}
                        key={lead.id}
                        type="button"
                        onClick={() => {
                          setSelectedLeadId(lead.id);
                          setCallStatus('Ready');
                          setNote('');
                        }}
                      >
                        <strong>{lead.name}</strong>
                        <span>{lead.company}</span>
                      </button>
                    ))}
                  </aside>

                  <section
                    className="admin-call-panel"
                    aria-label="Lead calling workspace"
                  >
                    <p className="admin-eyebrow">Current lead</p>
                    <h2>{selectedLead.name}</h2>
                    <p className="admin-company">
                      {selectedLead.company} · {selectedLead.location}
                    </p>
                    <a
                      className="admin-phone"
                      href={`tel:${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                    >
                      {selectedLead.phone}
                    </a>

                    <div className="admin-call-controls">
                      <button
                        className="admin-primary"
                        type="button"
                        onClick={() => setCallStatus('Calling in test mode')}
                      >
                        Start call
                      </button>
                      <span>{callStatus}</span>
                    </div>

                    <fieldset>
                      <legend>Call outcome</legend>
                      <div className="admin-dispositions">
                        {dispositions.map((disposition) => (
                          <button
                            key={disposition}
                            type="button"
                            onClick={() =>
                              setCallStatus(`${disposition} selected`)
                            }
                          >
                            {disposition}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <label htmlFor="admin-call-note">Call notes</label>
                    <textarea
                      id="admin-call-note"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Capture the conversation, next step, or follow-up date…"
                      rows="5"
                    />
                    <div className="admin-note-actions">
                      <button
                        className="admin-secondary"
                        type="button"
                        onClick={saveNote}
                      >
                        Save note
                      </button>
                      {savedNotes[selectedLeadId] && <span>Saved locally</span>}
                    </div>
                  </section>
                </div>
                <p className="admin-workspace-footnote">
                  Administrator view: campaign leads are visible here while
                  contractor access stays restricted to assigned leads.
                </p>
              </section>
            )}
          </section>

          <style jsx>{`
            .admin-page {
              background: var(--onyx-light-gray);
              color: var(--onyx-black);
              font-family: var(--onyx-font);
              min-height: 100vh;
              padding: 64px 24px 80px;
            }
            .admin-shell {
              margin: 0 auto;
              max-width: 1120px;
            }
            .admin-brand {
              align-items: center;
              color: var(--onyx-black);
              display: flex;
              font-size: 16px;
              font-weight: 600;
              gap: 9px;
              margin: 0 0 36px;
            }
            .admin-brand-divider {
              color: var(--onyx-gray);
              font-weight: 400;
            }
            .admin-brand-product {
              color: var(--onyx-charcoal);
              font-weight: 500;
            }
            .admin-card,
            .admin-workspace {
              background: #fff;
              border: 1px solid var(--onyx-border);
              border-radius: 10px;
              box-shadow: 0 18px 45px rgba(24, 24, 27, 0.08);
            }
            .admin-card {
              color: var(--onyx-black);
              margin: 0 auto;
              max-width: 520px;
              padding: 42px;
            }
            .admin-eyebrow {
              color: var(--onyx-charcoal);
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.11em;
              margin: 0 0 10px;
              text-transform: uppercase;
            }
            h1,
            h2,
            p {
              margin-top: 0;
            }
            h1 {
              font-size: clamp(29px, 5vw, 43px);
              letter-spacing: -0.03em;
              line-height: 1.08;
              margin-bottom: 18px;
            }
            h2 {
              font-size: 28px;
              letter-spacing: -0.02em;
              line-height: 1.1;
              margin-bottom: 12px;
            }
            .admin-copy {
              color: var(--onyx-charcoal);
              font-size: 16px;
              line-height: 1.55;
              margin-bottom: 29px;
            }
            form {
              display: grid;
              gap: 11px;
            }
            label {
              color: var(--onyx-charcoal);
              font-size: 14px;
              font-weight: 700;
            }
            input,
            textarea {
              border: 1px solid #cbd5e1;
              border-radius: 5px;
              color: var(--onyx-black);
              font: inherit;
              padding: 13px 14px;
              width: 100%;
            }
            textarea {
              resize: vertical;
            }
            input:focus,
            textarea:focus {
              border-color: var(--onyx-accent);
              box-shadow: 0 0 0 3px var(--onyx-accent-soft);
              outline: none;
            }
            button {
              cursor: pointer;
              font: inherit;
            }
            .admin-primary {
              background: var(--onyx-accent);
              border: 1px solid var(--onyx-accent);
              border-radius: 5px;
              color: var(--onyx-black);
              font-weight: 700;
              margin-top: 12px;
              padding: 14px 18px;
            }
            .admin-primary:hover {
              background: #bfdbfe;
              border-color: #bfdbfe;
            }
            .admin-primary:disabled {
              cursor: wait;
              opacity: 0.65;
            }
            .admin-helper,
            .admin-note {
              color: var(--onyx-gray);
              font-size: 13px;
              line-height: 1.5;
              margin: 17px 0 0;
            }
            .admin-error {
              color: #b42318;
              font-size: 13px;
              line-height: 1.5;
              margin: 13px 0 0;
            }
            .admin-note {
              background: var(--onyx-accent-soft);
              border-radius: 5px;
              color: var(--onyx-charcoal);
              padding: 11px;
            }
            .admin-link {
              background: transparent;
              border: 0;
              color: var(--onyx-charcoal);
              display: block;
              font-weight: 700;
              margin: 18px auto 0;
              padding: 0;
              text-decoration: underline;
              text-underline-offset: 3px;
            }
            .admin-success-icon {
              align-items: center;
              background: var(--onyx-accent);
              border-radius: 999px;
              color: var(--onyx-black);
              display: flex;
              font-size: 23px;
              font-weight: 800;
              height: 46px;
              justify-content: center;
              margin-bottom: 25px;
              width: 46px;
            }
            .admin-workspace {
              overflow: hidden;
            }
            .admin-workspace-header {
              align-items: center;
              background: var(--onyx-black);
              color: #fff;
              display: flex;
              justify-content: space-between;
              padding: 28px 32px;
            }
            .admin-workspace-header .admin-eyebrow {
              color: #d4d4d8;
              margin-bottom: 6px;
            }
            .admin-workspace-header h1 {
              color: #fff;
              font-size: 26px;
              margin: 0;
            }
            .admin-signout {
              background: transparent;
              border: 1px solid #a1a1aa;
              border-radius: 5px;
              color: #fff;
              font-weight: 700;
              padding: 9px 12px;
            }
            .admin-header-actions {
              align-items: center;
              display: flex;
              gap: 14px;
            }
            .admin-session-email {
              color: #d4d4d8;
              font-size: 13px;
            }
            .admin-workspace-grid {
              display: grid;
              grid-template-columns: minmax(240px, 0.72fr) minmax(0, 1.5fr);
              min-height: 570px;
            }
            .admin-leads {
              background: var(--onyx-light-gray);
              border-right: 1px solid var(--onyx-border);
              padding: 24px 16px;
            }
            .admin-panel-heading {
              align-items: flex-start;
              display: flex;
              justify-content: space-between;
              padding: 0 8px 16px;
            }
            .admin-panel-heading h2 {
              font-size: 21px;
            }
            .admin-panel-heading span {
              align-items: center;
              background: var(--onyx-accent);
              border-radius: 999px;
              display: inline-flex;
              font-size: 13px;
              font-weight: 800;
              height: 25px;
              justify-content: center;
              width: 25px;
            }
            .admin-lead {
              background: transparent;
              border: 1px solid transparent;
              border-radius: 5px;
              color: var(--onyx-black);
              display: grid;
              gap: 4px;
              margin-bottom: 7px;
              padding: 13px 11px;
              text-align: left;
              width: 100%;
            }
            .admin-lead:hover,
            .admin-lead.is-selected {
              background: #fff;
              border-color: #cbd5e1;
            }
            .admin-lead strong {
              font-size: 14px;
            }
            .admin-lead span {
              color: var(--onyx-gray);
              font-size: 12px;
            }
            .admin-call-panel {
              padding: 36px;
            }
            .admin-company {
              color: var(--onyx-gray);
              margin-bottom: 17px;
            }
            .admin-phone {
              color: var(--onyx-black);
              font-size: 20px;
              font-weight: 800;
              text-decoration-color: var(--onyx-accent);
              text-decoration-thickness: 2px;
              text-underline-offset: 4px;
            }
            .admin-call-controls {
              align-items: center;
              display: flex;
              gap: 14px;
              margin: 28px 0;
            }
            .admin-call-controls .admin-primary {
              margin: 0;
            }
            .admin-call-controls span {
              color: var(--onyx-gray);
              font-size: 13px;
            }
            fieldset {
              border: 0;
              border-top: 1px solid var(--onyx-border);
              margin: 0 0 23px;
              padding: 20px 0 0;
            }
            legend {
              color: var(--onyx-charcoal);
              font-size: 14px;
              font-weight: 700;
              padding-right: 10px;
            }
            .admin-dispositions {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
            .admin-dispositions button {
              background: #fff;
              border: 1px solid #cbd5e1;
              border-radius: 999px;
              color: var(--onyx-charcoal);
              font-size: 13px;
              font-weight: 700;
              padding: 8px 11px;
            }
            .admin-dispositions button:hover {
              background: var(--onyx-accent-soft);
              border-color: var(--onyx-accent);
            }
            .admin-call-panel > label {
              display: block;
              margin: 0 0 9px;
            }
            .admin-note-actions {
              align-items: center;
              display: flex;
              gap: 12px;
              margin-top: 11px;
            }
            .admin-secondary {
              background: var(--onyx-black);
              border: 1px solid var(--onyx-black);
              border-radius: 5px;
              color: #fff;
              font-weight: 700;
              padding: 10px 14px;
            }
            .admin-note-actions span {
              color: var(--onyx-gray);
              font-size: 13px;
            }
            .admin-workspace-footnote {
              border-top: 1px solid var(--onyx-border);
              color: var(--onyx-gray);
              font-size: 12px;
              line-height: 1.5;
              margin: 0;
              padding: 17px 30px;
            }
            @media (max-width: 700px) {
              .admin-page {
                padding: 40px 13px 56px;
              }
              .admin-card {
                padding: 30px 23px;
              }
              .admin-workspace-header {
                align-items: flex-start;
                gap: 17px;
                padding: 24px 20px;
              }
              .admin-header-actions {
                align-items: flex-end;
                flex-direction: column;
                gap: 8px;
              }
              .admin-workspace-grid {
                grid-template-columns: 1fr;
              }
              .admin-leads {
                border-bottom: 1px solid var(--onyx-border);
                border-right: 0;
              }
              .admin-call-panel {
                padding: 28px 20px;
              }
            }
          `}</style>
        </main>
      )}
    </>
  );
}
