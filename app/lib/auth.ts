import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { UserSession } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Helper function to get secrets with proper typing
function getSecrets() {
  const jwtSecret = process.env.JWT_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  
  if (!jwtSecret || !refreshSecret) {
    throw new Error('JWT secrets are not defined in environment variables');
  }
  
  return { jwtSecret, refreshSecret };
}

export async function createToken(user: UserSession): Promise<string> {
  const { jwtSecret } = getSecrets();
  
  return jwt.sign(user, jwtSecret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
  });
}


export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { jwtSecret } = getSecrets();
    const decoded = jwt.verify(token, jwtSecret) as UserSession;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export async function setSession(user: UserSession): Promise<void> {
  const token = await createToken(user);
  const cookieStore = await cookies();
  
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

// Optional: Refresh token functions
export async function createRefreshToken(user: UserSession): Promise<string> {
  const { refreshSecret } = getSecrets();
  
  return jwt.sign(user, refreshSecret, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as jwt.SignOptions['expiresIn'],
  });
}

export async function verifyRefreshToken(token: string): Promise<UserSession | null> {
  try {
    const { refreshSecret } = getSecrets();
    const decoded = jwt.verify(token, refreshSecret) as UserSession;
    return decoded;
  } catch (error) {
    return null;
  }
}