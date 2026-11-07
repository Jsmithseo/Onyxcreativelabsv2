// Lead supply is managed through Admin. Retire the old contractor uploader
// as well as its UI so bookmarked clients cannot keep creating lead batches.
export default async function contractorLeadImport(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  return res.status(410).json({ error: 'Contractor lead uploads have been removed. Leads are supplied through Admin.' });
}
