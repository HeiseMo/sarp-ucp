import { VercelRequest, VercelResponse } from '@vercel/node';
import pool from './lib/db.js';
import { getAuthToken, verifyToken } from './lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional: Require auth to view leaderboard? usually public inside UCP is fine.
  // But let's check token just in case we want to restrict it or highlight the current user.
  const token = getAuthToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (!verifyToken(token)) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    // Wealth = Money + Bank
    // Use aliases to ensure consistent casing (mysql2 usually returns existing case, but this is safer)
    const query = `
      SELECT Name as name, Money as money, Bank as bank, avatar_image_url as avatarUrl
      FROM players 
      ORDER BY (Money + Bank) DESC 
      LIMIT 50
    `;
    
    console.log("Executing Leaderboard Query...");
    const [rows]: any = await pool.execute(query);
    console.log(`Leaderboard Rows found: ${rows?.length}`);

    const leaderboard = rows.map((row: any, index: number) => {
      // Helper for case-insensitivity just in case aliases didn't take for some reason (rare)
      const getVal = (k: string) => row[k] ?? row[k.toLowerCase()] ?? row[k.toUpperCase()];

      const money = Number(getVal('money'));
      const bank = Number(getVal('bank'));
      const wealth = (isNaN(money) ? 0 : money) + (isNaN(bank) ? 0 : bank);
      
      const formattedWealth = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(wealth);

      return {
        rank: index + 1,
        username: getVal('name') || "Unknown",
        stat: formattedWealth,
        avatarUrl: getVal('avatarUrl') || `https://i.pravatar.cc/150?u=${index}`,
        trend: 'same'
      };
    });

    return res.status(200).json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
