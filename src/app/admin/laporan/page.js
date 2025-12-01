// src/app/admin/laporan/page.js
'use client';

import { useState, useEffect } from 'react';

export default function LaporanPenjualanPage() {
  const [laporan, setLaporan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLaporan() {
      try {
        const response = await fetch('/api/laporan');
        
        if (!response.ok) {
            throw new Error('Gagal mengambil data laporan');
        }
        
        const data = await response.json();
        setLaporan(data);
      } catch (error) {
        console.error('Failed to fetch report:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLaporan();
  }, []);

  if (isLoading) return <div style={{ padding: '20px' }}>Memuat Laporan Penjualan...</div>;
  if (laporan.length === 0) return <div style={{ padding: '20px' }}>Belum ada data pesanan yang tercatat.</div>;

  // Hitung total keseluruhan penjualan
  const totalOmzet = laporan.reduce((sum, order) => sum + order.total_harga, 0);

  return (
    <div style={{ padding: '20px' }}>
      <h1>📊 Laporan Penjualan Kantin</h1>
      <p>Total {laporan.length} transaksi tercatat.</p>
      <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'green' }}>
        Total Omzet: Rp {totalOmzet.toLocaleString('id-ID')}
      </p>

      {laporan.map((order) => (
        <div key={order.order_id} style={{ border: '1px solid #333', marginBottom: '20px', padding: '15px', borderRadius: '8px' }}>
          <h3>Pesanan #{order.order_id}</h3>
          <p>
            **Pemesan:** {order.nama_pemesan} | **Tanggal:** {new Date(order.tanggal_pesan).toLocaleString('id-ID')}
          </p>
          <p>
            <strong style={{ color: 'red' }}>Total Transaksi: Rp {order.total_harga.toLocaleString('id-ID')}</strong>
          </p>

          <h4>Detail Item:</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Menu</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Harga Satuan</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Jumlah</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.nama_menu}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>Rp {item.harga_per_item.toLocaleString('id-ID')}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.jumlah}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>Rp {(item.jumlah * item.harga_per_item).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}