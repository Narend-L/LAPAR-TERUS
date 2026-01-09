import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Ambil token dari cookie
  const cookie = request.cookies.get('auth_token');
  const token = cookie?.value;

  // 2. Jika mencoba akses folder admin
  if (pathname.startsWith('/admin')) {
    console.log("--- MIDDLEWARE CHECK ---");
    console.log("Mencoba akses:", pathname);
    
    if (!token) {
      console.log("Hasil: Token tidak ditemukan, tendang ke /login");
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // 3. Verifikasi Token
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
      await jwtVerify(token, secret);
      
      console.log("Hasil: Token VALID. Silakan masuk.");
      return NextResponse.next();
    } catch (err) {
      console.log("Hasil: Token PALSU/EXPIRED. Error:", err.message);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};