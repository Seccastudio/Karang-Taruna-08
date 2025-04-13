function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-5 border-top">
      <div className="container">
        <p className="mb-1 fw-bold">Karang Taruna DungusMaung</p>
        <p className="mb-1" style={{ fontSize: '0.95rem' }}>
          Kp. Dungus Maung RW 008, Desa Cikuya, Kecamatan Cicalengka, Kabupaten Bandung, Provinsi Jawa Barat, 40395
        </p>
        <p className="mb-2" style={{ fontSize: '0.9rem' }}>Hak Cipta © 2025 | Dikembangkan oleh <strong>SECCASTUDIO</strong> Hak cipta dilindungi.</p>

        <div className="d-flex justify-content-center gap-3">
          <i className="bi bi-facebook fs-5"></i>
          <i className="bi bi-twitter fs-5"></i>
          <i className="bi bi-instagram fs-5"></i>
          <i className="bi bi-youtube fs-5"></i>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
