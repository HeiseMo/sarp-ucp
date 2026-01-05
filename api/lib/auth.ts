import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const COOKIE_NAME = 'sarp_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  if (!password) return false;
  if (!hash) return false;

  // Try SHA-512 (common for 128 hex chars)
  // Common SA:MP formats: SHA256(pass+salt), SHA512(pass+salt), Whirlpool(pass+salt)
  // We'll try SHA-512(password + salt) first.
  
  const tryHash = (algo: string, input: string) => {
    return crypto.createHash(algo).update(input).digest('hex').toUpperCase();
  };

  const safeSalt = salt ?? '';
  const normalizedHash = hash.toUpperCase();

  // Try SHA-512 (password + salt)
  const sha512PassSalt = tryHash('sha512', password + safeSalt);
  if (sha512PassSalt === normalizedHash) return true;

  // Try SHA-512 (salt + password)
  const sha512SaltPass = tryHash('sha512', safeSalt + password);
  if (sha512SaltPass === normalizedHash) return true;

  // If the hash length is 128, it's likely SHA-512 or Whirlpool.
  // If it's 64, it's SHA-256.
  // The provided hash is 128 chars.
  
  return false;
}

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: MAX_AGE });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export function setAuthCookie(res: any, token: string) {
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Secure in prod
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
  res.setHeader('Set-Cookie', cookie);
}

export function clearAuthCookie(res: any) {
  const cookie = serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: -1,
  });
  res.setHeader('Set-Cookie', cookie);
}

export function getAuthToken(req: any) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;
  
  // Simple cookie parsing
  const match = cookies.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
  if (match) return match[2];
  return null;
}
