'use client';

import { useState, useEffect } from 'react';
// Kita akan menggunakan komponen sederhana dari halaman siswa dan memodifikasinya
import { fetchMenus, handleOrder } from '@/lib/utils'; // Akan dibuat di bawah

export default function PemesananOfflinePage() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [namaPemesan, setNamaPemesan] = useState('');

  useEffect(() => {
    // Fungsi fetchMenus akan kita pindahkan ke file utils
    async function getMenus() {
      setIsLoading(true);
      const data = await fetchMenus();
      setMenus(data);
      setIsLoading(false);
    }
    getMenus();
  }, []);

  const addToCart = (menu) => {
    const existingItem = cart.find(item => item.menu_id === menu.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.menu_id === menu.id ? { ...item, jumlah: item.jumlah + 1 } : item
      ));
    } else {
      setCart([...cart, {
        menu_id: menu.id,
        nama_menu: menu.nama_menu,
        harga_per_item: menu.harga,
        jumlah: 1,
      }]);
    }
  };

  // Fungsi untuk hapus item dari keranjang
  const removeFromCart = (menuId) => {
    setCart(cart.filter(item => item.menu_id !== menuId));
  };

  const totalHarga = cart.reduce((total, item) => total + (item.harga_per_item * item.jumlah), 0);

  const processOrder = async () => {
    // Gunakan fungsi handleOrder yang akan kita buat
    if (!namaPemesan) {
      alert('Mohon masukkan nama pemesan!');
      return;
    }    

    const success = await handleOrder(cart, totalHarga, 1, namaPemesan); // UserID sementara 1
    if (success) {
      alert('Pencatatan Pesanan Berhasil!');
      setCart([]);
      setNamaPemesan('');
    } else {
      alert('Gagal mencatat pesanan.');
    }

  };

  if (isLoading) return <div style={{ padding: '20px' }}>Memuat menu...</div>;

  return (
    <div style={{ padding: '20px', display: 'flex', gap: '30px' }}>
      <div style={{ flex: 2 }}>
        <h1>Pemesanan Kasir (Offline)</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
          {menus.map((menu) => (
            <div key={menu.id} style={{ border: '1px solid #007bff', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{menu.nama_menu}</p>
              <p style={{ margin: 0 }}>Rp {menu.harga}</p>
              <button onClick={() => addToCart(menu)} style={{ backgroundColor: '#007bff', color: 'white' }}>Tambah</button>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ flex: 1, border: '2px solid green', padding: '15px', borderRadius: '8px', height: 'fit-content' }}>
        <h2>Keranjang Kasir</h2>
        <input
         type='text' 
         placeholder='Nama Pemesan Offline' 
         value={namaPemesan} 
         onChange={(e) => setNamaPemesan(e.target.value)}
         style={{width:'100', padding: '8px', marginBottom: '10px'}}
        />
        {cart.length === 0 ? <p>Keranjang kosong.</p> : (
          <>
            <ul>
              {cart.map((item) => (
                <li key={item.menu_id}>
                  {item.nama_menu} ({item.jumlah}x) - Rp {item.harga_per_item * item.jumlah} 
                  <button onClick={() => removeFromCart(item.menu_id)} style={{ marginLeft: '10px', color: 'red' }}>Hapus</button>
                </li>
              ))}
            </ul>
            <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Total: Rp {totalHarga}</p>
            <button onClick={processOrder} style={{ backgroundColor: 'green', color: 'white', padding: '10px', width: '100%' }}>
              Bayar Tunai & Catat
            </button>
          </>
        )}
      </div>
    </div>
  );
}