import { NextResponse } from 'next/server';


export function middleware(request) {
  // 1. Ambil cookie token dari request
  const authToken = request.cookies.get('auth_token');
  const pathname = request.nextUrl.pathname;

  // 2. Tentukan jalur mana yang dilindungi
  const protectedAdminRoutes = ['/admin', '/admin/tambah-menu', '/admin/laporan'];

  // 3. Jika jalur yang diminta adalah salah satu jalur admin yang dilindungi
  if (protectedAdminRoutes.some(route => pathname.startsWith(route))) {
    
    // Jika tidak ada token, alihkan ke halaman login
    if (!authToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // 4. Verifikasi token (sangat sederhana: hanya parsing JSON)
    try {
      // Karena kita menyimpan JSON di dalam cookie, kita parse kembali
      const user = JSON.parse(authToken.value); 

      // 5. Periksa peran pengguna
      if (user.role === 'admin') {
        // Jika admin, izinkan request untuk melanjutkan ke halaman tujuan
        return NextResponse.next();
      } else {
        // Jika token ada tapi bukan admin (misalnya role: 'siswa'), alihkan ke halaman utama
        const url = request.nextUrl.clone();
        url.pathname = '/'; // Atau ke halaman login lagi
        return NextResponse.redirect(url);
      }
    } catch (error) {
      // Jika terjadi error saat parsing (token rusak/invalid), alihkan ke login
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Jika jalur tidak dilindungi, biarkan request berlanjut
  return NextResponse.next();
}

// Konfigurasi: Tentukan jalur mana yang harus dilewati oleh middleware
export const config = {
  matcher: [
    /*
     * Cocokkan semua jalur request kecuali:
     * - /api (API routes)
     * - /_next/static (static files)
     * - /_next/image (image assets)
     * - /favicon.ico (favicon)
     * - /login (halaman login)
     * - Semua file di folder public
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|.*\\.png$).*)',
  ],
};