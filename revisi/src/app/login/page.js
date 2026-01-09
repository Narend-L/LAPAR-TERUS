// src/app/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSiswaLogin = () => {
    router.push('/siswa/pemesanan');
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        router.push('/admin');
      } else {
        alert(data.message); 
      }
    } catch (error) {
      alert('Koneksi Gagal');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100">
        
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-blue-200 text-white">
            🍴
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">E-Kantin</h1>
          <p className="text-slate-500 font-medium">Selamat Datang di Sistem Kantin</p>
        </div>

        <div className="mb-8 p-1 bg-slate-50 rounded-3xl border border-slate-100">
          <button 
            onClick={handleSiswaLogin} 
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.4rem] font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <span></span> Login sebagai Mahasiswa
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Atau</span>
          </div>
        </div>
        
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-slate-700">Akses Admin</h2>
          </div>
          
          <div className="relative">
            <input
              type="password"
              placeholder="Masukkan Password Admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all text-center font-mono tracking-widest"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg shadow-red-100 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Mengecek...' : 'MASUK KE DASHBOARD'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-xs font-medium uppercase tracking-tight">
          Sistem Informasi Kantin
        </p>
      </div>
    </div>
  );
}