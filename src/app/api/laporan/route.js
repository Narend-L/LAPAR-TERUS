// src/app/api/laporan/route.js

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  // Query SQL untuk mengambil data dari tabel orders dan order_items
  const query = `
    SELECT
        o.id AS order_id,
        o.nama_pemesan,
        o.total_harga,
        o.tanggal_pesan,
        -- Mengambil detail item
        oi.jumlah,
        oi.harga_per_item,
        -- Mengambil nama menu dari tabel menus
        (SELECT nama_menu FROM menus WHERE id = oi.menu_id) AS nama_menu
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    ORDER BY o.tanggal_pesan DESC;
  `;

  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        console.error('Error fetching report:', err.message);
        return reject(NextResponse.json({ error: 'Gagal mengambil data laporan' }, { status: 500 }));
      }
      
      // Mengelompokkan baris data menjadi satu objek pesanan (Order)
      const groupedOrders = rows.reduce((acc, row) => {
          // Destrukturisasi data order dan detail item
          const { order_id, nama_pemesan, total_harga, tanggal_pesan, ...item } = row;
          
          if (!acc[order_id]) {
              // Jika order_id baru, inisialisasi objek order
              acc[order_id] = { order_id, nama_pemesan, total_harga, tanggal_pesan, items: [] };
          }
          
          // Tambahkan item ke array items dalam objek order yang sesuai
          acc[order_id].items.push(item);
          return acc;
      }, {});

      // Mengubah objek (groupedOrders) kembali menjadi array (reportData)
      const reportData = Object.values(groupedOrders);
      
      resolve(NextResponse.json(reportData));
    });
  });
}