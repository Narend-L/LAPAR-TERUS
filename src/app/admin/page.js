// src/app/admin/page.js

'use client';

import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      alert('Anda telah logout.');
      router.push('/login'); // Arahkan kembali ke halaman login
    } catch (error) {
      alert('Gagal logout.');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1>Dashboard Admin</h1>
      <p>Selamat datang, Admin! Anda berhasil login.</p>
      <ul>
        <li><a href="/admin/tambah-menu">Input Menu</a></li>
        <li><a href="/admin/laporan">Lihat Laporan Penjualan</a></li>
        <li><a href="/admin/pemesanan">Buat Pesanan</a></li>
      </ul>
      <button 
       onClick={handleLogout}
       style={{marginTop:'20px', padding:'10px 20px', backgroundColor:'#dc3545', color:'white', border:'none', cursor:'pointer'}}
      >
        Keluar (Logout)
      </button>
    </div>
  );
}