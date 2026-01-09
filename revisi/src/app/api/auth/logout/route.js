import { authService } from '@/services/login-api';
import { NextResponse } from 'next/server';

export async function POST() {
  await authService.logout();
  return NextResponse.json({ message: 'Logout berhasil' });
}