// src/app/api/laporan/route.js

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const query = `
    SELECT
        o.id AS order_id,
        o.nama_pemesan,
        o.total_harga,
        o.tanggal_pesan,
        o.status,
        oi.jumlah,
        oi.harga_per_item,
        (SELECT nama_menu FROM menus WHERE id = oi.menu_id) AS nama_menu
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.status = 'pending'
    ORDER BY o.tanggal_pesan DESC;
  `;

  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        console.error('Error fetching report:', err.message);
        return reject(NextResponse.json({ error: 'Gagal mengambil data laporan' }, { status: 500 }));
      }
      
      const groupedOrders = rows.reduce((acc, row) => {
          const { order_id, nama_pemesan, total_harga, tanggal_pesan, ...item } = row;
          
          if (!acc[order_id]) {
              acc[order_id] = { order_id, nama_pemesan, total_harga, tanggal_pesan, items: [] };
          }
          
          acc[order_id].items.push(item);
          return acc;
      }, {});

      const reportData = Object.values(groupedOrders);
      
      resolve(NextResponse.json(reportData));
    });
  });
}

export async function PUT(request) {
  try {
    const { order_id, new_status } = await request.json();

    if (!order_id || new_status !== 'done') {
      return NextResponse.json({ error: 'Status update tidak valid' }, { status: 400 });
    }

    return new Promise((resolve, reject) => {
      const query = 'UPDATE orders SET status = ? WHERE id = ?';
      db.run(query, [new_status, order_id], function(err) {
        if (err) {
          console.error('Error updating status:', err.message);
          return reject(NextResponse.json({ error: 'Gagal mengubah status' }, { status: 500 }));
        }
        if (this.changes === 0) {
            return resolve(NextResponse.json({ message: 'Pesanan tidak ditemukan' }, { status: 404 }));
        }
        resolve(NextResponse.json({ message: `Status pesanan #${order_id} berhasil diubah menjadi Selesai` }));
      });
    });
  } catch (error) {
    return NextResponse.json({ error: 'Permintaan tidak valid' }, { status: 400 });
  }
}

export async function DELETE() {
  return new Promise((resolve, reject) => {
    const queryOrders = 'DELETE FROM orders WHERE status = \'done\'';
    
    db.run(queryOrders, function(err) {
      if (err) {
        console.error('Error clearing orders:', err.message);
        return reject(NextResponse.json({ error: 'Gagal menghapus pesanan yang sudah selesai' }, { status: 500 }));
      }
      
      const deletedCount = this.changes;

      resolve(NextResponse.json({ message: `${deletedCount} pesanan selesai telah dihapus.` }));
    });
  });
}