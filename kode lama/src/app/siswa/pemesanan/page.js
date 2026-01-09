'use client';

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
    const existingItem = cart.find(item => item.menu_id === menu.id);

    if (existingItem) {
      setCart(
        cart.map(item =>
          item.menu_id === menu.id
            ? { ...item, jumlah: item.jumlah + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          menu_id: menu.id,
          nama_menu: menu.nama_menu,
          harga_per_item: menu.harga,
          jumlah: 1,
        }
      ]);
    }
  };

  const totalHarga = cart.reduce(
    (total, item) => total + (item.harga_per_item * item.jumlah),
    0
  );

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
        body: JSON.stringify({
          items: cart,
          total: totalHarga,
          userId: 1,
          nama_pemesan: namaPemesan,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal memproses pesanan');
      }

      alert('Pesanan berhasil dibuat!');
      setCart([]);
    } catch (error) {
      alert(error.message);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Memuat menu...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  }

  return (
    <div
      style={{
        padding: '30px',
        display: 'flex',
        gap: '30px',
        background: 'linear-gradient(to bottom, #EAF4FF, #ffffff)',
        minHeight: '100vh'
      }}
    >

      {/* Kolom Kiri */}
      <div style={{ flex: 2 }}>
        <button onClick={() => history.back()} style={{ backgroundColor: '#000', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}> Kembali</button>
        <input
          type="text"
          placeholder="Nama Anda (Wajib diisi)"
          value={namaPemesan}
          onChange={(e) => setNamaPemesan(e.target.value)}
          style={{
            width: '50%',
            padding: '12px',
            marginBottom: '20px',
            border: '1px solid #A7C8FF',
            borderRadius: '8px',
            backgroundColor: '#F8FBFF',
            marginLeft: '50px',
          }}
        />

        <h1 style={{ color: '#2A4D8F', marginBottom: '20px' }}>Pesan Makanan</h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '20px'
          }}
        >
          {menus.map((menu) => (
            <div
              key={menu.id}
              style={{
                border: '1px solid #A7C8FF',
                borderRadius: '10px',
                padding: '15px',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ color: '#2A4D8F', marginBottom: '10px' }}>{menu.nama_menu}</h3>
              <p style={{ marginBottom: '10px' }}>Harga: Rp {menu.harga}</p>

              <button
                onClick={() => addToCart(menu)}
                style={{
                  backgroundColor: '#6DA9FF',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  width: '100%',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Tambahkan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Kolom Kanan: Keranjang */}
      <div
        style={{
          flex: 1,
          border: '1px solid #A7C8FF',
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: '#FFFFFF',
          height: 'fit-content',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <h2 style={{ color: '#2A4D8F' }}>Keranjang Anda</h2>

        {cart.length === 0 ? (
          <p>Keranjang kosong.</p>
        ) : (
          <>
            <ul>
              {cart.map((item, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  {item.nama_menu} ({item.jumlah}x) - Rp {item.harga_per_item * item.jumlah}
                </li>
              ))}
            </ul>

            <p><strong>Total: Rp {totalHarga}</strong></p>

            <button
              onClick={handleOrder}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '12px',
                width: '100%',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Pesan Sekarang
            </button>
          </>
        )}
      </div>
    </div>
  );
}
