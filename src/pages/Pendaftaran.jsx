import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const Pendaftaran = () => {
  const [selectedForm, setSelectedForm] = useState('keanggotaan');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    alamat: '',
    program: '',
    nomorHP: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      email: '',
      alamat: '',
      program: '',
      nomorHP: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedForm === 'keanggotaan') {
        await addDoc(collection(db, 'pendaftaranKeanggotaan'), {
          nama: formData.nama,
          email: formData.email,
          alamat: formData.alamat,
          timestamp: Timestamp.now(),
        });
      } else if (selectedForm === 'program') {
        await addDoc(collection(db, 'pendaftaranProgram'), {
          nama: formData.nama,
          program: formData.program,
          nomorHP: formData.nomorHP,
          timestamp: Timestamp.now(),
        });
      }
      alert('Pendaftaran berhasil!');
      resetForm();
    } catch (error) {
      console.error('Gagal menyimpan data:', error);
      alert('Terjadi kesalahan saat mendaftar.');
    }
    setLoading(false);
  };

  const renderForm = () => {
    if (selectedForm === 'keanggotaan') {
      return (
        <form onSubmit={handleSubmit}>
          <h3>Formulir Pendaftaran Keanggotaan</h3>
          <div className="mb-3">
            <label className="form-label">Nama Lengkap</label>
            <input type="text" name="nama" className="form-control" value={formData.nama} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Alamat</label>
            <textarea name="alamat" className="form-control" rows="3" value={formData.alamat} onChange={handleChange} required></textarea>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Mengirim...' : 'Daftar'}
          </button>
        </form>
      );
    } else {
      return (
        <form onSubmit={handleSubmit}>
          <h3>Formulir Pendaftaran Program Unggulan</h3>
          <div className="mb-3">
            <label className="form-label">Nama Peserta</label>
            <input type="text" name="nama" className="form-control" value={formData.nama} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Program Pilihan</label>
            <select name="program" className="form-control" value={formData.program} onChange={handleChange} required>
              <option value="">-- Pilih Program --</option>
              <option value="Pelatihan Kewirausahaan">Pelatihan Kewirausahaan</option>
              <option value="Pembinaan Remaja">Pembinaan Remaja</option>
              <option value="Pengembangan Kreativitas">Pengembangan Kreativitas</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Nomor HP</label>
            <input type="text" name="nomorHP" className="form-control" value={formData.nomorHP} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Mengirim...' : 'Daftar Program'}
          </button>
        </form>
      );
    }
  };

  return (
    <div className="container mt-5">
    <h2 className="fw-bold mb-4 text-center text-dark">Pendaftaran</h2>
    <div className="row">
        {/* Sidebar Kiri */}
        <div className="col-md-4 d-flex flex-column gap-3">
        {/* Card Keanggotaan */}
        <div
            className={`card ${selectedForm === 'keanggotaan' ? 'border-primary' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedForm('keanggotaan')}
        >
            <div className="card-body">
            <h5 className="card-title">Daftar Anggota</h5>
            <p className="card-text">Ingin menjadi bagian dari Karang Taruna RW08? Daftar di sini!</p>
            </div>
        </div>

        {/* Card Program */}
        <div
            className={`card ${selectedForm === 'program' ? 'border-success' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedForm('program')}
        >
            <div className="card-body">
            <h5 className="card-title">Daftar Program Unggulan</h5>
            <p className="card-text">Gabung dan berkontribusi dalam program-program terbaik kami.</p>
            </div>
        </div>

        {/* Card Persyaratan */}
        <div className="card border-info">
            <div className="card-body bg-info text-dark">
            <h5 className="card-title text-dark">Persyaratan</h5>
            <p className="card-text">Anggota atau peserta harus warga Kampung Dungusmaung RW008.</p>
            </div>
        </div>
        </div>

        {/* Form Area */}
        <div className="col-md-8">
        <div className="card p-4 shadow-sm">
            {renderForm()}
        </div>
        </div>
    </div>
    </div>

  );
};

export default Pendaftaran;
