export default function HomePage() {
  return (
  <div>
   <div 
      style={{
        fontFamily: "Arial, sans-serif", 
        background: "linear-gradient(to bottom right, #f7f9fc, #cde6f5)",
        minHeight: "100vh", 
        margin: "0", 
        padding: "0"
      }}
    >

      {/* Header */}
      <header 
        style={{
          background: "#74b9ff", 
          color: "#fff", 
          padding: "20px 0", 
          textAlign: "center", 
          fontSize: "32px", 
          fontWeight: "bold", 
          letterSpacing: "1px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2)"
        }}
      >
        🍽️ Sistem Pengelolaan Makanan Kantin Lapar Terus 🍽️
      </header>

      {/* Konten Utama */}
      <main 
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          height: "80vh"
        }}
      >
        <h2 style={{fontSize:"28px", color:"#2d3436", marginBottom:"10px"}}>
          Selamat Datang di Kantin Lapar Terus!
        </h2>
        <p style={{maxWidth:"500px", color:"#555", fontSize:"18px", marginBottom:"40px"}}>
          Laper? Jangan asal jajan! Mampir ke Kantin Lapar terus. makanannya enak, bergizi, dan gak bikin kantong kurus. Perut kenyang, badan senang, hidup pun tenang
        </p>

        {/* Tombol Login */}
        <a 
          href="/login"
          style={{
            textDecoration: "none", 
            background: "#0984e3", 
            color: "white", 
            padding: "15px 40px", 
            borderRadius: "10px",
            fontSize: "20px",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            transition: "0.3s"
          }}
        >
          LOGIN
        </a>

        {/* Ilustrasi tambahan */}
        <div style={{marginTop:"25px"}}>
          <img 
            src="https://png.pngtree.com/png-clipart/20230914/original/pngtree-illustration-of-indonesian-fried-rice-logo-png-image_11499539.png"
            alt="kantin"
            width="250"
            height="250"
            style={{opacity:"0.9"}}
          />
          <p style={{color:"#636e72", fontStyle:"italic", marginTop:"10px"}}>
            “Makanan lezat, pelayanan cepat, harga bersahabat.”
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer 
        style={{
          background: "#74b9ff", 
          color: "white", 
          textAlign: "center", 
          padding: "10px", 
          fontSize: "14px"
        }}
      >
        © 2025 Kantin Sehat. All rights reserved. Lapar Terus
      </footer>
    </div>
  </div>
)
  
}
