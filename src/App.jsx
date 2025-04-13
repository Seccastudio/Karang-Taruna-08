import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import './App.css';

// Halaman User
import Home from "./pages/Home";
import Kegiatan from "./pages/Kegiatan";
import Keuangan from "./pages/Keuangan";
import Artikel from "./pages/Artikel";
import ProgramUnggulan from "./pages/ProgramUnggulan";
import Keanggotaan from "./pages/Keanggotaan";
import Pendaftaran from "./pages/Pendaftaran";
import Produk from "./pages/Produk";

import Login from "./pages/Login";

// Halaman Admin
import Dashboard from "./pages/admin/Dashboard";
import ManageKegiatan from "./pages/admin/ManageKegiatan";
import ManageKeuangan from "./pages/admin/ManageKeuangan";
import ManageArtikel from "./pages/admin/ManageArtikel";
import ManageProgram from "./pages/admin/ManageProgram";
import ManageAnggotaPeserta from "./pages/admin/ManageAnggotaPeserta";
import ManageProduk from "./pages/admin/ManageProduk";



import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kegiatan" element={<Kegiatan />} />
        <Route path="/keuangan" element={<Keuangan />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/program" element={<ProgramUnggulan />} />
        <Route path="/keanggotaan" element={<Keanggotaan />} />
        <Route path="/pendaftaran" element={<Pendaftaran />} />
        <Route path="/produk" element={<Produk />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/kegiatan"
          element={
            <PrivateRoute>
              <ManageKegiatan />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/keuangan"
          element={
            <PrivateRoute>
              <ManageKeuangan />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/produk"
          element={
            <PrivateRoute>
              <ManageProduk />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/artikel"
          element={
            <PrivateRoute>
              <ManageArtikel />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/program"
          element={
            <PrivateRoute>
              <ManageProgram />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/anggota-peserta"
          element={
            <PrivateRoute>
              <ManageAnggotaPeserta />
            </PrivateRoute>
          }
        />

      </Routes>
      <Footer />
    </>
  );
}

export default App;
