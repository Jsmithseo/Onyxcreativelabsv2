import { useEffect, useState } from 'react';
import Header from './components/shared/Header';

export default function AdminPage() {
  const [screen, setScreen] = useState('checking');
  const [email, setEmail] = useState('');
  const [requestError, setRequestError] = useState('');
  const [isRequestingLink, setIsRequestingLink] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      try {
        const response = await fetch('/api/admin/session');
        setScreen(response.ok ? 'workspace' : 'login');
      } catch {
        setScreen('login');
      }
    }

    restoreSession();
  }, []);

  async function requestMagicLink(event) {
    event.preventDefault();
    if (!email.trim()) return;

    setIsRequestingLink(true);
    setRequestError('');

    try {
      const response = await fetch('/api/admin/request-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unable to send sign-in email.');
      }
      setScreen('check-email');
    } catch (error) {
      setRequestError(error.message);
    } finally {
      setIsRequestingLink(false);
    }
  }

  if (screen === 'workspace') {
    return (
      <iframe
        title="Onyx Dialer administrator workspace"
        src="/dialer/admin/index.html"
        className="admin-dialer-frame"
      />
    );
  }

  return (
    <>
      <Header />
      <main className="admin-gate">
        <section className="admin-gate-card" aria-live="polite">
          {screen === 'checking' && <p>Checking secure access…</p>}

          {screen === 'login' && (
            <>
              <p className="admin-gate-eyebrow">Secure administrator access</p>
              <h1>Sign in to Onyx Admin</h1>
              <p>
                Enter your approved email and we’ll send a secure,
                password-free sign-in link.
              </p>
              <form onSubmit={requestMagicLink}>
                <label htmlFor="admin-email">Email address</label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  required
                />
                <button type="submit" disabled={isRequestingLink}>
                  {isRequestingLink ? 'Sending link…' : 'Send magic link'}
                </button>
              </form>
              {requestError && <p className="admin-gate-error">{requestError}</p>}
              <p className="admin-gate-helper">
                You will never need to create or remember a password.
              </p>
            </>
          )}

          {screen === 'check-email' && (
            <>
              <p className="admin-gate-eyebrow">Check your email</p>
              <h1>Your secure link is on its way.</h1>
              <p>
                If this address has administrator access, a sign-in link is on
                its way to <strong>{email}</strong>.
              </p>
              <p className="admin-gate-helper">
                The link expires in 15 minutes and opens only the Onyx Admin
                session.
              </p>
              <button
                className="admin-gate-link"
                type="button"
                onClick={() => setScreen('login')}
              >
                Use a different email
              </button>
            </>
          )}
        </section>
      </main>

      <style jsx>{`
        .admin-dialer-frame {
          border: 0;
          display: block;
          height: 100vh;
          min-height: 760px;
          width: 100%;
        }
        .admin-gate {
          align-items: center;
          background: var(--onyx-light-gray);
          display: flex;
          justify-content: center;
          min-height: calc(100vh - 82px);
          padding: 40px 24px;
        }
        .admin-gate-card {
          background: #fff;
          border: 1px solid var(--onyx-border);
          box-shadow: 0 18px 45px rgba(24, 24, 27, 0.08);
          max-width: 500px;
          padding: 38px;
          width: 100%;
        }
        .admin-gate-eyebrow {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.11em;
          margin: 0 0 10px;
          text-transform: uppercase;
        }
        h1 {
          font-size: 34px;
          line-height: 1.1;
          margin: 0 0 15px;
        }
        p {
          color: var(--onyx-charcoal);
          line-height: 1.55;
        }
        form {
          display: grid;
          gap: 10px;
          margin-top: 24px;
        }
        label {
          font-size: 14px;
          font-weight: 700;
        }
        input,
        button {
          font: inherit;
        }
        input {
          border: 1px solid #cbd5e1;
          padding: 13px 14px;
        }
        button {
          background: var(--onyx-black);
          border: 1px solid var(--onyx-black);
          color: #fff;
          cursor: pointer;
          font-weight: 700;
          padding: 13px 16px;
        }
        button:disabled {
          cursor: wait;
          opacity: 0.65;
        }
        .admin-gate-error {
          color: #b42318;
          font-size: 13px;
        }
        .admin-gate-helper {
          color: var(--onyx-gray);
          font-size: 13px;
          margin: 18px 0 0;
        }
        .admin-gate-link {
          background: transparent;
          border: 0;
          color: var(--onyx-black);
          margin-top: 20px;
          padding: 0;
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}
