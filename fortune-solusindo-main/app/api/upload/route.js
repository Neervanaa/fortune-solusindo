import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isLoggedIn } from '@/lib/session';

export const dynamic = 'force-dynamic';

const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('image');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Tidak ada file yang diupload' }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Ukuran file maksimal 5MB' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `upload-${Date.now()}-${Math.random().toString(16).slice(2, 10)}.${ext}`;

  try {
    const blob = await put(`images/${filename}`, file, {
      access: 'public',
      addRandomSuffix: false,
    });
    return NextResponse.json({ success: true, path: blob.url });
  } catch (e) {
    return NextResponse.json({ error: 'Gagal menyimpan file' }, { status: 500 });
  }
}
