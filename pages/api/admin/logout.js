export default function adminLogout(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `admin_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`
  );
  return res.status(204).end();
}
