// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcrypt';
// Untuk session (sementara), kita akan menggunakan cookie
import { serialize } from 'cookie';

// Tentukan kunci rahasia untuk cookie Anda (harus ada di .env.local untuk keamanan)
const SECRET = process.env.AUTH_SECRET || 'fallback_secret_hanya_untuk_dev'; 

export async function POST(request) {
  try {
    const { password } = await request.json(); // Hanya butuh password dari admin

    if (!password) {
      return NextResponse.json({ message: 'Password harus diisi' }, { status: 400 });
    }

    return new Promise((resolve) => {
      // 1. Ambil data admin (username: 'admin')
      db.get("SELECT id, password_hash, role FROM users WHERE username = 'admin'", async (err, user) => {
        if (err || !user) {
          // Kesalahan database atau user tidak ditemukan
          return resolve(NextResponse.json({ message: 'Akses ditolak.' }, { status: 401 }));
        }

        // 2. Bandingkan password yang dimasukkan dengan hash di database
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (passwordMatch) {
          // 3. Jika password cocok, buat token/session (cookie)
          const token = JSON.stringify({ userId: user.id, role: user.role });
          
          const cookie = serialize('auth_token', token, {
            httpOnly: true, // Tidak bisa diakses oleh JavaScript di browser
            secure: process.env.NODE_ENV === 'production', // Hanya kirim via HTTPS di produksi
            maxAge: 60 * 60 * 24, // 1 hari
            path: '/',
          });

          // 4. Kirim response sukses dengan cookie session
          resolve(NextResponse.json({ message: 'Login Admin Berhasil', role: user.role }, {
            status: 200,
            headers: { 'Set-Cookie': cookie },
          }));
        } else {
          // Password salah
          resolve(NextResponse.json({ message: 'Password salah.' }, { status: 401 }));
        }
      });
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}