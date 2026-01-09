'use client';

import { useState, useEffect } from 'react';
import { fetchMenus } from '@/lib/utils'; 

export default function KelolaMenuPage() {
  const [menus, setMenus] = useState([]);
  const [namaMenu, setNamaMenu] = useState('');
  const [harga, setHarga] = useState('');
  const [editingMenu, setEditingMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadMenus = async () => {
    setIsLoading(true);
    const data = await fetchMenus();
    setMenus(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingMenu ? `/api/menus/${editingMenu.id}` : '/api/menus/add';
    const method = editingMenu ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_menu: namaMenu, harga: parseFloat(harga) }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Gagal menyimpan menu');

      alert(result.message);
      setNamaMenu('');
      setHarga('');
      setEditingMenu(null);
      loadMenus();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (menuId) => {
    if (!confirm('Yakin ingin menghapus menu ini?')) return;

    try {
      const response = await fetch(`/api/menus/${menuId}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Gagal menghapus menu');

      alert(result.message);
      loadMenus();
    } catch (error) {
      alert(error.message);
    }
  };

  const startEdit = (menu) => {
    setEditingMenu(menu);
    setNamaMenu(menu.nama_menu);
    setHarga(menu.harga);
  };

  if (isLoading)
    return <div style={{ padding: '20px', fontSize: '18px' }}>Memuat daftar menu...</div>;

  // -------------------------------------------
  // STYLE TEMA SAMA DENGAN DASHBOARD UTAMA
  // -------------------------------------------
  const pageStyle = {
    minHeight: '100vh',
    padding: '30px',
    background: 'linear-gradient(to bottom right, #e6f1ff, #f7fbff)',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#2c3e50',
  };

  const sectionCard = {
    backgroundColor: 'white',
    border: '1px solid #d4e1f7',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
    maxWidth: '600px',
    marginBottom: '30px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
  };

  const thStyle = {
    backgroundColor: '#e9f1ff',
    border: '1px solid #cdd9f2',
    padding: '10px',
    fontWeight: 'bold',
    textAlign: 'left'
  };

  const tdStyle = {
    border: '1px solid #e1e7f5',
    padding: '10px'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    borderRadius: '8px',
    border: '1px solid #cdd9f2',
    outline: 'none'
  };

  const buttonPrimary = {
    padding: '10px 18px',
    backgroundColor: '#76A9FA',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 3px 8px rgba(0,0,0,0.1)'
  };

  const buttonEdit = {
    padding: '7px 12px',
    backgroundColor: '#ffb74d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '6px'
  };

  const buttonDelete = {
    padding: '7px 12px',
    backgroundColor: '#e57373',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  };

  const buttonCancel = {
    padding: '10px 18px',
    backgroundColor: 'gray',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginLeft: '10px'
  };

  return (
    <div style={pageStyle}>
      <button onClick={() => history.back()} style={{ backgroundColor: '#000', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}> Kembali</button>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>
        {editingMenu ? '✏️ Ubah Menu' : '➕ Tambah Menu Baru'}
      </h1>

      {/* FORM CARD */}
      <div style={sectionCard}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nama Menu"
            value={namaMenu}
            onChange={(e) => setNamaMenu(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Harga"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonPrimary}>
            {editingMenu ? 'Simpan Perubahan' : 'Tambah Menu'}
          </button>

          {editingMenu && (
            <button type="button" onClick={() => { setEditingMenu(null); setNamaMenu(''); setHarga(''); }} style={buttonCancel}>
              Batal
            </button>
          )}
        </form>
      </div>

      <h2 style={{ marginBottom: '15px' }}>📋 Daftar Menu Saat Ini</h2>

      {/* TABLE */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Nama Menu</th>
            <th style={thStyle}>Harga</th>
            <th style={thStyle}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu.id}>
              <td style={tdStyle}>{menu.id}</td>
              <td style={tdStyle}>{menu.nama_menu}</td>
              <td style={tdStyle}>Rp {menu.harga}</td>
              <td style={tdStyle}>
                <button style={buttonEdit} onClick={() => startEdit(menu)}>Edit</button>
                <button style={buttonDelete} onClick={() => handleDelete(menu.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
