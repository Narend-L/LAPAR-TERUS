import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const { nama_menu, harga } = await request.json();

    if (!nama_menu || !harga) {
      return NextResponse.json({ error: 'Nama menu dan harga harus diisi' }, { status: 400 });
    }

    return new Promise((resolve, reject) => {
      // Jalankan query untuk memasukkan data ke tabel menus
      const query = 'INSERT INTO menus (nama_menu, harga) VALUES (?, ?)';
      db.run(query, [nama_menu, harga], function(err) {
        if (err) {
          console.error(err.message);
          return reject(NextResponse.json({ error: 'Gagal menambahkan menu' }, { status: 500 }));
        }
        // Kirim response sukses dengan ID menu yang baru dibuat
        resolve(NextResponse.json({ message: 'Menu berhasil ditambahkan', id: this.lastID }, { status: 201 }));
      });
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Permintaan tidak valid' }, { status: 400 });
  }
}