'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PemesananSiswaPage() {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [namaPemesan, setNamaPemesan] = useState('');
  const router = useRouter();

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* DAFTAR MENU */}
        <div className="lg:flex-[2]">
          <button 
            onClick={() => router.back()} 
            className="mb-6 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-xl transition-all shadow-md"
          >
            ← Kembali
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-6 border-l-8 border-blue-500 pl-4">
              Pesan Makanan
            </h1>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 mb-8">
              <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">Nama Pemesan</label>
              <input
                type="text"
                placeholder="Masukkan nama pelanggan..."
                value={namaPemesan}
                onChange={(e) => setNamaPemesan(e.target.value)}
                className="w-full md:w-2/3 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all text-lg"
              />
            </div>
          </div>

          {/* Grid Menu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <div
                key={menu.id}
                className="bg-white border border-blue-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4">🍱</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{menu.nama_menu}</h3>
                  <p className="text-blue-600 font-black text-lg mb-6 font-mono">
                    Rp {menu.harga.toLocaleString('id-ID')}
                  </p>
                </div>
                
                <button
                  onClick={() => addToCart(menu)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>+</span> Tambahkan
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* KERANJANG */}
        <div className="lg:flex-1">
          <div className="bg-white border-2 border-blue-100 p-6 rounded-[2.5rem] shadow-2xl sticky top-8">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="text-3xl">🛒</span> Keranjang
            </h2>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto mb-6 pr-2 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-400 italic">Keranjang masih kosong...</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-right-4 duration-300"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{item.nama_menu}</p>
                      <p className="text-sm text-slate-500 font-medium">{item.jumlah} x Rp {item.harga_per_item.toLocaleString('id-ID')}</p>
                    </div>
                    <span className="font-bold text-blue-600 font-mono text-sm">
                      Rp {(item.harga_per_item * item.jumlah).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-6 border-t-2 border-dashed border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-500 font-bold uppercase text-sm tracking-widest">Total Bayar</span>
                  <span className="text-2xl font-black text-green-600 font-mono">
                    Rp {totalHarga.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  onClick={handleOrder}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-100 transition-all active:scale-95"
                >
                  PESAN SEKARANG
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}