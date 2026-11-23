import { currentOperationsPrincipal } from './operationsAccess';

export async function trainingLibraryAdmin(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  const principal = await currentOperationsPrincipal(req, { allowDevelopmentPreview: false });
  if (!principal) res.status(401).json({ error: 'Sign in to open the training library.' });
  else if (principal.role !== 'admin') res.status(403).json({ error: 'The training library is available to administrators.' });
  return principal?.role === 'admin' ? principal : null;
}
