import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const library = '/api/operations/twilio/recordings';
const pageSize = 25;
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Los_Angeles',
});

function Recording({ item }) {
  const [notes, setNotes] = useState(item.notes);
  const [savedNotes, setSavedNotes] = useState(item.notes);
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  async function saveNotes(event) {
    event.preventDefault();
    setSaving(true);
    setNotice('');
    try {
      const response = await fetch(library, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, notes }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The notes could not be saved.');
      setNotes(data.notes);
      setSavedNotes(data.notes);
      setNotice('Notes saved.');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <article>
      <div className="recording-title">
        <h2>{item.lead_name}</h2>
        {item.company && <span>{item.company}</span>}
      </div>
      <p className="metadata">
        {dateFormatter.format(new Date(item.recorded_at))} Pacific · {item.actor_email}
        {item.duration_seconds != null && ` · ${Math.floor(item.duration_seconds / 60)}m ${item.duration_seconds % 60}s`}
      </p>
      {item.status === 'completed' ? (
        <audio
          aria-label={`Recording of ${item.lead_name}`}
          controls
          preload="none"
          src={`${library}/audio?id=${encodeURIComponent(item.id)}`}
          onError={() => setNotice('Audio could not load. Refresh and try again.')}
        />
      ) : (
        <p role="status">
          {item.status === 'absent' ? 'Audio unavailable.' : 'Recording is pending. Refresh after the call ends.'}
        </p>
      )}
      <form className="notes" onSubmit={saveNotes}>
        <label>
          Training notes
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows="2" maxLength="3000" />
        </label>
        <button type="submit" disabled={saving || notes === savedNotes}>{saving ? 'Saving…' : 'Save notes'}</button>
        {notice && <span role="status">{notice}</span>}
      </form>
    </article>
  );
}

export default function TrainingRecordings() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState({ search: '', offset: 0 });
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setData(null);
    setError('');
    const params = new URLSearchParams({ q: filter.search, offset: filter.offset });
    (async () => {
      try {
        const response = await fetch(`${library}?${params}`, { signal: controller.signal, cache: 'no-store' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'The training library could not load.');
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      }
    })();
    return () => controller.abort();
  }, [filter]);

  return (
    <main className="training-library">
      <Head><title>Onyx Dialer | Training recordings</title></Head>
      <Link href="/admin">← Back to dialer</Link>
      <h1>Training recordings</h1>
      <form className="search" onSubmit={(event) => {
        event.preventDefault();
        setFilter({ search: query.trim(), offset: 0 });
      }}>
        <label>
          Search by lead, company, rep, date, or notes
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} maxLength="160" placeholder="Example: objection or 2026-11-23" />
        </label>
        <button type="submit">Search</button>
        <button type="button" onClick={() => setFilter({ ...filter })}>Refresh</button>
      </form>
      {error && <p role="alert">{error}</p>}
      {!data && !error && <p role="status">Loading recordings…</p>}
      {data && !data.recordings.length && <p>No recordings found.</p>}
      {data?.recordings.map((item) => <Recording key={item.id} item={item} />)}
      {data && (filter.offset > 0 || data.hasMore) && (
        <nav aria-label="Recording pages">
          <button type="button" disabled={!filter.offset} onClick={() => setFilter({ ...filter, offset: Math.max(0, filter.offset - pageSize) })}>Previous</button>
          <button type="button" disabled={!data.hasMore} onClick={() => setFilter({ ...filter, offset: filter.offset + pageSize })}>Next</button>
        </nav>
      )}
      <style jsx global>{`
        .training-library { max-width: 820px; margin: 0 auto; padding: 2rem 1.25rem; color: #171717; }
        .training-library > a { color: inherit; text-decoration: underline; }
        .training-library h1 { margin: 1.4rem 0 1rem; font-size: clamp(1.7rem, 4vw, 2.25rem); }
        .training-library h2 { margin: 0; font-size: 1.12rem; }
        .training-library .search, .training-library nav { display: flex; flex-wrap: wrap; align-items: end; gap: 0.5rem; margin-bottom: 1.2rem; }
        .training-library .search label { flex: 1 0 min(100%, 260px); }
        .training-library label { display: grid; gap: 0.35rem; font-size: 0.9rem; }
        .training-library input, .training-library textarea, .training-library button { font: inherit; padding: 0.45rem 0.65rem; border: 1px solid #999; border-radius: 4px; }
        .training-library button { color: #171717; background: #fafafa; cursor: pointer; }
        .training-library button:disabled { color: #656565; cursor: default; }
        .training-library article { padding: 1rem 0 1.2rem; border-top: 1px solid #ddd; }
        .training-library .recording-title { display: flex; align-items: baseline; gap: 0.55rem; flex-wrap: wrap; }
        .training-library .metadata { color: #555; font-size: 0.88rem; }
        .training-library audio { display: block; max-width: 100%; margin: 0.65rem 0; }
        .training-library .notes { display: grid; gap: 0.5rem; margin-top: 0.75rem; }
        .training-library .notes button { justify-self: start; font-size: 0.88rem; }
        .training-library nav { margin-top: 0.8rem; }
      `}</style>
    </main>
  );
}
