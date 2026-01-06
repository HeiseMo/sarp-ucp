export const WEAPON_NAMES: Record<number, string> = {
  0: "Fist",
  1: "Brass Knuckles",
  2: "Golf Club",
  3: "Nightstick",
  4: "Knife",
  5: "Bat",
  6: "Shovel",
  7: "Pool Cue",
  8: "Katana",
  9: "Chainsaw",
  10: "Dildo",
  14: "Flowers",
  15: "Cane",
  16: "Grenade",
  17: "Tear Gas",
  18: "Molotov",
  22: "Colt 45",
  23: "Silenced Pistol",
  24: "Desert Eagle",
  25: "Shotgun",
  26: "Sawn-off Shotgun",
  27: "Combat Shotgun",
  28: "Micro SMG",
  29: "MP5",
  30: "AK-47",
  31: "M4",
  32: "Tec-9",
  33: "Country Rifle",
  34: "Sniper Rifle",
  35: "RPG",
  36: "HS Rocket",
  37: "Flamethrower",
  38: "Minigun",
  39: "Satchel Charge",
  40: "Detonator",
  41: "Spraycan",
  42: "Fire Extinguisher",
  43: "Camera",
  46: "Parachute",
};

// Common LEO Faction IDs in SA:MP (LSPD, FBI, NG/Army, SFPD, LVPD)
// This is a guess based on standard GF/NGRP bases.
export const LEO_FACTION_IDS = [1, 2, 3, 596, 597, 598]; // Added vehicle model IDs just in case, but usually 1,2,3

export function getWeaponName(id: number): string {
  return WEAPON_NAMES[id] || `Weapon ${id}`;
}

export function mapCharacterProfile(row: any) {
  // Helper to get value case-insensitively if needed
  const getVal = (key: string) => {
    if (row[key] !== undefined) return row[key];
    const lowerKey = key.toLowerCase();
    const foundKey = Object.keys(row).find(k => k.toLowerCase() === lowerKey);
    return foundKey ? row[foundKey] : undefined;
  };

  const toNumber = (v: any) => Number(v) || 0;
  const toBool = (key: string) => toNumber(getVal(key)) > 0;

  // 1. Licenses
  const licenses = [
    { name: "Driving", active: toBool("CarLic") || toBool("NewCarLic") },
    { name: "Flying", active: toBool("FlyLic") || toBool("NewFlyLic") },
    { name: "Boating", active: toBool("BoatLic") || toBool("NewBoatLic") },
    { name: "Weapon", active: toBool("GunLic") || toBool("NewGunLic") },
    { name: "Trucking", active: toBool("TruckLicense") },
    { name: "Fishing", active: toBool("FishLic") },
  ].filter(l => l.active);

  // 2. Inventory (Drugs, Materials, etc.)
  const inventoryItems: any[] = [];
  const drugItems: any[] = [];

  // Helper to add if > 0
  const addIfPos = (list: any[], id: string, name: string, key: string) => {
    const amount = toNumber(getVal(key));
    if (amount > 0) list.push({ id, name, amount });
  };

  // Drugs
  addIfPos(drugItems, 'cannabis', 'Cannabis', 'Cannabis');
  addIfPos(drugItems, 'cocaine', 'Cocaine', 'Cocaine');
  addIfPos(drugItems, 'meth', 'Meth', 'Meth');
  addIfPos(drugItems, 'pot', 'Pot', 'Pot');
  addIfPos(drugItems, 'crack', 'Crack', 'Crack');
  addIfPos(drugItems, 'xanax', 'Xanax', 'Xanax');
  addIfPos(drugItems, 'painkillers', 'Painkillers', 'PainKillers');

  // Materials / Resources
  addIfPos(inventoryItems, 'materials', 'Materials', 'Materials');
  addIfPos(inventoryItems, 'products', 'Products', 'Products');
  addIfPos(inventoryItems, 'seeds', 'Seeds', 'Seeds');
  
  // Misc
  if (toBool("Radio")) addIfPos(inventoryItems, 'radio', 'Portable Radio', 'Radio'); // amount 1 logic handled by addIfPos if passed val, wait. 
  // Refactoring usage:
  // Previous: if (toBool(row.Radio)) addIfPos(inventoryItems, 'radio', 'Portable Radio', 1);
  // I need to adjust check.
  
  if (toBool("Radio")) inventoryItems.push({ id: 'radio', name: 'Portable Radio', amount: 1 });
  if (toBool("Phonebook")) inventoryItems.push({ id: 'phonebook', name: 'Phonebook', amount: 1 });
  if (toBool("Dice")) inventoryItems.push({ id: 'dice', name: 'Dice', amount: 1 });

  // 3. Weapons
  // We scan Gun0..Gun12 and look for corresponding Ammo (try Ammo0..Ammo12 or just name+1 if not found)
  // Based on user prompt "Gun0, Gun1..." and subagent saying "Ammo1...Ammo12".
  // Note: Standard array indices usually match.
  const weapons: any[] = [];
  
  for (let i = 0; i <= 12; i++) {
    // Try different casing or naming conventions found in SA:MP
    const gunId = toNumber(getVal(`Gun${i}`) ?? getVal(`gun${i}`));
    
    // Skip if no gun or Fist (0)
    if (gunId > 0) {
      // Find ammo. Try `Ammo${i}`.
      const ammo = toNumber(getVal(`Ammo${i}`) ?? getVal(`ammo${i}`) ?? getVal(`Gun${i}Ammo`));
      
      weapons.push({
        id: gunId,
        name: getWeaponName(gunId),
        ammo: ammo
      });
    }
  }

  // 4. Badge / Police
  let badge = undefined;
  const memberId = toNumber(getVal("Member"));
  const badgeNum = toNumber(getVal("BadgeNumber"));
  const hasBadge = toBool("Badge") || badgeNum > 0;
  
  // Logic: Show badge if they have one OR are in LEO faction
  if (hasBadge || LEO_FACTION_IDS.includes(memberId)) {
    badge = {
      active: true,
      number: badgeNum,
      department: memberId === 1 ? 'LSPD' : (memberId === 2 ? 'FBI' : (memberId === 3 ? 'National Guard' : 'Law Enforcement')), 
      rank: getVal("Rank") ? `Rank ${getVal("Rank")}` : undefined,
      division: getVal("Division") ? `Div ${getVal("Division")}` : undefined
    };
  }

  return {
    licenses,
    inventory: inventoryItems,
    weapons,
    drugs: drugItems,
    badge
  };
}
