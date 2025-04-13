import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Keanggotaan = () => {
  const [struktur, setStruktur] = useState(null);

  const fetchContent = async () => {
    try {
      const strukturDoc = await getDoc(doc(db, 'homeContent', 'strukturOrganisasi'));
      if (strukturDoc.exists()) {
        const data = strukturDoc.data();
        setStruktur(data);
        localStorage.setItem('struktur', JSON.stringify(data));
      }
    } catch (error) {
      console.error("Gagal mengambil data struktur:", error);
    }
  };

  useEffect(() => {
    const storedStruktur = localStorage.getItem('struktur');
    if (storedStruktur) {
      setStruktur(JSON.parse(storedStruktur));
    } else {
      fetchContent();
    }
  }, []);

  return (
        <div className="container mt-5">
        <h2 className="fw-bold  text-center text-dark">Keanggotaan</h2>
      {struktur ? (
        <div className="flow-chart">
          <h1 className="mb-4 text-center text-dark mt-5">STRUKTUR ORGANISASI</h1>
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
      ) : (
        <p className="text-center">Memuat struktur organisasi...</p>
      )}
    </div>
  );
};

export default Keanggotaan;
