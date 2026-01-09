import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100">
      
      {/* Header */}
      <header className="bg-blue-400 text-white py-6 px-4 text-center text-2xl md:text-3xl font-black tracking-tight shadow-lg border-b border-blue-300">
        <span className="drop-shadow-md">
          🍽️ Sistem Pengelolaan Makanan Kantin Lapar Terus 🍽️
        </span>
      </header>

      {/* Konten Utama */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
        <div className="max-w-2xl animate-in fade-in zoom-in duration-700">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 leading-tight">
            Selamat Datang di <span className="text-blue-600">Kantin Lapar Terus!</span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
            Laper? Jangan asal jajan! Mampir ke Kantin Lapar terus. 
            Makanannya enak, bergizi, dan gak bikin kantong kurus. 
            Perut kenyang, badan senang, hidup pun tenang.
          </p>

          {/* Tombol Login */}
          <Link 
            href="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl text-xl font-black shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95 tracking-wide uppercase"
          >
            Masuk Sekarang
          </Link>

          {/* Ilustrasi tambahan */}
          <div className="mt-12 group">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-blue-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <img 
                src="https://png.pngtree.com/png-clipart/20230914/original/pngtree-illustration-of-indonesian-fried-rice-logo-png-image_11499539.png"
                alt="Logo Kantin"
                width="280"
                height="280"
                className="relative opacity-95 transition-transform duration-500 group-hover:rotate-6"
              />
            </div>
            
            <p className="text-slate-500 italic mt-6 font-medium text-lg">
              “Makanan lezat, pelayanan cepat, harga bersahabat.”
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-400 text-white text-center py-4 font-bold text-sm tracking-wide">
        © 2026 Kantin Sehat. All rights reserved. <span className="underline decoration-blue-200">Lapar Terus</span>
      </footer>
    </div>
  );
}