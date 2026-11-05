export default function CallHistory({ campaignName, calls = [], total = 0, page = 0, pageSize = 20, loading = false, error = '', onRetry, onPage, onLead }) {
  const date = (value) => new Date(value).toLocaleString([], { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' });
  return <section className="call-history" aria-label="Shared call history">
    <header><div><h2>Call history</h2><p>{campaignName || 'Campaign'}</p></div><span>{total} calls logged</span></header>
    {error && <p className="error" role="alert">{error} <button type="button" onClick={onRetry}>Retry</button></p>}
    <div className="scroll"><div className="table">
      <div className="grid headings"><span>Lead</span><span>Called by</span><span>Outcome</span><span>Logged at</span></div>
      {calls.map((call) => <button type="button" className="grid row" key={call.id} onClick={() => onLead(call)}><span><strong>{call.lead_name}</strong><small>{call.company || call.campaign_name}</small></span><span>{call.actor_email}</span><span>{call.disposition || 'Call logged'}</span><span>{date(call.created_at)}</span></button>)}
      {!calls.length && <p className="empty">{loading ? 'Loading call history…' : 'No calls logged for this campaign yet.'}</p>}
    </div></div>
    <footer><span>{loading ? 'Refreshing…' : total ? `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, total)} of ${total}` : '0 calls'}</span><div><button type="button" disabled={loading || page === 0} onClick={() => onPage(page - 1)}>Previous</button><button type="button" disabled={loading || (page + 1) * pageSize >= total} onClick={() => onPage(page + 1)}>Next</button></div></footer>
    <style jsx>{`
      .call-history{margin-top:18px;border:1px solid var(--line,#ddd);background:#fff;color:var(--ink,#171717)}
      header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-bottom:1px solid var(--line,#ddd)}h2{margin:0;font-size:14px;font-weight:700}header p{margin:3px 0 0;color:var(--muted,#737373);font-size:11px}header>span{font-size:12px;color:var(--muted,#737373)}
      .scroll{overflow-x:auto}.table{min-width:660px}.grid{display:grid;grid-template-columns:1.2fr 1.1fr 1fr .9fr}.grid>span{min-width:0;display:flex;flex-direction:column;justify-content:center;gap:3px;padding:11px 13px;border-right:1px solid var(--line,#ddd);overflow-wrap:anywhere}.grid>span:last-child{border-right:0}.headings{background:var(--soft,#f6f6f6);color:var(--muted,#737373);font-size:12px;font-weight:600}.row{width:100%;padding:0;border:0;border-top:1px solid var(--line,#ddd);background:#fff;text-align:left;color:inherit;font:inherit;font-size:12px;cursor:pointer}.row:hover{background:#fafafa}.row strong{font-size:13px}.row small{color:var(--muted,#737373);font-size:11px}.empty{margin:0;padding:24px;color:var(--muted,#737373);font-size:13px}.error{margin:12px;padding:10px;background:#fff0ee;color:#9f2e1d;font-size:13px}
      footer{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:46px;padding:8px 13px;border-top:1px solid var(--line,#ddd);color:var(--muted,#737373);font-size:12px}footer div{display:flex;gap:6px}footer button{min-height:30px;padding:4px 10px;border:1px solid var(--line,#ddd);border-radius:5px;background:#fff;color:#333;font:inherit;font-size:12px;cursor:pointer}footer button:disabled{color:#aaa;background:var(--soft,#f6f6f6);cursor:default}button:focus-visible{outline:2px solid #1b7348;outline-offset:2px}
    `}</style>
  </section>;
}
