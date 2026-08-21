import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { row } from '@/lib/db';
import { createSession, destroySession, isLoggedIn } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const action = request.nextUrl.searchParams.get('action');

  if (action === 'check') {
    return NextResponse.json({ loggedIn: await isLoggedIn() });
  }

  if (action === 'logout') {
    destroySession();
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function POST(request) {
  const action = request.nextUrl.searchParams.get('action');
  if (action !== 'login') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const username = (body.username || '').trim();
  const password = body.password || '';

  const user = await row('SELECT password FROM users WHERE username = ? LIMIT 1', [username]);

  if (user && (await bcrypt.compare(password, user.password))) {
    await createSession(username);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
}
