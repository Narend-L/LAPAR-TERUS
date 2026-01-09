'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PesananDapurPage() {
  const [pesananAktif, setPesananAktif] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchPesanan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/laporan');

      if (response.status === 401) {
        alert("Akses ditolak");
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error('Gagal mengambil data pesanan aktif');
      }

      const data = await response.json();
      setPesananAktif(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatusToDone = async (orderId) => {
    try {
      const response = await fetch('/api/laporan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, new_status: 'done' }), 
      });

      if (response.status === 401) {
        alert("Akses ditolak");
        window.location.href = '/login';
        return;
      }

      if (!response.ok) throw new Error('Gagal memperbarui status pesanan');
      
      alert(`Pesanan #${orderId} telah selesai.`);
      fetchPesanan(); // Refresh data setelah sukses
    } catch (error) {
      alert(error.message);
    }
  };

  const clearDoneOrders = async () => {
    if (!confirm("Hapus semua pesanan yang sudah 'DONE'?")) return;

    try {
      const response = await fetch('/api/laporan', {
        method: 'DELETE', 
      });

      if (response.status === 401) {
        alert("Akses ditolak");
        window.location.href = '/login';
        return;
      }

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Gagal menghapus data');

      alert(result.message);
      fetchPesanan();
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchPesanan();
  }, []); 
  
  // ------------------------------------------------------------------

if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-pulse text-xl font-semibold text-blue-600">Memuat Pesanan Aktif...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="mb-6 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg shadow transition-all flex items-center gap-2"
        >
          ← Kembali
        </button>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-8 border-l-8 border-blue-500 pl-4">
          Daftar Pesanan Aktif
        </h1>
        
        {/* Status Bar */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 font-medium">
            Terdapat <span className="text-blue-600 font-bold text-lg">{pesananAktif.length}</span> pesanan menunggu proses.
          </p>
          <button 
            onClick={clearDoneOrders} 
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm"
          >
            Clear Pesanan Selesai
          </button>
        </div>

        {/* Orders Grid */}
        {pesananAktif.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <p className="text-slate-400 text-xl italic">Tidak ada pesanan aktif saat ini.</p>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pesananAktif.map((order) => (
              <div 
                key={order.order_id} 
                className="bg-white border-2 border-blue-100 p-6 rounded-2xl shadow-lg hover:border-blue-300 transition-all flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Nota #{order.order_id}</h3>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">Baru</span>
                </div>
                
                <p className="text-slate-500 text-sm mb-4 italic">Pemesan: <span className="text-slate-900 font-semibold not-italic">{order.nama_pemesan}</span></p>
                
                <div className="flex-grow">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Item Dipesan:</h4>
                  <ul className="space-y-2 mb-6">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between text-slate-700 border-b border-slate-50 pb-2">
                        <span><span className="font-bold text-blue-600">{item.jumlah}x</span> {item.nama_menu}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400 font-medium">Total Harga</span>
                    <span className="text-xl font-black font-mono text-green-600">Rp {order.total_harga.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <button 
                    onClick={() => updateStatusToDone(order.order_id)} 
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-black text-lg shadow-md hover:shadow-emerald-200 transition-all active:scale-95"
                  >
                    SELESAI
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}