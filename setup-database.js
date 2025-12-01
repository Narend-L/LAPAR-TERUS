const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const adminPassword = 'admin123'; 

const DB_PATH = './database/kantin.db';

// Fungsi untuk menjalankan skrip setup database
async function setupDatabase() {
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Koneksi Gagal:', err.message);
            process.exit(1); // Keluar jika koneksi gagal
        }
        console.log('Connected to the SQLite database.');
    });

    // Gunakan promise untuk membuat tabel
    const createTables = () => new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    role TEXT NOT NULL
                );
            `);
            db.run(`
                CREATE TABLE IF NOT EXISTS menus (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nama_menu TEXT NOT NULL,
                    harga REAL NOT NULL
                );
            `);
            db.run(`
                CREATE TABLE IF NOT EXISTS orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    nama_pemesan TEXT NOT NULL,
                    total_harga REAL NOT NULL,
                    tanggal_pesan TEXT NOT NULL
                );
            `);
            db.run(`
                CREATE TABLE IF NOT EXISTS order_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_id INTEGER,
                    menu_id INTEGER,
                    jumlah INTEGER NOT NULL,
                    harga_per_item REAL NOT NULL,
                    FOREIGN KEY (order_id) REFERENCES orders(id),
                    FOREIGN KEY (menu_id) REFERENCES menus(id)
                );
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });

    // Gunakan promise untuk membuat akun admin
    const createAdmin = () => new Promise((resolve, reject) => {
        bcrypt.hash(adminPassword, saltRounds, (err, hash) => {
            if (err) return reject(err);

            db.get("SELECT id FROM users WHERE role = 'admin'", (err, row) => {
                if (err) return reject(err);

                if (!row) {
                    db.run(`INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)`,
                        ['admin', hash, 'admin'],
                        function(insertErr) {
                            if (insertErr) return reject(insertErr);
                            console.log('Akun Admin Awal berhasil dibuat.');
                            resolve();
                        }
                    );
                } else {
                    console.log('Akun Admin sudah ada.');
                    resolve();
                }
            });
        });
    });

    try {
        await createTables();
        console.log('Database tables created or already exist.');

        await createAdmin();

    } catch (error) {
        console.error('FATAL ERROR DURING SETUP:', error.message);
    } finally {
        // Tutup koneksi hanya setelah semua operasi selesai
        db.close((err) => {
            if (err) return console.error(err.message);
            console.log('Database connection closed.');
        });
    }
}

setupDatabase();