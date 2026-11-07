export function belongsInCallQueue(lead, now = Date.now()) {
  if (['Won', 'Lost', 'Do Not Call', 'Appointment Set', 'Pitched'].includes(lead.stage) ||
      ['won', 'lost'].includes(lead.deal_status) || lead.booked_at || lead.pipeline_eligible || Number(lead.booked_appointment_count ?? lead.calendly_appointment_count ?? 0) > 0) return false;
  const lastCall = lead.queue_is_personal ? lead.caller_last_call_at : lead.last_call_at;
  if (!lastCall) return true;
  const calledAt = new Date(lastCall).valueOf();
  const followUp = new Date(queueFollowUpAt(lead) || '').valueOf();
  return Number.isFinite(followUp) && followUp > calledAt && followUp <= now;
}

export function nextQueueLead(leads, completedId) {
  const index = leads.findIndex((lead) => lead.id === completedId);
  const remaining = leads.filter((lead) => lead.id !== completedId);
  return remaining[index >= 0 && index < remaining.length ? index : 0] || null;
}

export function queueFollowUpAt(lead) {
  return lead.queue_is_personal ? lead.caller_next_follow_up_at : lead.next_follow_up_at;
}

export function isDue(lead, now = Date.now()) {
  const followUp = new Date(queueFollowUpAt(lead) || '').valueOf();
  return Number.isFinite(followUp) && followUp <= now;
}

export function compareCallQueueLeads(left, right, zones, now = Date.now()) {
  const leftDue = isDue(left, now);
  const rightDue = isDue(right, now);
  if (leftDue !== rightDue) return leftDue ? -1 : 1;
  if (leftDue && rightDue) {
    const difference = new Date(queueFollowUpAt(left)) - new Date(queueFollowUpAt(right));
    if (difference) return difference;
  }
  return zones.indexOf(left.time_zone) - zones.indexOf(right.time_zone)
    || String(left.name).localeCompare(String(right.name))
    || String(left.id).localeCompare(String(right.id));
}

// The last saved call is the durable checkpoint. Keep earlier skipped leads in
// the queue, while starting after that checkpoint on refresh or another device.
export function resumeCallQueue(orderedLeads, completedLead, zones, now = Date.now()) {
  if (!completedLead) return orderedLeads;
  const due = orderedLeads.filter((lead) => isDue(lead, now));
  const remaining = orderedLeads.filter((lead) => !isDue(lead, now));
  const index = remaining.findIndex((lead) => compareCallQueueLeads(lead, completedLead, zones, now) > 0);
  if (index <= 0) return orderedLeads;
  return [...due, ...remaining.slice(index), ...remaining.slice(0, index)];
}
