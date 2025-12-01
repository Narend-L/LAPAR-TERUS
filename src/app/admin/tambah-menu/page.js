'use client';

import { useState, useEffect } from 'react';
import { fetchMenus } from '@/lib/utils'; // Impor fetchMenus dari file utils

export default function KelolaMenuPage() {
  const [menus, setMenus] = useState([]);
  const [namaMenu, setNamaMenu] = useState('');
  const [harga, setHarga] = useState('');
  const [editingMenu, setEditingMenu] = useState(null); // State untuk menu yang sedang diedit
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fungsi untuk mengambil data menu
  const loadMenus = async () => {
    setIsLoading(true);
    const data = await fetchMenus();
    setMenus(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMenus();
  }, []);

  // 2. Fungsi untuk Menambah/Mengubah Menu
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingMenu ? `/api/menus/${editingMenu.id}` : '/api/menus/add';
    const method = editingMenu ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_menu: namaMenu, harga: parseFloat(harga) }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Gagal ${editingMenu ? 'mengubah' : 'menambah'} menu`);
      }

      alert(result.message);
      // Reset state dan muat ulang menu
      setNamaMenu('');
      setHarga('');
      setEditingMenu(null);
      loadMenus();

    } catch (error) {
      alert(error.message);
    }
  };
  
  // 3. Fungsi untuk Menghapus Menu
  const handleDelete = async (menuId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus menu ini?')) return;
    
    try {
      const response = await fetch(`/api/menus/${menuId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menghapus menu');
      }

      alert(result.message);
      loadMenus(); // Muat ulang daftar menu
    } catch (error) {
      alert(error.message);
    }
  };

  // 4. Fungsi untuk Memulai Edit
  const startEdit = (menu) => {
    setEditingMenu(menu);
    setNamaMenu(menu.nama_menu);
    setHarga(menu.harga);
  };

  // Tampilan Loading
  if (isLoading) return <div style={{ padding: '20px' }}>Memuat daftar menu...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{editingMenu ? 'Ubah Menu' : 'Tambah Menu Baru'}</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', maxWidth: '500px' }}>
        <input type="text" placeholder="Nama Menu" value={namaMenu} onChange={(e) => setNamaMenu(e.target.value)} required style={{ marginRight: '10px', padding: '8px' }} />
        <input type="number" placeholder="Harga" value={harga} onChange={(e) => setHarga(e.target.value)} required style={{ marginRight: '10px', padding: '8px' }} />
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: editingMenu ? 'orange' : 'blue', color: 'white', border: 'none' }}>
          {editingMenu ? 'Simpan Perubahan' : 'Tambah Menu'}
        </button>
        {editingMenu && (
          <button type="button" onClick={() => { setEditingMenu(null); setNamaMenu(''); setHarga(''); }} style={{ marginLeft: '10px', padding: '8px 15px', backgroundColor: 'gray', color: 'white', border: 'none' }}>
            Batal
          </button>
        )}
      </form>

      <h2>Daftar Menu Saat Ini</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nama Menu</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Harga</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{menu.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{menu.nama_menu}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Rp {menu.harga}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button onClick={() => startEdit(menu)} style={{ backgroundColor: 'orange', color: 'white', marginRight: '5px' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(menu.id)} style={{ backgroundColor: 'red', color: 'white' }}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}