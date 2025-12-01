'use client';

import { AsyncCallbackSet } from 'next/dist/server/lib/async-callback-set';
import { useState, useEffect } from 'react';

export default function PemesananSiswaPage() {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [namaPemesan, setNamaPemesan] = useState('');

  useEffect(() => {
    async function fetchMenus() {
      try {
        const response = await fetch('/api/menus');
        if (!response.ok) {
          throw new Error('Gagal mengambil data menu');
        }
        const data = await response.json();
        setMenus(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMenus();
  }, []);

const addToCart = (menu) => {
  const existingItem = cart.find(item => item.menu_id === menu.id)


  if (existingItem) {
    setCart(cart.map (item =>
      item.menu_id === menu.id
        ? { ...item, jumlah: item.jumlah + 1}
        : item
    ));
  } else {
    setCart([...cart, {
      menu_id: menu.id,
      nama_menu: menu.nama_menu,
      harga_per_item: menu.harga,
      jumlah:1,
    }]);
  }
};

  // Fungsi untuk menghitung total harga
const totalHarga = cart.reduce((total, item) => total + (item.harga_per_item * item.jumlah), 0);

  // Fungsi untuk Kirim Pesanan (akan memanggil API baru)
const handleOrder = async () => {
  if (cart.length === 0) {
    alert('Keranjang belanja kosong!');
    return;
  }
  if (!namaPemesan) {
    alert('Mohon masukkan nama pemesan!');
    return;
  }

  try {
    const response = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({items: cart, total: totalHarga, userId: 1, nama_pemesan: namaPemesan}), // userId 1 sementara untuk siswa
    });

    if (!response.ok) {
      throw new Error('Gagal memproses pesanan');
    }

    alert('Pesanan berhasil dibuat!');
    setCart([]); // Kosongkan keranjang setelah sukses
  } catch (error) {
    alert(error.message);
  }
};


  // ... (kode isLoading dan error check)

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Memuat menu...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  }


  //tampilan
  return (
    <div style={{ padding: '20px', display: 'flex', gap: '30px' }}>
      {/* Kolom Kiri: Daftar Menu */}
      <div style={{ flex: 2 }}>
        <input 
          type="text" 
          placeholder="Nama Anda (Wajib diisi)" 
          value={namaPemesan} 
          onChange={(e) => setNamaPemesan(e.target.value)}
          style={{ width: '40%', padding: '10px', marginBottom: '20px', border: '1px solid #ccc' }}
        />
        <h1>Pesan Makanan</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {menus.map((menu) => (
            <div key={menu.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px' }}>
              <h3>{menu.nama_menu}</h3>
              <p>Harga: Rp {menu.harga}</p>
              <button onClick={() => addToCart(menu)}>Tambahkan</button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Kolom Kanan: Keranjang dan Checkout */}
      <div style={{ flex: 1, border: '1px solid #000', padding: '15px', borderRadius: '8px', height: 'fit-content' }}>
        <h2>Keranjang Anda</h2>
        {cart.length === 0 ? (
          <p>Keranjang kosong.</p>
        ) : (
          <>
            <ul>
              {cart.map((item, index) => (
                <li key={index}>
                  {item.nama_menu} ({item.jumlah}x) - Rp {item.harga_per_item * item.jumlah}
                </li>
              ))}
            </ul>
            <p><strong>Total: Rp {totalHarga}</strong></p>
            <button onClick={handleOrder} style={{ backgroundColor: 'green', color: 'white', padding: '10px', width: '100%' }}>
              Pesan Sekarang
            </button>
          </>
        )}
      </div>
    </div>
  );
}