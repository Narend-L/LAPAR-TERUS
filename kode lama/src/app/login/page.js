// src/app/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  // 1. Login sebagai Siswa (tanpa password)
  const handleSiswaLogin = () => {
    // Siswa langsung dialihkan ke halaman pemesanan
    router.push('/siswa/pemesanan');
  };

  // 2. Login sebagai Admin (membutuhkan password)
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        router.push('/admin'); // Redirect ke Dashboard Admin
      } else {
        alert(data.message); // Tampilkan pesan error dari API
      }
    } catch (error) {
      alert('Koneksi Gagal');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Selamat Datang di Kantin</h1>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleSiswaLogin} 
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Pemesanan Mahasiswa
        </button>
      </div>
      
      <form onSubmit={handleAdminLogin}>
        <h2>Login Admin</h2>
        <input
          type="password"
          placeholder="Masukkan Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button 
          type="submit" 
          style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Login Admin
        </button>
      </form>
    </div>
  );
}