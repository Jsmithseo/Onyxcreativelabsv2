export default function PipelineComponent({
  lanes = [],
  leads = [],
  laneFor = () => '',
  onLeadClick = () => {},
  dateLabel = () => '—',
  money = () => '$0',
}) {
  return <><div className="pipeline-board" aria-label="Sales pipeline">
    {lanes.map(([id, label]) => {
      const cards = leads.filter((lead) => laneFor(lead) === id);
      return <section className="pipeline-lane" key={id}>
        <header><strong>{label}</strong><span>{cards.length}</span></header>
        {cards.length ? cards.map((lead) => <button className="pipeline-card" type="button" key={lead.id} onClick={() => onLeadClick(lead)}>
          <strong>{lead.name}</strong><span>{lead.company || 'Individual lead'}</span>
          <small>{id === 'followups' && lead.next_follow_up_at ? `Due ${dateLabel(lead.next_follow_up_at, true)}` : lead.stage}</small>
          <em>{money(lead.potential_commission_cents)} potential commission</em>
        </button>) : <p className="lane-empty">No {label.toLowerCase()} yet.</p>}
      </section>;
    })}
  </div><style jsx>{`
    .pipeline-board{display:grid;grid-template-columns:repeat(5,minmax(190px,1fr));gap:10px;overflow-x:auto}
    .pipeline-lane{background:var(--soft);border:1px solid var(--line);min-height:270px;padding:9px}
    .pipeline-lane header{display:flex;justify-content:space-between;padding:4px 4px 10px;font-size:12px}
    .pipeline-lane header span{color:var(--muted)}
    .pipeline-card{display:grid;gap:4px;width:100%;padding:10px;margin:0 0 8px;border:1px solid var(--line);border-radius:5px;background:#fff;text-align:left;cursor:pointer}
    .pipeline-card strong{font-size:13px}.pipeline-card span,.pipeline-card small{font-size:11px;color:var(--muted)}
    .pipeline-card em{font-style:normal;color:var(--green);font-size:10px;font-weight:700}
    .lane-empty{color:var(--muted);font-size:12px;padding:12px 4px}
    @media(max-width:1000px){.pipeline-board{grid-template-columns:repeat(5,220px)}}
  `}</style></>;
}
