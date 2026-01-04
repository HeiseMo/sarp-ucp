// --- UI TYPES (Used by React Components) ---

export interface User {
  id: number;
  username: string;
  level: number;
  cash: number;
  bank: number;
  hoursPlayed: number; // Derived from ConnectedTime / 60
  vipLevel: number;    // Derived from DonateRank
  vipExpiration?: string; // Derived from VIPExpDate
  adminLevel: number;  // Derived from AdminLvl
  organization: string;
  avatarUrl?: string;
  joinedDate: string;
  warnings: number;
  status: 'Active' | 'Banned' | 'Jailed';
}

export interface Property {
  id: number;
  name: string;
  type: 'House' | 'Business' | 'Vehicle';
  value: number;
  location: string;
  imageUrl: string;
  status: 'Active' | 'Locked' | 'Impounded' | 'For Sale';
  details?: string; // e.g., Plate for cars, Interior ID for houses
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  stat: string | number;
  avatarUrl?: string;
  trend?: 'up' | 'down' | 'same';
}

export interface FactionMember {
  id: number;
  name: string;
  rank: string;
  rankId: number;
  lastActive: string;
  isOnline: boolean;
  avatarUrl: string;
}

export interface Faction {
  id: number;
  name: string;
  tag: string;
  type: 'Law Enforcement' | 'Criminal' | 'Medical' | 'Civilian';
  leader: string;
  balance: number;
  messageOfTheDay: string;
  members: FactionMember[];
  announcements: { id: number; title: string; date: string; content: string }[];
}

export interface Ticket {
  id: number;
  type: 'Complaint' | 'Ban Appeal' | 'Faction Application' | 'General Support';
  target?: string; // e.g. Reported Player Name or Faction Name
  title: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Denied';
  createdAt: string;
  lastUpdate: string;
}

export interface ServerLog {
  id: number;
  timestamp: string;
  action: 'BAN' | 'KICK' | 'WARN' | 'EDIT' | 'SYSTEM';
  admin: string;
  target: string;
  details: string;
}

export enum ViewState {
  LOGIN,
  DASHBOARD,
  LEADERBOARD,
  PROPERTIES,
  FACTION,
  COMMUNITY,
  SETTINGS,
  ADMIN
}

// --- RAW DATABASE INTERFACES (Matches DB-Documentation.txt) ---

export interface PlayerEntity {
  ID: number;
  Name: string;
  Money: number;
  Bank: number;
  Level: number;
  AdminLvl: number;
  DonateRank: number;
  VIPExpDate: string; // Date string
  ConnectedTime: number; // Minutes
  Registered: string; // Date
  Warnings: number;
  Banned: number; // 0 or 1
  AdminJailed: number; // 0 or 1
  avatar_image_url: string;
  // Faction/Group fields
  Member: number;
  Rank: number;
  // Add other fields from doc as needed
}

export interface HouseEntity {
  HouseID: number;
  OwnerID: number;
  Value: number;
  Locked: number; // 0 or 1
  Address?: string; // Derived or if exists in DB
}

export interface VehicleEntity {
  ID: number;
  pID: number;
  model: number;
  plate: string;
  locked: number; // 0 or 1
  insurance: number; // 0 or 1
}
