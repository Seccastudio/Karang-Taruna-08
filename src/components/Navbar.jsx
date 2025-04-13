import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const isAdmin = user?.email?.includes("admin");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <>
      {/* Brand & Time Bar */}
      <div
        className="brand-bar d-flex justify-content-between align-items-center px-4 py-2 text-dark"
        style={{
          background: "linear-gradient(90deg, rgb(194, 225, 255) 0%, rgb(89, 219, 236) 100%)",
        }}
      >
        <Link to="/" className="d-flex align-items-center text-dark text-decoration-none">
          <img
            src="/logo.png"
            alt="Logo"
            className="flip-logo me-3"
            style={{ height: "80px" }}
          />
          <div style={{ lineHeight: 1 }}>
            <strong>Karang Taruna RW08</strong>
            <br />
            <span style={{ fontSize: "0.85rem" }}>
              Desa Cikuya, Kecamatan Cicalengka, Kabupaten Bandung, Jawa Barat
            </span>
          </div>
        </Link>

        {/* Clock Display */}
        <div className="text-end text-dark">
          <div
            className="fw-bold"
            style={{
              fontSize: "1.8rem",
              fontFamily: "'Orbitron', monospace",
              lineHeight: 1.2,
            }}
          >
            {formattedTime}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#333" }}>{formattedDate}</div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark px-4 sticky-top bg-dark">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {!loading && isAdmin ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/kegiatan">Manage Kegiatan</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/keuangan">Manage Keuangan</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/produk">Manage Produk</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/artikel">Manage Artikel</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/program">Manage Program</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/anggota-peserta">Manage Anggota-Peserta</Link>
                </li>

              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Beranda</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/kegiatan">Kegiatan</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/keuangan">Keuangan</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/produk">Prodak Kami</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/program">Program Unggulan</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/artikel">Artikel</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/pendaftaran">Pendaftaran</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/keanggotaan">Keanggotaan</Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {!loading && !user ? (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            ) : (
              !loading && (
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              )
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
