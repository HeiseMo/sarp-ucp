import { VercelRequest, VercelResponse } from '@vercel/node';
import pool from './lib/db.ts';
import { getAuthToken, verifyToken } from './lib/auth.ts';
import { VEHICLE_MODELS } from './lib/vehicleModels.ts';
import { getWeaponName } from './lib/character.ts';

function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toStringSafe(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

function toBool01(value: unknown): boolean {
  return toNumber(value) === 1;
}

function vehicleImageUrl(modelId: number): string {
  // open.mp hosts a vehicle thumbnail for each GTA:SA model id.
  // Example: https://assets.open.mp/assets/images/vehiclePictures/Vehicle_411.jpg
  return `https://assets.open.mp/assets/images/vehiclePictures/Vehicle_${modelId}.jpg`;
}

function parseStorage(row: any, type: 'House' | 'Vehicle'): { money: number, items: any[], weapons: any[] } {
  const items: any[] = [];
  const weapons: any[] = [];
  const money = type === 'House' ? toNumber(row.Cash) : 0;

  const add = (id: string, name: string, val: any) => {
    const amt = toNumber(val);
    if (amt > 0) items.push({ id, name, amount: amt });
  };

  // Common drugs/mats
  add('pot', 'Pot', row.Pot);
  add('crack', 'Crack', row.Crack);
  add('cannabis', 'Cannabis', row.Cannabis);
  add('cocaine', 'Cocaine', row.Cocaine);
  add('meth', 'Meth', row.Meth);
  add('xanax', 'Xanax', row.Xanax);
  add('materials', 'Materials', row.Materials);
  
  if (type === 'Vehicle') {
    add('armor', 'Body Armor', row.Armor);
  }

  // Weapons
  // Houses often have Gun1..GunX and Ammo1..AmmoX
  // Vehicles: Gun1, Gun2 (Schema check said Gun1, Gun2 for vehicles, Gun1..7 for houses)
  const maxGuns = type === 'House' ? 10 : 3; 

  for (let i = 1; i <= maxGuns; i++) {
    const gunId = toNumber(row[`Gun${i}`] ?? row[`gun${i}`]);
    if (gunId > 0) {
      // Try to find ammo. 
      // House: Ammo1..Ammo4?
      // Vehicles: usually embedded or separate col.
      // We'll try generic Ammo field names.
      const ammo = toNumber(row[`Ammo${i}`] ?? row[`ammo${i}`] ?? row[`Gun${i}Ammo`]);
      weapons.push({ id: gunId, name: getWeaponName(gunId), ammo });
    }
  }

  return { money, items, weapons };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = getAuthToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const decoded: any = verifyToken(token);
  if (!decoded?.id) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    // We fetch the Name too because houses.OwnerID may reference either players.ID or players.Name.
    const [playerRows]: any = await pool.execute('SELECT ID, Name FROM players WHERE ID = ? LIMIT 1', [decoded.id]);
    if (!Array.isArray(playerRows) || playerRows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const playerId = playerRows[0].ID;
    const playerName = playerRows[0].Name;

    // Houses/properties
    let houseRows: any[] = [];
    try {
      const [rows]: any = await pool.execute(
        'SELECT * FROM houses WHERE OwnerID = ? OR CAST(OwnerID AS CHAR) = ? LIMIT 200',
        [playerId, playerName]
      );
      houseRows = Array.isArray(rows) ? rows : [];
    } catch (e: any) {
      // If the table doesn't exist yet, just return empty.
      if (e?.code !== 'ER_NO_SUCH_TABLE') {
        console.error('Assets houses query error:', e);
      }
    }

    // Vehicles
    let vehicleRows: any[] = [];
    try {
      const [rows]: any = await pool.execute('SELECT * FROM playervehicles WHERE pID = ? LIMIT 200', [playerId]);
      vehicleRows = Array.isArray(rows) ? rows : [];
    } catch (e: any) {
      if (e?.code !== 'ER_NO_SUCH_TABLE') {
        console.error('Assets vehicles query error:', e);
      }
    }

    // Map to UI Property[] shape
    const properties: any[] = [];

    for (const h of houseRows) {
      const houseId = toNumber(h.HouseID ?? h.ID ?? h.houseid);
      const value = toNumber(h.Value ?? h.value);
      const locked = toBool01(h.Locked ?? h.locked);
      const address = toStringSafe(h.Address ?? h.address);

      // If you have a real discriminator column later (Business/House), plug it here.
      const type = value > 0 && value < 200000 ? 'Business' : 'House';

      properties.push({
        id: houseId || toNumber(h.ID),
        name: `${type} #${houseId || toNumber(h.ID)}`,
        type,
        value,
        location: address || 'Unknown Location',
        imageUrl: type === 'House' ? 'https://picsum.photos/id/10/400/300' : 'https://picsum.photos/id/225/400/300',
        status: locked ? 'Locked' : 'Active',
        details: type === 'House' ? 'Property' : 'Business',
        storage: parseStorage(h, 'House')
      });
    }

    for (const v of vehicleRows) {
      const vehicleId = toNumber(v.ID ?? v.id);
      const model = toNumber(v.model ?? v.Model);
      const plate = toStringSafe(v.plate ?? v.Plate).trim();
      const locked = toBool01(v.locked ?? v.Locked);

      properties.push({
        id: vehicleId,
        name: VEHICLE_MODELS[model] ?? `Vehicle ${model || 'Unknown'}`,
        type: 'Vehicle',
        value: 0,
        location: 'Spawn Point',
        imageUrl: vehicleImageUrl(model),
        status: locked ? 'Locked' : 'Active',
        details: plate ? `Plate: ${plate}` : undefined,
        storage: parseStorage(v, 'Vehicle')
      });
    }

    return res.status(200).json({ properties });
  } catch (error) {
    console.error('Assets error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
