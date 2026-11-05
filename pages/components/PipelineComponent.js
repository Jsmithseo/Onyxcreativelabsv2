export default function PipelineComponent({
  lanes = [],
  leads = [],
  laneFor = () => '',
  onLeadClick = () => {},
  dateLabel = () => '—',
  money = () => '$0',
}) {
  return <div className="pipeline-board" aria-label="Sales pipeline">
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
  </div>;
}
