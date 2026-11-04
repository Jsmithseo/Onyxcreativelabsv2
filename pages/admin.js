import { useEffect, useState } from 'react';
import Header from './components/shared/Header';

export default function AdminPage() {
  const [screen, setScreen] = useState('login');
  const [email, setEmail] = useState('');
  const [signedInEmail, setSignedInEmail] = useState('');
  const [requestError, setRequestError] = useState('');
  const [isRequestingLink, setIsRequestingLink] = useState(false);

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

  return (
    <>
      <Header />
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

          {screen === 'workspace' && (
            <section
              className="admin-workspace"
              aria-label="Onyx admin workspace"
            >
              <header className="admin-workspace-header">
                <div>
                  <p className="admin-eyebrow">Onyx Creative Labs</p>
                  <h1>Admin</h1>
                </div>
                <button
                  className="admin-signout"
                  type="button"
                  onClick={signOut}
                >
                  Sign out
                </button>
              </header>
              <div className="admin-workspace-body">
                <p className="admin-eyebrow">Signed in securely</p>
                <h2>Welcome back.</h2>
                <p className="admin-copy">
                  You’re signed in as <strong>{signedInEmail}</strong>.
                  Contractor and administrator sessions are isolated from one
                  another.
                </p>
                <div className="admin-status-grid">
                  <article>
                    <span>Contractors</span>
                    <strong>BDR access</strong>
                    <p>
                      Manage access and assignments here as the admin tools are
                      connected.
                    </p>
                  </article>
                  <article>
                    <span>Appointments</span>
                    <strong>Review queue</strong>
                    <p>
                      Booked appointment review and confirmation will appear
                      here.
                    </p>
                  </article>
                  <article>
                    <span>Onyx Reviews</span>
                    <strong>Campaign overview</strong>
                    <p>
                      Campaign performance will live in this administrator
                      workspace.
                    </p>
                  </article>
                </div>
              </div>
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
          input {
            border: 1px solid #cbd5e1;
            border-radius: 5px;
            color: var(--onyx-black);
            font: inherit;
            padding: 13px 14px;
            width: 100%;
          }
          input:focus {
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
          .admin-workspace-body {
            padding: 42px 32px;
          }
          .admin-status-grid {
            display: grid;
            gap: 16px;
            grid-template-columns: repeat(3, 1fr);
            margin-top: 32px;
          }
          .admin-status-grid article {
            border: 1px solid var(--onyx-border);
            border-top: 3px solid var(--onyx-accent);
            padding: 22px;
          }
          .admin-status-grid span {
            color: var(--onyx-gray);
            display: block;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.08em;
            margin-bottom: 10px;
            text-transform: uppercase;
          }
          .admin-status-grid strong {
            display: block;
            font-size: 18px;
            margin-bottom: 8px;
          }
          .admin-status-grid p {
            color: var(--onyx-charcoal);
            font-size: 14px;
            line-height: 1.5;
            margin: 0;
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
            .admin-workspace-body {
              padding: 30px 20px;
            }
            .admin-status-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </main>
    </>
  );
}
