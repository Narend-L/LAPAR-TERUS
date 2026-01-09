import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const { items, total, userId, nama_pemesan } = await request.json();

    if (!items || items.length === 0 || !total || !nama_pemesan) {
      return NextResponse.json({ error: 'Data pesanan tidak lengkap' }, { status: 400 });
    }

    return new Promise((resolve, reject) => {
      // 1. Simpan data ke tabel orders
      const orderQuery = 'INSERT INTO orders (user_id, nama_pemesan, total_harga, tanggal_pesan) VALUES (?, ?, ?, DATETIME(\'now\'))';
      
      db.run(orderQuery, [userId,nama_pemesan, total], function(err) {
        if (err) {
          console.error('Error saving order:', err.message);
          return reject(NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 }));
        }

        const orderId = this.lastID;
        
        // 2. Simpan setiap item ke tabel order_items
        const itemPromises = items.map(item => {
          const itemQuery = 'INSERT INTO order_items (order_id, menu_id, jumlah, harga_per_item) VALUES (?, ?, ?, ?)';
          return new Promise((res, rej) => {
            db.run(itemQuery, [orderId, item.menu_id, item.jumlah, item.harga_per_item], (err) => {
              if (err) {
                rej(err);
              } else {
                res();
              }
            });
          });
        });

        Promise.all(itemPromises)
          .then(() => {
            resolve(NextResponse.json({ message: 'Pesanan berhasil dicatat', order_id: orderId }, { status: 201 }));
          })
          .catch(itemErr => {
            console.error('Error saving order items:', itemErr.message);
            reject(NextResponse.json({ error: 'Pesanan dibuat tapi item gagal dicatat' }, { status: 500 }));
          });
      });
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Permintaan JSON tidak valid' }, { status: 400 });
  }
}