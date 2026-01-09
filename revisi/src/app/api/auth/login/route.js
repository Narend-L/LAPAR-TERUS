import { authService } from '@/services/login-api';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();

    const result = await authService.login(password);

    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 });
    } else {
      return NextResponse.json({ message: result.message }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error Server' }, { status: 500 });
  }
}