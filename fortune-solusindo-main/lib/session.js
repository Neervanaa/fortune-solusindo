import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'fortune_admin';
const secretKey = () => new TextEncoder().encode(process.env.SESSION_SECRET || 'dev-secret-change-me');

export async function createSession(username) {
  const token = await new SignJWT({ username, loggedIn: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function destroySession() {
  cookies().set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
}

export async function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload;
  } catch {
    return null;
  }
}

export async function isLoggedIn() {
  const session = await getSession();
  return Boolean(session?.loggedIn);
}

/** Throws a Response(401) if not authenticated — use inside API routes. */
export async function requireAuth() {
  const ok = await isLoggedIn();
  if (!ok) {
    throw new AuthError();
  }
}

export class AuthError extends Error {}
