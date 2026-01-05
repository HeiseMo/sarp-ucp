import { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../lib/db.ts';
import { verifyPassword, signToken, setAuthCookie } from '../lib/auth.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  const sanitizeUserRow = (row: Record<string, any>) => {
    const copy = { ...row };
    // Remove sensitive fields if present
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
    // Query user by Name. We intentionally SELECT * to avoid hardcoding column names,
    // since the SA:MP schemas vary a lot between servers.
    const [rows]: any = await pool.execute(
      'SELECT * FROM players WHERE Name = ? LIMIT 1',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    // Verify password
    // Note: If BetterPassword is empty, we might need to check 'Password' (legacy)
    // But for now we assume BetterPassword is used as per the context.
    const isValid = verifyPassword(password, user.Salt ?? '', user.BetterPassword);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Sign JWT
    const token = signToken({
      id: user.ID,
      name: user.Name,
      adminLevel: user.AdminLevel ?? user.AdminLvl ?? 0,
    });

    // Set Cookie
    setAuthCookie(res, token);

    return res.status(200).json({ user: sanitizeUserRow(user) });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
