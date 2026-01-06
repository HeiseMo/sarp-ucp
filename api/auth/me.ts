import { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../lib/db';
import { verifyToken, getAuthToken } from '../lib/auth';
import { mapCharacterProfile } from '../lib/character';
import { mapAffiliations } from '../lib/affiliations';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = getAuthToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const decoded: any = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const sanitizeUserRow = (row: Record<string, any>) => {
    const copy = { ...row };
    delete copy.Password;
    delete copy.Salt;
    delete copy.BetterPassword;
    delete copy.NewPassword;
    delete copy.NewSalt;
    delete copy.SecurityKey;
    delete copy.DoubleStepPassword;
    return copy;
  };

  try {
    // Query user by ID from token
    const [rows]: any = await pool.execute(
      'SELECT * FROM players WHERE ID = ? LIMIT 1',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const rawUser = rows[0];
    const user = {
      ...sanitizeUserRow(rawUser),
      character: mapCharacterProfile(rawUser),
      affiliations: mapAffiliations(rawUser)
    };

    return res.status(200).json({ user });

  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
