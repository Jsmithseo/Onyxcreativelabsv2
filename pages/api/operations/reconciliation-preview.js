import { currentOperationsPrincipal } from '../../../lib/operationsAccess';
import { previewLegacyReconciliation } from '../../../lib/operationsStore';
import { listContractors } from '../../../lib/contractorStore';

export const config = {
  api: { bodyParser: { sizeLimit: '8mb' } },
};

export default async function reconciliationPreview(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  try {
    const principal = await currentOperationsPrincipal(req);
    if (!principal || principal.role !== 'admin') {
      return res.status(403).json({ error: 'Administrator access required.' });
    }
    const campaignId = String(req.body?.campaignId || '').trim();
    const leads = Array.isArray(req.body?.leads)
      ? req.body.leads.filter((lead) => String(lead?.campaign || '') === campaignId)
      : [];
    const preview = await previewLegacyReconciliation({ leads });
    const contractorsByEmail = new Map(
      (await listContractors()).map((contractor) => [
        String(contractor.email).trim().toLowerCase(),
        contractor,
      ])
    );
    const mappedAssignmentCount = leads.filter((lead) => {
      const value = lead?.assignedTo || lead?.assigned_to || lead?.follow_up_owner_email;
      const contractor = contractorsByEmail.get(String(value || '').trim().toLowerCase());
      return contractor?.campaigns?.includes(campaignId);
    }).length;
    return res.status(200).json({
      campaignId,
      ...preview,
      mapped_assignment_count: mappedAssignmentCount,
      invalid_assignment_count: preview.explicit_assignment_count - mappedAssignmentCount,
    });
  } catch (error) {
    console.error('Unable to preview shared operations reconciliation', error.message);
    return res.status(503).json({ error: 'Unable to preview the reconciliation.' });
  }
}
