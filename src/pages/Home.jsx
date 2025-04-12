import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Home = () => {
  const [headline, setHeadline] = useState('');
  const [struktur, setStruktur] = useState(null);
  const [headlineImage, setHeadlineImage] = useState('');

  const fetchContent = async () => {
    const headlineDoc = await getDoc(doc(db, 'homeContent', 'headline'));
    const strukturDoc = await getDoc(doc(db, 'homeContent', 'strukturOrganisasi'));

    if (headlineDoc.exists()) {
      const data = headlineDoc.data();
      setHeadline(data.text || '');
      setHeadlineImage(data.image || '');

      localStorage.setItem('headline', JSON.stringify({ text: data.text, image: data.image }));
    }

    if (strukturDoc.exists()) {
      const data = strukturDoc.data();
      setStruktur(data);

      localStorage.setItem('struktur', JSON.stringify(data));
    }
  };

  useEffect(() => {
    const storedHeadline = localStorage.getItem('headline');
    const storedStruktur = localStorage.getItem('struktur');

    if (storedHeadline && storedStruktur) {
      const headlineData = JSON.parse(storedHeadline);
      const strukturData = JSON.parse(storedStruktur);

      setHeadline(headlineData.text);
      setHeadlineImage(headlineData.image);
      setStruktur(strukturData);
    } else {
      fetchContent(); 
    }
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column flex-md-row align-items-center mb-5">
        <h1 className="display-4 fw-bold text-dark me-4">{headline}</h1>
        {headlineImage && (
          <div className="flex-shrink-0 mb-3 mb-md-0">
            <img
              src={headlineImage}
              alt="Headline"
              className="img-fluid"
              style={{ width: '500px', height: 'auto' }}
            />
          </div>
        )}
      </div>

      <p className="lead mt-3 text-dark">
        Portal informasi kegiatan & transparansi keuangan untuk warga dan pengurus Karang Taruna tercinta.
      </p>
      <h2 className="text-center text-dark mb-4">Informasi</h2>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100" style={{ backgroundColor: '#bebebe' }}>
            <div className="card-body">
              <h5 className="card-title text-success">Informasi Kegiatan</h5>
              <p className="card-text">Temukan berbagai kegiatan sosial, budaya, dan kepemudaan yang telah dan akan kami laksanakan.</p>
              <a href="/kegiatan" className="btn btn-success">Lihat Kegiatan</a>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm h-100" style={{ backgroundColor: '#bebebe' }}>
            <div className="card-body">
              <h5 className="card-title text-primary">Informasi Keuangan</h5>
              <p className="card-text">Laporan pemasukan & pengeluaran dana secara transparan dan terpercaya.</p>
              <a href="/keuangan" className="btn btn-primary text-white">Lihat Keuangan</a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-center text-dark mb-4">Konten Menarik Lainnya</h2>
        <div className="row g-4" style={{ display: 'flex', justifyContent: 'center' }}>

          <div className="col-md-6">
            <div className="card shadow-sm h-100" style={{ backgroundColor: '#bebebe' }}>
              <div className="card-body">
                <h5 className="card-title text-danger">Artikel Inspiratif</h5>
                <p className="card-text">Baca artikel menarik tentang pengembangan pemuda dan kegiatan sosial.</p>
                <a href="/artikel" className="btn btn-danger">Baca Artikel</a>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm h-100" style={{ backgroundColor: '#bebebe' }}>
              <div className="card-body">
                <h5 className="card-title text-secondary">Program Unggulan</h5>
                <p className="card-text">Pelajari lebih lanjut tentang program unggulan yang sedang kami jalankan.</p>
                <a href="/program" className="btn btn-secondary">Lihat Program</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {struktur && (
        <div className="flow-chart mt-5">
          <h1>STRUKTUR ORGANISASI</h1>
          <div className="node">
            <div className="org-box">Ketua: {struktur.ketua}</div>
            <div className="line"></div>
            <div className="org-row">
              <div className="org-box">Wakil Ketua: {struktur.wakil}</div>
              <div className="org-box">Sekretaris: {struktur.sekretaris}</div>
              <div className="org-box">Bendahara: {struktur.bendahara}</div>
            </div>
            <div className="line"></div>
            <div className="org-row">
              <div className="org-box">Koordinator Sosial: {struktur.koordinatorSosial}</div>
              <div className="org-box">Koordinator Budaya: {struktur.koordinatorBudaya}</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 text-center">
        <h3>Alamat Karang Taruna</h3>
        <p>
          Kp. Dungus Maung RW 008, Desa Cikuya, Kecamatan Cicalengka, Kabupaten Bandung, Provinsi Jawa Barat, 40395
        </p>
      </div>
    </div>
  );
};

export default Home;