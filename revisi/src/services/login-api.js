import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export const authService = {
  async login(passwordInput) {
    try {
      const hashedPassword = process.env.ADMIN_PASSWORD_HASH;

      console.log("Hash dari .env ada?", !!hashedPassword);

      const isMatch = await bcrypt.compare(passwordInput, hashedPassword);
      console.log("Apakah password cocok?", isMatch);

      if (isMatch) {
        const secret = process.env.AUTH_SECRET;
        if (!secret) throw new Error("AUTH_SECRET tidak ditemukan di .env");
        const key = new TextEncoder().encode(secret);

        const token = await new SignJWT({ role: 'admin' })
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('1d')
          .sign(key);

        console.log("Token berhasil dibuat:", !!token);

        const cookieStore = await cookies();
        
        cookieStore.set('auth_token', token, {
          httpOnly: true, 
          secure: false, 
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24,
        });

        console.log("--- COOKIE SET TELAH DIPANGGIL ---");
        return { success: true, message: 'Login Berhasil!' };
      }

      return { success: false, message: 'Password Salah!' };
    } catch (error) {
      console.error("ERROR DI AUTH SERVICE:", error.message);
      return { success: false, message: 'Terjadi kesalahan sistem' };
    }
  },

  async logout() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
  },

  async verifyAdmin() {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('auth_token')?.value;

      if (!token) {
        console.log("VerifyAdmin Gagal: Token tidak ditemukan di cookie");
        return false;
      }

      // Pastikan SECRET_KEY di sini sama dengan yang di fungsi login
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
      
      // Bongkar token
      const { payload } = await jwtVerify(token, secret);
      
      // Cek apakah role-nya benar admin (sesuai yang kita set di login)
      if (payload.role === 'admin') {
        return true;
      }

      console.log("VerifyAdmin Gagal: Role bukan admin");
      return false;
    } catch (error) {
      console.log("VerifyAdmin Gagal: Token tidak valid/expired -", error.message);
      return false;
    }
  }
};