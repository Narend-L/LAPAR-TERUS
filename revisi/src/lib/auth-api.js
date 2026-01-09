import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function verifyAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    // DEBUG 1: Cek Token
    if (!token) {
      console.log("DEBUG: Token sama sekali tidak ditemukan di cookie.");
      return false;
    }
    console.log("DEBUG: Token ditemukan.");

    // DEBUG 2: Cek Secret Key
    const secretKey = process.env.AUTH_SECRET;
    if (!secretKey) {
      console.log("DEBUG: AUTH_SECRET di .env tidak terbaca.");
      return false;
    }

    const secret = new TextEncoder().encode(secretKey);

    // DEBUG 3: Proses Verifikasi
    try {
      const { payload } = await jwtVerify(token, secret);
      console.log("DEBUG: Token berhasil di-verify. Payload:", payload);

      if (payload.role === 'admin') {
        return true;
      } else {
        console.log("DEBUG: Role bukan admin, tapi:", payload.role);
        return false;
      }
    } catch (jwtErr) {
      console.log("DEBUG: JWT Verify Gagal. Alasan:", jwtErr.message);
      // Jika error "signature verification failed", berarti secret key saat LOGIN 
      // berbeda dengan secret key saat VERIFY
      return false;
    }

  } catch (error) {
    console.error("DEBUG: Error sistem di verifyAdmin:", error.message);
    return false;
  }
}