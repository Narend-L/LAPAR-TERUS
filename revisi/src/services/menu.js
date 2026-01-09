// src/services/menuService.js
import db from '@/lib/db';

export const MenuService = {
  async getAllMenus() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM menus ORDER BY id DESC', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  },

  async addMenu(nama_menu, harga) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO menus (nama_menu, harga) VALUES (?, ?)';
      db.run(query, [nama_menu, harga], function(err) {
        if (err) reject(err);
        resolve(this.lastID);
      });
    });
  },

  async updateMenu(id, nama_menu, harga) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE menus SET nama_menu = ?, harga = ? WHERE id = ?';
      db.run(query, [nama_menu, harga, id], function(err) {
        if (err) reject(err);
        resolve(this.changes);
      });
    });
  },

  async deleteMenu(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM menus WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        resolve(this.changes);
      });
    });
  }
};