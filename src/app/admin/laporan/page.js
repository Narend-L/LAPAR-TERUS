'use client';

import { useState, useEffect } from 'react';

export default function PesananDapurPage() {
  const [pesananAktif, setPesananAktif] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPesanan = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/laporan');
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

      if (!response.ok) throw new Error('Gagal update status');
      
      alert(`Status Pesanan #${orderId} telah Selesai dan Diambil.`);
      fetchPesanan(); 
    } catch (error) {
      alert(error.message);
    }
  };

  const clearDoneOrders = async () => {
      if (!confirm("Anda yakin ingin menghapus semua pesanan yang sudah selesai? Aksi ini TIDAK dapat dibatalkan!")) return;

      try {
          const response = await fetch('/api/laporan', {
              method: 'DELETE', 
          });

          const result = await response.json();
          if (!response.ok) throw new Error(result.error);

          alert(result.message);
          fetchPesanan(); 
      } catch (error) {
          alert(error.message);
      }
  }

  useEffect(() => {
    fetchPesanan();
  }, []); 
  
  // ------------------------------------------------------------------

  if (isLoading) return <div style={{ padding: '20px' }}>Memuat Pesanan Aktif...</div>;
  
  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => history.back()} style={{ backgroundColor: '#000', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}> Kembali</button>
      <h1>Daftar Pesanan Aktif</h1>
      
      {/* Tombol Clear Laporan */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <p>Total {pesananAktif.length} pesanan menunggu proses.</p>
        <button onClick={clearDoneOrders} style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Clear Pesanan Selesai
        </button>
      </div>

      {pesananAktif.length === 0 ? (
          <p style={{ fontSize: '1.2em', textAlign: 'center', marginTop: '50px' }}>
              Tidak ada pesanan aktif.
          </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {pesananAktif.map((order) => (
            <div key={order.order_id} style={{ border: '2px solid #007bff', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Nota #{order.order_id} - {order.nama_pemesan}</h3>
              
              <h4>Item Dipesan:</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {order.items.map((item, index) => (
                  <li key={index} style={{ borderBottom: '1px dotted #eee', padding: '5px 0' }}>
                    **{item.nama_menu}** ({item.jumlah}x)
                  </li>
                ))}
              </ul>
              
              <p style={{ fontWeight: 'bold' }}>Total: **Rp {order.total_harga.toLocaleString('id-ID')}**</p>
              
              {/* Tombol Selesai */}
              <button 
                onClick={() => updateStatusToDone(order.order_id)} 
                style={{ width: '100%', backgroundColor: '#28a745', color: 'white', padding: '10px', marginTop: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                ✅ DONE
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}