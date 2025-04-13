import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Home = () => {
  const [headline, setHeadline] = useState('');
  const [headlineImage, setHeadlineImage] = useState('');
  const [pengunjungHariIni, setPengunjungHariIni] = useState(0);

  const tanggalAwal = new Date('2025-04-01');
  const pengunjungAwal = 100;
  const pertambahanPerHari = 22;

  const hitungPengunjungHariIni = () => {
    const sekarang = new Date();
    const selisihHari = Math.floor((sekarang - tanggalAwal) / (1000 * 60 * 60 * 24));
    return pengunjungAwal + (selisihHari * pertambahanPerHari);
  };

  const fetchContent = async () => {
    const headlineDoc = await getDoc(doc(db, 'homeContent', 'headline'));

    if (headlineDoc.exists()) {
      const data = headlineDoc.data();
      setHeadline(data.text || '');
      setHeadlineImage(data.image || '');
      localStorage.setItem('headline', JSON.stringify({ text: data.text, image: data.image }));
    }
  };

  useEffect(() => {
    const storedHeadline = localStorage.getItem('headline');

    if (storedHeadline) {
      const headlineData = JSON.parse(storedHeadline);
      setHeadline(headlineData.text);
      setHeadlineImage(headlineData.image);
    } else {
      fetchContent();
    }

    // Hitung pengunjung hari ini
    setPengunjungHariIni(hitungPengunjungHariIni());
  }, []);

  return (
    <div className="container mt-5">
      <div className="row">
        {/* KONTEN UTAMA */}
        <div className="col-lg-9">
          <h4 className="display-5 fw-bold text-dark me-4">{headline}</h4>
          {headlineImage && (
            <div className="flex-shrink-0 mb-3 mb-md-0">
              <img
                src={headlineImage}
                alt="Headline"
                className="img-fluid"
                style={{ width: '900px', height: 'auto' }}
              />
            </div>
          )}

          <p className="lead mt-3 text-dark">
            Portal informasi kegiatan & transparansi keuangan untuk warga dan pengurus Karang Taruna tercinta.
          </p>

          <h2 className="text-dark mb-4">Informasi</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card shadow-sm h-100" style={{ backgroundColor: '#bebebe' }}>
                <div className="card-body">
                  <h5 className="card-title text-success">Informasi Kegiatan</h5>
                  <p className="card-text">
                    Temukan berbagai kegiatan sosial, budaya, dan kepemudaan yang telah dan akan kami laksanakan.
                  </p>
                  <a href="/kegiatan" className="btn btn-success">Lihat Kegiatan</a>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm h-100" style={{ backgroundColor: '#bebebe' }}>
                <div className="card-body">
                  <h5 className="card-title text-primary">Informasi Keuangan</h5>
                  <p className="card-text">
                    Laporan pemasukan & pengeluaran dana secara transparan dan terpercaya.
                  </p>
                  <a href="/keuangan" className="btn btn-primary text-white">Lihat Keuangan</a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <h2 className="text-dark mb-4">Konten Menarik Lainnya</h2>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card shadow-sm h-100" style={{ backgroundColor: '#bebebe' }}>
                  <div className="card-body">
                    <h5 className="card-title text-danger">Artikel Inspiratif</h5>
                    <p className="card-text">
                      Baca artikel menarik tentang pengembangan pemuda dan kegiatan sosial.
                    </p>
                    <a href="/artikel" className="btn btn-danger">Baca Artikel</a>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card shadow-sm h-100" style={{ backgroundColor: '#bebebe' }}>
                  <div className="card-body">
                    <h5 className="card-title text-secondary">Program Unggulan</h5>
                    <p className="card-text">
                      Pelajari lebih lanjut tentang program unggulan yang sedang kami jalankan.
                    </p>
                    <a href="/program" className="btn btn-secondary">Lihat Program</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="col-lg-3">
          <div style={{ position: 'sticky', top: '70px' }}>
            <div className="card shadow-sm mb-5">
              <div className="card-header bg-info text-white">
                <h5 className="card-title">Pengunjung hari ini</h5>
              </div>
              <div className="card-body">
                <p className="card-text">
                  {pengunjungHariIni} Pengunjung
                </p>
              </div>
            </div>

            <div className="card shadow-sm mb-5">
              <div className="card-header bg-info text-white">
                <strong>Navigasi</strong>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item"><a href="/kegiatan">➤ Kegiatan</a></li>
                <li className="list-group-item"><a href="/keuangan">➤ Keuangan</a></li>
                <li className="list-group-item"><a href="/artikel">➤ Artikel</a></li>
                <li className="list-group-item"><a href="/program">➤ Program</a></li>
              </ul>
            </div>

            <div className="card shadow-sm mb-5">
              <div className="card-header bg-info text-white">
                <h5 className="card-title">Daftar Anggota</h5>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Kamu ingin menjadi bagian dari karang taruna RW08? Bergabunglah bersama kami dan berkontribusi untuk masyarakat.
                </p>
                <button className="btn btn-primary">Daftar</button>
              </div>
            </div>

            <div className="card shadow-sm mb-5">
              <div className="card-header bg-info text-white">
                <h5 className="card-title">Tentang Kami</h5>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Karang Taruna RW08 merupakan wadah generasi muda untuk berkarya dan berkontribusi positif bagi masyarakat.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* SIDEBAR END */}
      </div>
    </div>
  );
};

export default Home;
