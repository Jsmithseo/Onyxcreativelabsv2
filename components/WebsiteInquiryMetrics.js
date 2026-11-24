import { useEffect, useState } from 'react';

const percent = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 });

export default function WebsiteInquiryMetrics() {
  const [report, setReport] = useState(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch('/api/admin/website-inquiry-metrics', { signal: controller.signal });
        if (response.status === 401) return;
        if (!response.ok) throw new Error('Inquiry metrics unavailable');
        const result = await response.json();
        if (!controller.signal.aborted) setReport(result);
      } catch {
        if (!controller.signal.aborted) setUnavailable(true);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  return (
    <section className="border rounded p-3 p-md-4 mb-4" aria-labelledby="inquiry-metrics-heading">
      <h2 className="h5" id="inquiry-metrics-heading">Inquiry funnel</h2>
      <p className="text-muted small">Past 30 days through today (UTC). A visitor can generate more than one form view.</p>
      {unavailable && <p role="alert" className="mb-0">Inquiry metrics are temporarily unavailable.</p>}
      {!report && !unavailable && <p role="status" className="mb-0">Loading metrics…</p>}
      {report && !report.rows.length && <p className="mb-0">No inquiry activity recorded yet.</p>}
      {report?.rows.length > 0 && (
        <>
          <p className="small">First activity in this report {report.firstRecorded}</p>
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col" className="text-end">Form views</th>
                  <th scope="col" className="text-end">Form starts</th>
                  <th scope="col" className="text-end">Accepted inquiries</th>
                  <th scope="col" className="text-end">Accepted per view</th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map(({ id, name, viewed, started, accepted }) => (
                  <tr key={id}>
                    <th scope="row">{name}</th>
                    <td className="text-end">{viewed}</td>
                    <td className="text-end">{started}</td>
                    <td className="text-end">{accepted}</td>
                    <td className="text-end">{viewed ? percent.format(accepted / viewed) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
