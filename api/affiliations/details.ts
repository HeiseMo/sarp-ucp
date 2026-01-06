import { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../lib/db';
import { getAuthToken, verifyToken } from '../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = getAuthToken(req);
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { type, id } = req.query;
  const targetId = Number(id);

  if (!type || isNaN(targetId)) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  // Determine column to query based on type
  let column = '';
  // Default to backticked Rank to avoid MySQL 8.0+ keyword collisions
  let rankColumn = '`Rank`'; 
  
  if (type === 'Faction') {
    // Member is a reserved keyword in MySQL 8.0+
    column = '`Member`';
    rankColumn = '`Rank`';
  } else if (type === 'Family') {
    column = '`FMember`'; 
    rankColumn = '`Rank`'; 
  } else if (type === 'Group') {
    column = '`Group`'; // Group is reserved keyword
    rankColumn = '`GroupRank`';
  } else if (type === 'Agency') {
    column = '`Job`';
    rankColumn = '`CHits`'; // Use Hits as rank for Hitmen
  } else {
    return res.status(400).json({ error: 'Invalid affiliation type' });
  }

  try {
    // 1. Get Members
    // Limit to 50 for performance
    const query = `
      SELECT ID, Name, ${rankColumn} as rankId, LastLogin, avatar_image_url 
      FROM players 
      WHERE ${column} = ? 
      ORDER BY ${rankColumn} DESC, LastLogin DESC 
      LIMIT 100
    `;

    const [rows]: any = await pool.execute(query, [targetId]);

    const members = rows.map((row: any) => ({
      id: row.ID,
      name: row.Name,
      rank: row.rankId, // Just number for now
      lastActive: row.LastLogin, // Date string or unix
      avatarUrl: row.avatar_image_url || `https://i.pravatar.cc/150?u=${row.Name}`
    }));

    return res.status(200).json({ members });
  } catch (err: any) {
    console.error('Affiliation details error:', err);
    return res.status(500).json({ error: err.message });
  }
}
