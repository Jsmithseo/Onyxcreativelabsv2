import { useEffect, useState } from 'react';
import Header from './components/shared/Header';

const assignedLeads = [
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

export default function BdrPage() {
  const [screen, setScreen] = useState('welcome');
  const [email, setEmail] = useState('');
  const [requestError, setRequestError] = useState('');
  const [isRequestingLink, setIsRequestingLink] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(assignedLeads[0].id);
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState({});
  const [callStatus, setCallStatus] = useState('Ready');

  const selectedLead = assignedLeads.find((lead) => lead.id === selectedLeadId);

  useEffect(() => {
    async function restoreSession() {
      try {
        const response = await fetch('/api/bdr/session');
        if (response.ok) setScreen('workspace');
      } catch {
        // A network failure should leave the visitor at the safe sign-in screen.
      }
    }

    restoreSession();
  }, []);

  async function requestMagicLink(event) {
    event.preventDefault();
    if (!email.trim()) return;
    if (!email.trim().toLowerCase().endsWith('@gmail.com')) {
      setRequestError(
        'Use the Gmail address assigned to you for Onyx BDR Dialer access.'
      );
      return;
    }
    setIsRequestingLink(true);
    setRequestError('');

    try {
      const response = await fetch('/api/bdr/request-magic-link', {
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

  function saveNote() {
    if (!note.trim()) return;
    setSavedNotes((notes) => ({ ...notes, [selectedLeadId]: note.trim() }));
    setNote('');
  }

  function restartPreview() {
    setEmail('');
    setScreen('welcome');
    setCallStatus('Ready');
  }

  return (
    <>
      <Header />
      <main className="bdr-page">
        <section className="bdr-shell" aria-live="polite">
          {screen !== 'workspace' && (
            <header className="bdr-brand">
              <span>Onyx Creative Labs</span>
              <span className="bdr-brand-divider" aria-hidden="true">
                /
              </span>
              <span className="bdr-brand-product">BDR Dialer</span>
            </header>
          )}

          {screen === 'welcome' && (
            <div className="bdr-card bdr-welcome">
              <p className="bdr-eyebrow">Contractor access</p>
              <h1>Your calling workspace is ready when you are.</h1>
              <p className="bdr-copy">
                Sign in securely to see the leads assigned to you and keep your
                call notes in one place.
              </p>
              <button
                className="bdr-primary"
                type="button"
                onClick={() => setScreen('login')}
              >
                Log in
              </button>
            </div>
          )}

          {screen === 'login' && (
            <div className="bdr-card">
              <button
                className="bdr-back"
                type="button"
                onClick={() => setScreen('welcome')}
              >
                ← Back
              </button>
              <p className="bdr-eyebrow">Contractor login</p>
              <h1>Get your secure sign-in link</h1>
              <p className="bdr-copy">
                Enter the email address your administrator used for your invite.
              </p>
              <form onSubmit={requestMagicLink}>
                <label htmlFor="contractor-email">Work email</label>
                <input
                  id="contractor-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  required
                />
                <button
                  className="bdr-primary"
                  type="submit"
                  disabled={isRequestingLink}
                >
                  {isRequestingLink ? 'Sending link…' : 'Send magic link'}
                </button>
              </form>
              {requestError && (
                <p className="bdr-error" role="alert">
                  {requestError}
                </p>
              )}
              <p className="bdr-helper">
                You will never need to create or remember a password.
              </p>
            </div>
          )}

          {screen === 'check-email' && (
            <div className="bdr-card">
              <div className="bdr-success-icon" aria-hidden="true">
                ✓
              </div>
              <p className="bdr-eyebrow">Check your email</p>
              <h1>Your sign-in link is on its way.</h1>
              <p className="bdr-copy">
                If your address has contractor access, a secure sign-in link is
                on its way to <strong>{email}</strong>.
              </p>
              <p className="bdr-preview-note">
                The link expires in 15 minutes. Open it on this device to enter
                your dialer.
              </p>
              <button
                className="bdr-link"
                type="button"
                onClick={() => setScreen('login')}
              >
                Use a different email
              </button>
            </div>
          )}

          {screen === 'workspace' && selectedLead && (
            <div className="bdr-workspace">
              <header className="bdr-workspace-header">
                <div>
                  <p className="bdr-eyebrow">Contractor workspace</p>
                  <h1>Onyx BDR Dialer</h1>
                </div>
                <button
                  className="bdr-signout"
                  type="button"
                  onClick={restartPreview}
                >
                  Sign out
                </button>
              </header>

              <div className="bdr-workspace-grid">
                <aside className="bdr-leads" aria-label="Assigned leads">
                  <div className="bdr-panel-heading">
                    <div>
                      <p className="bdr-eyebrow">Your assigned leads</p>
                      <h2>Onyx Reviews</h2>
                    </div>
                    <span>{assignedLeads.length}</span>
                  </div>
                  {assignedLeads.map((lead) => (
                    <button
                      className={`bdr-lead ${
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
                  className="bdr-call-panel"
                  aria-label="Lead calling workspace"
                >
                  <p className="bdr-eyebrow">Current lead</p>
                  <h2>{selectedLead.name}</h2>
                  <p className="bdr-company">
                    {selectedLead.company} · {selectedLead.location}
                  </p>
                  <a
                    className="bdr-phone"
                    href={`tel:${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                  >
                    {selectedLead.phone}
                  </a>

                  <div className="bdr-call-controls">
                    <button
                      className="bdr-primary"
                      type="button"
                      onClick={() => setCallStatus('Calling in test mode')}
                    >
                      Start call
                    </button>
                    <span>{callStatus}</span>
                  </div>

                  <fieldset>
                    <legend>Call outcome</legend>
                    <div className="bdr-dispositions">
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

                  <label htmlFor="call-note">Call notes</label>
                  <textarea
                    id="call-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Capture the conversation, next step, or follow-up date…"
                    rows="5"
                  />
                  <div className="bdr-note-actions">
                    <button
                      className="bdr-secondary"
                      type="button"
                      onClick={saveNote}
                    >
                      Save note
                    </button>
                    {savedNotes[selectedLeadId] && <span>Saved locally</span>}
                  </div>
                </section>
              </div>
              <p className="bdr-preview-footnote">
                Calls, notes, and access controls will connect to your live
                services after their integrations are configured.
              </p>
            </div>
          )}
        </section>

        <style jsx>{`
          .bdr-page {
            min-height: 100vh;
            background: var(--onyx-light-gray);
            color: var(--onyx-black);
            font-family: var(--onyx-font);
            padding: 64px 24px 80px;
          }
          .bdr-shell {
            margin: 0 auto;
            max-width: 1120px;
          }
          .bdr-brand {
            align-items: center;
            color: var(--onyx-black);
            display: flex;
            font-size: 16px;
            font-weight: 600;
            gap: 9px;
            margin: 0 0 36px;
          }
          .bdr-brand-divider {
            color: var(--onyx-gray);
            font-weight: 400;
          }
          .bdr-brand-product {
            color: var(--onyx-charcoal);
            font-weight: 500;
          }
          .bdr-card {
            background: #fff;
            border: 1px solid var(--onyx-border);
            border-radius: 10px;
            box-shadow: 0 18px 45px rgba(24, 24, 27, 0.08);
            color: var(--onyx-black);
            margin: 0 auto;
            max-width: 520px;
            padding: 42px;
          }
          .bdr-welcome {
            max-width: 590px;
            padding: 54px;
          }
          .bdr-eyebrow {
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
            font-size: 25px;
            letter-spacing: -0.03em;
            margin-bottom: 6px;
          }
          .bdr-copy {
            color: var(--onyx-charcoal);
            font-size: 16px;
            line-height: 1.55;
            margin-bottom: 29px;
          }
          form {
            display: grid;
            gap: 11px;
          }
          label,
          legend {
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
          .bdr-primary {
            background: var(--onyx-accent);
            border: 1px solid var(--onyx-accent);
            border-radius: 5px;
            color: var(--onyx-black);
            font-weight: 700;
            margin-top: 12px;
            padding: 14px 18px;
            transition:
              background 0.15s ease,
              transform 0.15s ease;
          }
          .bdr-primary:hover {
            background: #bfdbfe;
            border-color: #bfdbfe;
            transform: translateY(-1px);
          }
          .bdr-primary:disabled {
            cursor: wait;
            opacity: 0.65;
            transform: none;
          }
          .bdr-helper,
          .bdr-preview-note {
            color: var(--onyx-gray);
            font-size: 13px;
            line-height: 1.5;
            margin: 17px 0 0;
          }
          .bdr-error {
            color: #b42318;
            font-size: 13px;
            line-height: 1.5;
            margin: 13px 0 0;
          }
          .bdr-preview-note {
            background: var(--onyx-accent-soft);
            border-radius: 5px;
            color: var(--onyx-charcoal);
            padding: 11px;
          }
          .bdr-back,
          .bdr-link {
            background: transparent;
            border: 0;
            color: var(--onyx-charcoal);
            font-weight: 700;
            padding: 0;
            text-decoration: underline;
            text-underline-offset: 3px;
          }
          .bdr-back {
            margin-bottom: 32px;
          }
          .bdr-link {
            display: block;
            margin: 18px auto 0;
          }
          .bdr-success-icon {
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
          .bdr-workspace {
            background: #fff;
            border: 1px solid var(--onyx-border);
            border-radius: 10px;
            box-shadow: 0 18px 45px rgba(24, 24, 27, 0.08);
            color: var(--onyx-black);
            overflow: hidden;
          }
          .bdr-workspace-header {
            align-items: center;
            background: var(--onyx-black);
            color: #fff;
            display: flex;
            justify-content: space-between;
            padding: 28px 32px;
          }
          .bdr-workspace-header .bdr-eyebrow {
            color: #d4d4d8;
            margin-bottom: 6px;
          }
          .bdr-workspace-header h1 {
            font-size: 26px;
            margin: 0;
          }
          .bdr-signout {
            background: transparent;
            border: 1px solid #a1a1aa;
            border-radius: 5px;
            color: #fff;
            font-weight: 700;
            padding: 9px 12px;
          }
          .bdr-workspace-grid {
            display: grid;
            grid-template-columns: minmax(240px, 0.72fr) minmax(0, 1.5fr);
            min-height: 570px;
          }
          .bdr-leads {
            background: var(--onyx-light-gray);
            border-right: 1px solid var(--onyx-border);
            padding: 24px 16px;
          }
          .bdr-panel-heading {
            align-items: flex-start;
            display: flex;
            justify-content: space-between;
            padding: 0 8px 16px;
          }
          .bdr-panel-heading h2 {
            font-size: 21px;
          }
          .bdr-panel-heading span {
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
          .bdr-lead {
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
          .bdr-lead:hover,
          .bdr-lead.is-selected {
            background: #fff;
            border-color: #cbd5e1;
          }
          .bdr-lead strong {
            font-size: 14px;
          }
          .bdr-lead span {
            color: var(--onyx-gray);
            font-size: 12px;
          }
          .bdr-call-panel {
            padding: 36px;
          }
          .bdr-company {
            color: var(--onyx-gray);
            margin-bottom: 17px;
          }
          .bdr-phone {
            color: var(--onyx-black);
            font-size: 20px;
            font-weight: 800;
            text-decoration-color: var(--onyx-accent);
            text-decoration-thickness: 2px;
            text-underline-offset: 4px;
          }
          .bdr-call-controls {
            align-items: center;
            display: flex;
            gap: 14px;
            margin: 28px 0;
          }
          .bdr-call-controls .bdr-primary {
            margin: 0;
          }
          .bdr-call-controls span {
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
            padding-right: 10px;
          }
          .bdr-dispositions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .bdr-dispositions button {
            background: #fff;
            border: 1px solid #cbd5e1;
            border-radius: 999px;
            color: var(--onyx-charcoal);
            font-size: 13px;
            font-weight: 700;
            padding: 8px 11px;
          }
          .bdr-dispositions button:hover {
            background: var(--onyx-accent-soft);
            border-color: var(--onyx-accent);
          }
          .bdr-call-panel > label {
            display: block;
            margin: 0 0 9px;
          }
          .bdr-note-actions {
            align-items: center;
            display: flex;
            gap: 12px;
            margin-top: 11px;
          }
          .bdr-secondary {
            background: var(--onyx-black);
            border: 1px solid var(--onyx-black);
            border-radius: 5px;
            color: #fff;
            font-weight: 700;
            padding: 10px 14px;
          }
          .bdr-note-actions span {
            color: var(--onyx-gray);
            font-size: 13px;
          }
          .bdr-preview-footnote {
            border-top: 1px solid var(--onyx-border);
            color: var(--onyx-gray);
            font-size: 12px;
            line-height: 1.5;
            margin: 0;
            padding: 17px 30px;
          }
          @media (max-width: 700px) {
            .bdr-page {
              padding: 40px 13px 56px;
            }
            .bdr-brand {
              margin-bottom: 28px;
            }
            .bdr-card,
            .bdr-welcome {
              padding: 30px 23px;
            }
            .bdr-workspace-header {
              align-items: flex-start;
              gap: 17px;
              padding: 24px 20px;
            }
            .bdr-workspace-grid {
              grid-template-columns: 1fr;
            }
            .bdr-leads {
              border-bottom: 1px solid #d5dfd7;
              border-right: 0;
            }
            .bdr-call-panel {
              padding: 28px 20px;
            }
          }
        `}</style>
      </main>
    </>
  );
}
