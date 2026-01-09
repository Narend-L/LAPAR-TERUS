import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Handler untuk MENGEDIT (UPDATE) Menu (PUT)
export async function PUT(request, { params }) {
  const menuId = params.id;
  try {
    const { nama_menu, harga } = await request.json();

    if (!nama_menu || !harga || isNaN(parseFloat(harga))) {
      return NextResponse.json({ error: 'Data menu tidak valid' }, { status: 400 });
    }

    return new Promise((resolve, reject) => {
      const query = 'UPDATE menus SET nama_menu = ?, harga = ? WHERE id = ?';
      db.run(query, [nama_menu, parseFloat(harga), menuId], function(err) {
        if (err) {
          console.error('Error updating menu:', err.message);
          return reject(NextResponse.json({ error: 'Gagal mengubah menu' }, { status: 500 }));
        }
        if (this.changes === 0) {
            return resolve(NextResponse.json({ message: 'Menu tidak ditemukan atau tidak ada perubahan' }, { status: 404 }));
        }
        resolve(NextResponse.json({ message: 'Menu berhasil diubah' }));
      });
    });
  } catch (error) {
    return NextResponse.json({ error: 'Permintaan tidak valid' }, { status: 400 });
  }
}

// Handler untuk MENGHAPUS (DELETE) Menu (DELETE)
export async function DELETE(request, { params }) {
  const menuId = params.id;
  
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM menus WHERE id = ?';
    db.run(query, [menuId], function(err) {
      if (err) {
        console.error('Error deleting menu:', err.message);
        return reject(NextResponse.json({ error: 'Gagal menghapus menu' }, { status: 500 }));
      }
      if (this.changes === 0) {
        return resolve(NextResponse.json({ message: 'Menu tidak ditemukan' }, { status: 404 }));
      }
      resolve(NextResponse.json({ message: 'Menu berhasil dihapus' }));
    });
  });
}