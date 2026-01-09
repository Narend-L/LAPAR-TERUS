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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      {/* Card Container */}
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 text-center">
        
        {/* Title Section */}
        <h1 className="text-4xl font-black text-indigo-600 mb-2 tracking-tight">
          Dashboard
          <span className="block text-slate-800">Admin</span>
        </h1>
        
        <p className="text-slate-500 mb-10 font-medium">
          Selamat datang! Silakan pilih menu di bawah ini.
        </p>

        {/* Menu Buttons Group */}
        <div className="space-y-4">
          
          {/* Tombol Input Menu */}
          <button
            onClick={() => router.push('/admin/tambah-menu')}
            className="w-full group flex items-center justify-between bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            <span className="flex items-center gap-3">
              <span className="bg-indigo-500 p-2 rounded-lg group-hover:bg-indigo-400 transition-colors"></span>
              Input Menu
            </span>
            <span className="opacity-50 group-hover:translate-x-1 transition-transform">→</span>
          </button>

          {/* Tombol Buat Pesanan */}
          <button
            onClick={() => router.push('/admin/pemesanan')}
            className="w-full group flex items-center justify-between bg-amber-500 hover:bg-amber-600 text-white p-5 rounded-2xl font-bold text-lg shadow-lg shadow-amber-100 transition-all active:scale-[0.98]"
          >
            <span className="flex items-center gap-3">
              <span className="bg-amber-400 p-2 rounded-lg group-hover:bg-amber-300 transition-colors"></span>
              Buat Pesanan
            </span>
            <span className="opacity-50 group-hover:translate-x-1 transition-transform">→</span>
          </button>

          {/* Tombol Pesanan */}
          <button
            onClick={() => router.push('/admin/laporan')}
            className="w-full group flex items-center justify-between bg-orange-500 hover:bg-orange-600 text-white p-5 rounded-2xl font-bold text-lg shadow-lg shadow-orange-100 transition-all active:scale-[0.98]"
          >
            <span className="flex items-center gap-3">
              <span className="bg-orange-400 p-2 rounded-lg group-hover:bg-orange-300 transition-colors"></span>
              Daftar Pesanan
            </span>
            <span className="opacity-50 group-hover:translate-x-1 transition-transform">→</span>
          </button>

        </div>

        <div className="my-8 border-t border-slate-100"></div>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-500 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span></span> Keluar (Logout)
        </button>
      </div>
    </div>
  );
}