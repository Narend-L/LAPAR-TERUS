import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-api';
import { MenuService } from '@/services/menu';

export async function PUT(request, { params }) {
  const { id } = await params; 

  const isAdmin = await verifyAdmin();
  console.log("status admin api :", isAdmin);
  
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { nama_menu, harga } = await request.json();
    // Gunakan 'id' yang sudah di-await tadi
    const changes = await MenuService.updateMenu(id, nama_menu, parseFloat(harga));
    
    if (changes === 0) return NextResponse.json({ error: 'Menu tidak ditemukan' }, { status: 404 });
    return NextResponse.json({ message: 'Menu berhasil diubah' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update menu' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const changes = await MenuService.deleteMenu(id);
    if (changes === 0) return NextResponse.json({ error: 'Menu tidak ditemukan' }, { status: 404 });
    return NextResponse.json({ message: 'Menu berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal hapus menu' }, { status: 500 });
  }
}