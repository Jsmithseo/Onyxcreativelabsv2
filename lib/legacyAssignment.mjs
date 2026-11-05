const assignmentKeys = [
  'assignedTo',
  'assigned_to',
  'follow_up_owner_email',
  'followUpOwnerEmail',
];

// Browser payloads routinely contain `assignedTo: null`. That is absence of
// assignment information, not an instruction to erase a durable server owner.
export function legacyAssignment(lead = {}) {
  const assignedTo = assignmentKeys
    .map((key) => String(lead?.[key] ?? '').trim().toLowerCase())
    .find(Boolean);
  if (assignedTo) return { action: 'assign', email: assignedTo };
  if (lead?.clearAssignment === true) return { action: 'clear', email: null };
  return { action: 'none', email: null };
}

export function invalidLegacyAssignments(leads, contractors) {
  const contractorsByEmail = new Map(
    (Array.isArray(contractors) ? contractors : []).map((contractor) => [
      String(contractor.email || '').trim().toLowerCase(),
      contractor,
    ])
  );
  return (Array.isArray(leads) ? leads : []).filter((lead) => {
    if (lead.assignment_action !== 'assign') return false;
    const contractor = contractorsByEmail.get(lead.follow_up_owner_email);
    return !contractor || !contractor.campaigns?.includes(lead.campaign_id);
  });
}
