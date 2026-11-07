export function hasBookedAppointment(lead) {
  return Boolean(lead.booked_at) || Number(lead.booked_appointment_count ?? lead.calendly_appointment_count ?? 0) > 0;
}

export function salesPipelineLane(lead) {
  if (lead.deal_status === 'won' || lead.stage === 'Won') return 'won';
  if (lead.deal_status === 'lost' || lead.stage === 'Lost') return 'lost';
  if (lead.stage === 'Pitched') return 'pitched';
  if (lead.stage === 'Contacted' && (lead.disposition === 'Connected — follow up' || lead.next_follow_up_at)) return 'followups';
  return 'appointments';
}
export const SALES_PIPELINE_LANES = [
  ['appointments', 'Booked appointments'], ['followups', 'Follow-ups'],
  ['pitched', 'Pitched'], ['won', 'Won'], ['lost', 'Lost'],
];

export function selectPipelineLeads(leads, campaignId = '') {
  return leads.filter((lead) => (!campaignId || lead.campaign_id === campaignId) && (lead.pipeline_eligible ?? hasBookedAppointment(lead)));
}
