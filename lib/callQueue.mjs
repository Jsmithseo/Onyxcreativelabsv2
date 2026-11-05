export function belongsInCallQueue(lead, now = Date.now()) {
  if (['Won', 'Lost', 'Do Not Call', 'Appointment Set', 'Pitched'].includes(lead.stage) ||
      ['won', 'lost'].includes(lead.deal_status) || lead.pipeline_eligible || Number(lead.booked_appointment_count ?? lead.calendly_appointment_count ?? 0) > 0) return false;
  if (!lead.last_call_at) return true;
  const calledAt = new Date(lead.last_call_at).valueOf();
  const followUp = new Date(lead.next_follow_up_at || '').valueOf();
  return Number.isFinite(followUp) && followUp > calledAt && followUp <= now;
}

export function nextQueueLead(leads, completedId) {
  const index = leads.findIndex((lead) => lead.id === completedId);
  const remaining = leads.filter((lead) => lead.id !== completedId);
  return remaining[Math.min(Math.max(index, 0), remaining.length - 1)] || null;
}
