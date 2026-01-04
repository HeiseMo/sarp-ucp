import { User, Property, LeaderboardEntry, Faction, Ticket, ServerLog, PlayerEntity, HouseEntity, VehicleEntity } from '../types';

// --- RAW DATABASE MOCKS (Simulating MySQL Rows) ---

const MOCK_PLAYER_ROW: PlayerEntity = {
  ID: 42,
  Name: "Tommy_Vercetti",
  Money: 15420,
  Bank: 1500000,
  Level: 15,
  AdminLvl: 4,
  DonateRank: 2,
  VIPExpDate: "2025-12-31",
  ConnectedTime: 20520, // 342 hours * 60
  Registered: "2023-05-12",
  Warnings: 1,
  Banned: 0,
  AdminJailed: 0,
  avatar_image_url: "https://picsum.photos/id/64/200/200",
  Member: 1, // Vercetti Estate ID
  Rank: 5
};

const MOCK_HOUSE_ROWS: HouseEntity[] = [
  { HouseID: 101, OwnerID: 42, Value: 2500000, Locked: 1, Address: "Mulholland Dr." },
  { HouseID: 205, OwnerID: 42, Value: 120000, Locked: 0, Address: "Downtown Los Santos (Biz)" } // Simulating a business via house table for now, or distinct
];

const MOCK_VEHICLE_ROWS: VehicleEntity[] = [
  { ID: 55, pID: 42, model: 411, plate: "VICE", locked: 1, insurance: 1 }, // Infernus
  { ID: 89, pID: 42, model: 560, plate: "GROVE", locked: 0, insurance: 0 } // Sultan
];

// --- ADAPTERS (Transform DB Rows to UI Types) ---

const transformPlayerToUser = (row: PlayerEntity): User => {
  let status: 'Active' | 'Banned' | 'Jailed' = 'Active';
  if (row.Banned) status = 'Banned';
  else if (row.AdminJailed) status = 'Jailed';

  return {
    id: row.ID,
    username: row.Name,
    level: row.Level,
    cash: row.Money,
    bank: row.Bank,
    hoursPlayed: Math.floor(row.ConnectedTime / 60),
    vipLevel: row.DonateRank,
    vipExpiration: row.VIPExpDate,
    adminLevel: row.AdminLvl,
    organization: row.Member > 0 ? "Vercetti Estate" : "Civilian", // In real app, we'd lookup faction name by ID
    avatarUrl: row.avatar_image_url,
    joinedDate: row.Registered,
    warnings: row.Warnings,
    status: status
  };
};

const transformAssetsToProperties = (houses: HouseEntity[], vehicles: VehicleEntity[]): Property[] => {
  const props: Property[] = [];

  // Map Houses
  houses.forEach(h => {
    // Basic logic to determine if it's a "Business" or "House" based on value/id (mock logic)
    // In real DB, you'd check a specific type column or table
    const type = h.Value < 200000 ? 'Business' : 'House'; 
    props.push({
      id: h.HouseID,
      name: type === 'House' ? `House #${h.HouseID}` : `Business #${h.HouseID}`,
      type: type,
      value: h.Value,
      location: h.Address || "Unknown Location",
      imageUrl: type === 'House' ? "https://picsum.photos/id/10/400/300" : "https://picsum.photos/id/225/400/300",
      status: h.Locked ? 'Locked' : 'Active',
      details: type === 'House' ? 'Interior: Custom' : 'Daily Earnings: $5,000'
    });
  });

  // Map Vehicles
  const vehicleNames: Record<number, string> = { 411: "Infernus", 560: "Sultan", 451: "Turismo" }; // Simple ID map
  
  vehicles.forEach(v => {
    props.push({
      id: v.ID,
      name: vehicleNames[v.model] || "Unknown Vehicle",
      type: 'Vehicle',
      value: 0, // Vehicles might not have value in playervehicles table, might need lookup
      location: "Spawn Point", // Requires join with position or last parked
      imageUrl: "https://picsum.photos/id/111/400/300",
      status: v.locked ? 'Locked' : 'Active',
      details: `Plate: ${v.plate}`
    });
  });

  return props;
};

// --- EXPORTS ---

