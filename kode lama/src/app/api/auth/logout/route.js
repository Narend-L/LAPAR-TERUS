// src/app/api/auth/logout/route.js

import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // Hapus cookie dengan mengatur maxAge menjadi 0 dan nilai kosong
  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // Mengatur usia maksimum menjadi 0 akan menghapus cookie
    path: '/',
  });

  return NextResponse.json({ message: 'Logout berhasil' }, {
    status: 200,
    headers: { 'Set-Cookie': cookie },
  });
}