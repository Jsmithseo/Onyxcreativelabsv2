export function hasBookedAppointment(lead) {
  return Number(lead.booked_appointment_count ?? lead.calendly_appointment_count ?? 0) > 0;
}

export function salesPipelineLane(lead) {
  if (lead.deal_status === 'won' || lead.stage === 'Won') return 'won';
  if (lead.deal_status === 'lost' || lead.stage === 'Lost') return 'lost';
  if (lead.stage === 'Pitched') return 'pitched';
  if (lead.stage === 'Contacted' && (lead.disposition === 'Connected — follow up' || lead.next_follow_up_at)) return 'followups';
  return 'appointments';
}
