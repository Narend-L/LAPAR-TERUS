// src/app/admin/page.js

'use client';

import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      alert('Anda telah logout.');
      router.push('/login');
    } catch (error) {
      alert('Gagal logout.');
    }
  };

  return (
    <div 
      style={{
        padding: '40px',
        minHeight: '100vh',
        backgroundColor: '#f4f4f9',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#ffffff',
          padding: '35px',
          borderRadius: '16px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.10)',
          border: '1px solid #e0e0e0'
        }}
      >
        <h1
          style={{
            color: '#6c63ff',
            marginBottom: '8px',
            fontSize: '30px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Dashboard Admin
        </h1>

        <p 
          style={{
            color: '#444',
            marginBottom: '25px',
            textAlign: 'center'
          }}
        >
          Selamat datang! Silahkan pilih menu di bawah.
        </p>

        {/* Tombol Input Menu */}
        <button
          onClick={() => router.push('/admin/tambah-menu')}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#6c63ff',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '15px',
            transition: '0.25s'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#5a52e0')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#6c63ff')}
        >
          ➤ Input Menu
        </button>

        <button
          onClick={() => router.push('/admin/laporan')}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#aaaa55',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '15px',
            transition: '0.25s'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#777722')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#777722')}
        >
          ➤ Pesanan Masuk
        </button>
        {/* Tombol Buat Pesanan */}
        <button
          onClick={() => router.push('/admin/pemesanan')}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#ff8b3d',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '25px',
            transition: '0.25s'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#e57427')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#ff8b3d')}
        >
          ➤ Buat Pesanan
        </button>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: '0.25s'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#c82333')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#dc3545')}
        >
          Keluar (Logout)
        </button>
      </div>
    </div>
  );
}
