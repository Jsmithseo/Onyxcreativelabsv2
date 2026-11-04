import { useCallback, useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from 'reactstrap';
import Header from './components/shared/Header';

export default function AdminPage() {
  const [screen, setScreen] = useState('checking');
  const [email, setEmail] = useState('');
  const [requestError, setRequestError] = useState('');
  const [isRequestingLink, setIsRequestingLink] = useState(false);
  const dialerFrame = useRef(null);
  const [dialerHeight, setDialerHeight] = useState(null);

  const syncDialerHeight = useCallback(() => {
    const document = dialerFrame.current?.contentDocument;
    if (!document?.body) return;

    const height = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
      760
    );
    setDialerHeight(height);
  }, []);

  useEffect(() => {
    const frame = dialerFrame.current;
    if (screen !== 'workspace' || !frame) return undefined;

    let observer;
    const observeDialer = () => {
      syncDialerHeight();
      const document = frame.contentDocument;
      if (!document?.body || !window.ResizeObserver) return;
      observer = new ResizeObserver(syncDialerHeight);
      observer.observe(document.body);
      observer.observe(document.documentElement);
    };

    frame.addEventListener('load', observeDialer);
    observeDialer();
    return () => {
      frame.removeEventListener('load', observeDialer);
      observer?.disconnect();
    };
  }, [screen, syncDialerHeight]);

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
      <Container fluid className="p-0">
        <iframe
          ref={dialerFrame}
          title="Onyx Dialer administrator workspace"
          src="/dialer/admin/index.html"
          style={{
            border: 0,
            display: 'block',
            height: dialerHeight ? `${dialerHeight}px` : '100dvh',
            minHeight: '760px',
            width: '100%',
          }}
        />
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container fluid className="admin-gate">
        <Row className="justify-content-center w-100">
          <Col lg="5" md="7" sm="10" xl="4">
            <Card className="admin-gate-card" aria-live="polite">
              <CardBody className="p-4 p-md-5">
          {screen === 'checking' && (
            <p className="mb-0">
              <Spinner size="sm" className="me-2" />
              Checking secure access…
            </p>
          )}

          {screen === 'login' && (
            <>
              <p className="admin-gate-eyebrow">Secure administrator access</p>
              <h1>Sign in to Onyx Admin</h1>
              <p>
                Enter your approved email and we’ll send a secure,
                password-free sign-in link.
              </p>
              <Form onSubmit={requestMagicLink}>
                <FormGroup>
                  <Label for="admin-email">Email address</Label>
                  <Input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  required
                />
                </FormGroup>
                <Button color="dark" type="submit" disabled={isRequestingLink}>
                  {isRequestingLink && <Spinner size="sm" className="me-2" />}
                  {isRequestingLink ? 'Sending link…' : 'Send magic link'}
                </Button>
              </Form>
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
              <Button
                className="admin-gate-link"
                color="link"
                type="button"
                onClick={() => setScreen('login')}
              >
                Use a different email
              </Button>
            </>
          )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
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
          cursor: pointer;
          font-weight: 700;
          padding: 12px 16px;
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
