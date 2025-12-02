export default function HomePage() {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 600;
  const isTablet = typeof window !== "undefined" && window.innerWidth > 600 && window.innerWidth <= 900;

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
            padding: isMobile ? "15px 0" : "20px 0",
            textAlign: "center",
            fontSize: isMobile ? "22px" : isTablet ? "28px" : "32px",
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
            padding: isMobile ? "20px" : "0",
            height: isMobile ? "auto" : "80vh"
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "22px" : "28px",
              color: "#2d3436",
              marginBottom: "10px"
            }}
          >
            Selamat Datang di Kantin Lapar Terus!
          </h2>

          <p
            style={{
              maxWidth: "500px",
              color: "#555",
              fontSize: isMobile ? "16px" : "18px",
              marginBottom: "40px",
              padding: isMobile ? "0 10px" : "0"
            }}
          >
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
              fontSize: isMobile ? "18px" : "20px",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              transition: "0.3s",
              width: isMobile ? "90%" : "auto",
              display: "inline-block",
              textAlign: "center"
            }}
          >
            LOGIN
          </a>

          {/* Ilustrasi */}
          <div style={{ marginTop: "25px" }}>
            <img
              src="https://png.pngtree.com/png-clipart/20230914/original/pngtree-illustration-of-indonesian-fried-rice-logo-png-image_11499539.png"
              alt="kantin"
              width={isMobile ? "180" : "250"}
              height={isMobile ? "180" : "250"}
              style={{ opacity: "0.9" }}
            />

            <p
              style={{
                color: "#636e72",
                fontStyle: "italic",
                marginTop: "10px",
                fontSize: isMobile ? "14px" : "16px"
              }}
            >
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
            fontSize: isMobile ? "12px" : "14px"
          }}
        >
          © 2025 Kantin Sehat. All rights reserved. Lapar Terus
        </footer>
      </div>
    </div>
  );
}