export const MOCK_USER: User = transformPlayerToUser(MOCK_PLAYER_ROW);
export const MOCK_PROPERTIES: Property[] = transformAssetsToProperties(MOCK_HOUSE_ROWS, MOCK_VEHICLE_ROWS);

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: "Big_Smoke", stat: "$99,999,999", avatarUrl: "https://picsum.photos/id/1012/100/100", trend: "same" },
  { rank: 2, username: "CJ_Johnson", stat: "$82,420,000", avatarUrl: "https://picsum.photos/id/1025/100/100", trend: "up" },
  { rank: 3, username: "Ryder_Wilson", stat: "$40,100,000", avatarUrl: "https://picsum.photos/id/177/100/100", trend: "down" },
  { rank: 4, username: "Cesar_Vialpando", stat: "$35,500,500", avatarUrl: "https://picsum.photos/id/237/100/100", trend: "up" },
  { rank: 5, username: "Officer_Tenpenny", stat: "$20,000,000", avatarUrl: "https://picsum.photos/id/338/100/100", trend: "down" },
];

export const MOCK_FACTION: Faction = {
  id: 1,
  name: "Vercetti Estate",
  tag: "V.E.",
  type: "Criminal",
  leader: "Tommy_Vercetti",
  balance: 12500000,
  messageOfTheDay: "Ensure all territory collections are completed by Friday. Avoid heat near Ocean Beach.",
  announcements: [
    { id: 1, title: "Territory Expansion", date: "2025-05-10", content: "We are moving into the docks. Be prepared for resistance." },
    { id: 2, title: "New Vehicle Fleet", date: "2025-05-01", content: "Added 4 new Admirals to the faction garage." }
  ],
  members: [
    { id: 42, name: "Tommy_Vercetti", rank: "Boss", rankId: 5, lastActive: "Now", isOnline: true, avatarUrl: "https://picsum.photos/id/64/100/100" },
    { id: 88, name: "Lance_Vance", rank: "Underboss", rankId: 4, lastActive: "Now", isOnline: true, avatarUrl: "https://picsum.photos/id/91/100/100" },
    { id: 102, name: "Ken_Rosenberg", rank: "Consigliere", rankId: 3, lastActive: "2h ago", isOnline: false, avatarUrl: "https://picsum.photos/id/55/100/100" },
    { id: 304, name: "Ricardo_Diaz", rank: "Associate", rankId: 1, lastActive: "1d ago", isOnline: false, avatarUrl: "https://picsum.photos/id/33/100/100" },
    { id: 405, name: "Sonny_Forelli", rank: "Captain", rankId: 3, lastActive: "5m ago", isOnline: true, avatarUrl: "https://picsum.photos/id/1/100/100" },
  ]
};

export const MOCK_TICKETS: Ticket[] = [
  { id: 1024, type: "Complaint", target: "Officer_Tenpenny", title: "DM without reason at Market", status: "Under Review", createdAt: "2025-05-14", lastUpdate: "Today" },
  { id: 992, type: "Faction Application", target: "LSPD", title: "Transfer Request", status: "Denied", createdAt: "2025-04-20", lastUpdate: "2025-04-22" },
  { id: 1105, type: "Ban Appeal", title: "Unfair ban for speedhacks (lag)", status: "Pending", createdAt: "2025-05-15", lastUpdate: "Just now" }
];

export const MOCK_SERVER_LOGS: ServerLog[] = [
  { id: 1, timestamp: "10:42 AM", action: "BAN", admin: "Admin_Bot", target: "Cheater_123", details: "Speedhack detected (Auto-Ban)" },
  { id: 2, timestamp: "10:30 AM", action: "KICK", admin: "Mod_Sarah", target: "Toxic_Guy", details: "Harassment in global chat" },
  { id: 3, timestamp: "09:15 AM", action: "EDIT", admin: "Lead_Admin", target: "House_402", details: "Set price to $500,000" },
  { id: 4, timestamp: "08:55 AM", action: "WARN", admin: "Helper_John", target: "New_Player_01", details: "Refusing RP instructions" },
  { id: 5, timestamp: "08:30 AM", action: "SYSTEM", admin: "Server", target: "All", details: "Server restart initiated" },
];

export const MOCK_ALL_PLAYERS: User[] = [
  MOCK_USER,
  transformPlayerToUser({ ...MOCK_PLAYER_ROW, ID: 101, Name: "Officer_Tenpenny", Money: 200, Bank: 50000, Level: 50, ConnectedTime: 72000, avatar_image_url: "https://picsum.photos/id/338/100/100", Member: 2, Rank: 10 } as PlayerEntity),
  transformPlayerToUser({ ...MOCK_PLAYER_ROW, ID: 305, Name: "Random_Civilian", Money: 500, Bank: 2000, Level: 2, ConnectedTime: 600, avatar_image_url: "https://picsum.photos/id/40/100/100", Member: 0, Rank: 0 } as PlayerEntity),
];
