import { VercelRequest, VercelResponse } from '@vercel/node';
import { clearAuthCookie } from '../lib/auth.ts';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  clearAuthCookie(res);
  return res.status(200).json({ message: 'Logged out' });
}
