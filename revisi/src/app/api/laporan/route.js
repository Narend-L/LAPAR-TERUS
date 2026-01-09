// src/app/api/laporan/route.js
import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth-api';
import { LaporanService } from '@/services/laporan';

export async function GET() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Akses ditolak' }, { status: 401 });

  try {
    const reportData = await LaporanService.getPendingOrders();
    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Service Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data laporan' }, { status: 500 });
  }
}

export async function PUT(request) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Akses ditolak' }, { status: 401 });

  try {
    const { order_id, new_status } = await request.json();
    if (!order_id || new_status !== 'done') {
      return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
    }

    const changes = await LaporanService.updateStatusToDone(order_id, new_status);
    if (changes === 0) return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });

    return NextResponse.json({ message: `Pesanan #${order_id} selesai` });
  } catch (error) {
    return NextResponse.json({ error: 'Permintaan tidak valid' }, { status: 400 });
  }
}

export async function DELETE() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) return NextResponse.json({ error: 'Akses ditolak' }, { status: 401 });

  try {
    const deletedCount = await LaporanService.clearDoneOrders();
    return NextResponse.json({ message: `${deletedCount} pesanan telah dihapus.` });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 });
  }
}