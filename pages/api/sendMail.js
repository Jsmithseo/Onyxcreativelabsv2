import leadHandler from './lead';

// Older contact forms allowed an email without a name.
export default function sendMailHandler(req, res) {
  req.body = {
    ...req.body,
    name: req.body?.name || 'Website visitor',
    source: req.body?.source || 'Website contact form',
  };
  return leadHandler(req, res);
}
