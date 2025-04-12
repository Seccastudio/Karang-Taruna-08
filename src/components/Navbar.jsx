import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

const Navbar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Check if the user is an admin
  const isAdmin = user?.email?.includes("admin");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 sticky-top">
      <Link className="navbar-brand" to="/">KARTA08</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {!loading && isAdmin ? (
            // Admin Navbar
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
                <Link className="nav-link" to="/admin/artikel">Manage Artikel</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/program">Manage Program</Link>
              </li>
            </>
          ) : (
            // User Navbar
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
                <Link className="nav-link" to="/artikel">Artikel</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/program">Program Unggulan</Link>
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
                <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
              </li>
            )
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
