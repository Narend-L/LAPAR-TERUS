'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function KelolaMenuPage() {
  const [menus, setMenus] = useState([]);
  const [namaMenu, setNamaMenu] = useState('');
  const [harga, setHarga] = useState('');
  const [editingMenu, setEditingMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadMenus = useCallback (async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/menus'); 
      if (response.status === 401) {
        alert("Akses ditolak");
        return router.push('/login');
      }
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => { loadMenus(); }, [loadMenus]);

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

      if (response.status === 401) {
        alert("Akses ditolak");
        return router.push('/login');
      }

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      alert(result.message);
      setNamaMenu(''); setHarga(''); setEditingMenu(null);
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

  const handleDelete = async (menuId) => {
    if (!confirm('Yakin ingin menghapus menu ini?')) return;
    try {
      const response = await fetch(`/api/menus/${menuId}`, { method: 'DELETE' });
      if (response.status === 401) {
        alert("Akses ditolak");
        return router.push('/login');
      }
      if (!response.ok) throw new Error("Gagal hapus");
      loadMenus();
    } catch (error) {
      alert(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => router.back()} 
          className="mb-8 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          ← Kembali
        </button>

        <h1 className="text-3xl font-extrabold text-slate-800 mb-8 border-l-8 border-blue-500 pl-4">
          {editingMenu ? 'Ubah Menu' : 'Tambah Menu Baru'}
        </h1>

        {/* FORM CARD */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-lg max-w-2xl mb-12">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nama Menu</label>
              <input
                type="text"
                placeholder="Contoh: Nasi Goreng Spesial"
                value={namaMenu}
                onChange={(e) => setNamaMenu(e.target.value)}
                required
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Harga (Rp)</label>
              <input
                type="number"
                placeholder="Contoh: 15000"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                required
                className="w-full p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all font-mono"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                className={`flex-1 py-3 rounded-xl font-bold text-white shadow-md transition-all ${
                  editingMenu ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {editingMenu ? 'Simpan Perubahan' : 'Tambah Menu'}
              </button>

              {editingMenu && (
                <button 
                  type="button" 
                  onClick={() => { setEditingMenu(null); setNamaMenu(''); setHarga(''); }} 
                  className="px-6 py-3 bg-slate-400 hover:bg-slate-500 text-white rounded-xl font-bold transition-all shadow-md"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          📋 Daftar Menu Saat Ini
        </h2>

        {/* TABLE CONTAINER */}
        <div className="overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 uppercase text-xs tracking-wider">
                <th className="p-4 text-left font-bold">ID</th>
                <th className="p-4 text-left font-bold">Nama Menu</th>
                <th className="p-4 text-left font-bold">Harga</th>
                <th className="p-4 text-center font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {menus.map((menu) => (
                <tr key={menu.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-500 font-mono text-sm">#{menu.id}</td>
                  <td className="p-4 font-semibold text-slate-800">{menu.nama_menu}</td>
                  <td className="p-4 text-blue-600 font-bold font-mono">
                    Rp {menu.harga.toLocaleString('id-ID')}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => startEdit(menu)}
                        className="bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(menu.id)}
                        className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {menus.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-400 italic font-medium">
                    Belum ada menu yang ditambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}