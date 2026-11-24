import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import WebsiteInquiryMetrics from '../../components/WebsiteInquiryMetrics';

const dateFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Los_Angeles',
});

export default function WebsiteInquiries() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [unavailable, setUnavailable] = useState(false);
  const cursor = typeof router.query.before === 'string' ? router.query.before : '';

  useEffect(() => {
    if (!router.isReady) return;
    const controller = new AbortController();
    const query = new URLSearchParams(cursor ? { before: cursor } : {});
    setResult(null);
    setUnavailable(false);

    async function loadInquiries() {
      try {
        const response = await fetch(`/api/admin/website-inquiries?${query}`, { signal: controller.signal });
        if (response.status === 401) {
          await router.replace('/admin');
          return;
        }
        if (!response.ok) throw new Error('Inbox unavailable');
        const data = await response.json();
        if (!controller.signal.aborted) setResult(data);
      } catch {
        if (!controller.signal.aborted) setUnavailable(true);
      }
    }

    loadInquiries();
    return () => controller.abort();
  }, [router.isReady, router.replace, cursor]);

  const inquiries = result?.inquiries || [];
  const next = result?.next;
  return (
    <main className="container py-5">
      <Head>
        <title>Website Inquiries | Onyx Admin</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Link href="/admin">Back to Onyx Admin</Link>
      <h1 className="mt-4">Website inquiries</h1>
      <WebsiteInquiryMetrics />
      <h2 className="h5">Saved inquiries</h2>
      <p className="text-muted">These inquiries were saved here when the email notification could not be sent.</p>
      {unavailable && <p className="alert alert-danger" role="alert">The inbox is temporarily unavailable. Refresh the page to try again.</p>}
      {!unavailable && !result && <p role="status">Loading inquiries…</p>}
      {result && !inquiries.length && <p>No saved inquiries on this page.</p>}
      {inquiries.map((inquiry) => (
        <article className="card mb-3" key={inquiry.id}>
          <div className="card-body text-break">
            <h3 className="h5 mb-1">{inquiry.name}</h3>
            <p className="small text-muted mb-2">
              {inquiry.source} · <time dateTime={inquiry.receivedAt}>{dateFormat.format(new Date(inquiry.receivedAt))} PT</time>
            </p>
            <a href={`mailto:${encodeURIComponent(inquiry.email)}`}>{inquiry.email}</a>
            <dl className="mt-3 mb-0">
              {inquiry.fields.filter(({ name }) => !['firstname', 'lastname', 'email', 'name'].includes(name)).map(({ name, value }, index) => (
                <div className="mb-2" key={`${name}-${index}`}>
                  <dt className="text-capitalize">{name.replaceAll('_', ' ')}</dt>
                  <dd className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{value}</dd>
                </div>
              ))}
            </dl>
            {inquiry.pageUri && <p className="small text-muted mb-0">Submitted from {inquiry.pageUri}</p>}
          </div>
        </article>
      ))}
      {next && <Link href={{ pathname: '/admin/website-inquiries', query: { before: next } }}>Older inquiries</Link>}
    </main>
  );
}
