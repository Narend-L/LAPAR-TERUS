// src/services/laporanService.js
import db from '@/lib/db';

export const LaporanService = {

  async getPendingOrders() {
    const query = `
      SELECT
          o.id AS order_id, o.nama_pemesan, o.total_harga, o.tanggal_pesan, o.status,
          oi.jumlah, oi.harga_per_item,
          (SELECT nama_menu FROM menus WHERE id = oi.menu_id) AS nama_menu
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.status = 'pending'
      ORDER BY o.tanggal_pesan DESC;
    `;

    return new Promise((resolve, reject) => {
      db.all(query, (err, rows) => {
        if (err) return reject(err);

        const groupedOrders = rows.reduce((acc, row) => {
          const { order_id, nama_pemesan, total_harga, tanggal_pesan, status, ...item } = row;
          if (!acc[order_id]) {
            acc[order_id] = { order_id, nama_pemesan, total_harga, tanggal_pesan, status, items: [] };
          }
          acc[order_id].items.push(item);
          return acc;
        }, {});

        resolve(Object.values(groupedOrders));
      });
    });
  },

  async updateStatusToDone(orderId, status) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE orders SET status = ? WHERE id = ?';
      db.run(query, [status, orderId], function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  },

  async clearDoneOrders() {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM orders WHERE status = 'done'";
      db.run(query, function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }
};