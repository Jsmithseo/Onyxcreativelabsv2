import { sendContactEmail } from '../../lib/bdrMail';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { email, name, message } = req.body;

    try {
      await sendContactEmail({ email, name, message });

      return res.status(200).send({ done: true });
    } catch (err) {
      console.error('Unable to send contact email', err.message);
      return res.status(500).send({ error: 'Failed to send email.' });
    }
  }

  return res.status(404).send();
};
