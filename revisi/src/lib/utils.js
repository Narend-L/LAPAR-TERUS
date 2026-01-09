// src/lib/utils.js

// Fungsi untuk mengambil data menu dari API
export async function fetchMenus() {
  try {
    const response = await fetch('/api/menus');
    if (!response.ok) {
      throw new Error('Gagal mengambil data menu');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return []; 
  }
}

export async function handleOrder(cartItems, total, userId) {
  try {
    const response = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems, total: total, userId: userId }),
    });

    if (!response.ok) {
      throw new Error('Gagal memproses pesanan');
    }

    return true; 
  } catch (error) {
    console.error(error);
    return false; 
  }
}