import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const Keuangan = () => {
  const [keuanganList, setKeuanganList] = useState([]);
  const [totalMasuk, setTotalMasuk] = useState(0);
  const [totalKeluar, setTotalKeluar] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchKeuangan = async () => {
    try {
      const snapshot = await getDocs(collection(db, "keuangan"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const totals = data.reduce(
        (acc, item) => {
          const jumlah = Number(item.jumlah);
          if (["pemasukan", "masuk"].includes(item.tipe?.toLowerCase())) {
            acc.masuk += jumlah;
          }
          if (["pengeluaran", "keluar"].includes(item.tipe?.toLowerCase())) {
            acc.keluar += jumlah;
          }
          return acc;
        },
        { masuk: 0, keluar: 0 }
      );

      setKeuanganList(data);
      setTotalMasuk(totals.masuk);
      setTotalKeluar(totals.keluar);
    } catch (error) {
      console.error("Gagal memuat data keuangan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeuangan();
  }, []);

  const pemasukan = keuanganList.filter(
    (item) => ["pemasukan", "masuk"].includes(item.tipe?.toLowerCase())
  );
  const pengeluaran = keuanganList.filter(
    (item) => ["pengeluaran", "keluar"].includes(item.tipe?.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4 text-center text-dark">Laporan Keuangan</h2>

      {loading ? (
        <div className="alert alert-warning text-center">Sedang memuat data...</div>
      ) : (
        <>
          <div
            className="mb-4 p-4 text-white rounded-4 shadow"
            style={{
              background: "linear-gradient(135deg, #2b5876, #4e4376)",
              borderRadius: "20px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              fontFamily: "'Segoe UI', sans-serif",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: "150px",
                height: "150px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
                zIndex: 0,
              }}
            />
            <div className="position-relative" style={{ zIndex: 1 }}>
              <h5 className="fw-bold mb-4">Rekap Keuangan</h5>
              <p className="fw-semibold" style={{ color: "#00ffcc" }}>
                Total Pemasukan: Rp {totalMasuk.toLocaleString("id-ID")}
              </p>
              <p className="fw-semibold" style={{ color: "#ff6666" }}>
                Total Pengeluaran: Rp {totalKeluar.toLocaleString("id-ID")}
              </p>
              <p className="fw-semibold" style={{ color: "#ffff66" }}>
                Saldo: Rp {(totalMasuk - totalKeluar).toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <h3 className="fw-bold mb-4 text-center text-dark">Daftar Pemasukan</h3>
          {pemasukan.length === 0 ? (
            <div className="alert alert-info">Belum ada data pemasukan.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped mt-3">
                <thead className="table-success">
                  <tr>
                    <th>Deskripsi</th>
                    <th>Jumlah (Rp)</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {pemasukan.map((item) => (
                    <tr key={item.id}>
                      <td>{item.keterangan}</td>
                      <td>{Number(item.jumlah).toLocaleString("id-ID")}</td>
                      <td>{new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h3 className="fw-bold mb-4 text-center text-dark">Daftar Pengeluaran</h3>
          {pengeluaran.length === 0 ? (
            <div className="alert alert-info">Belum ada data pengeluaran.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped mt-3">
                <thead className="table-danger">
                  <tr>
                    <th>Deskripsi</th>
                    <th>Jumlah (Rp)</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {pengeluaran.map((item) => (
                    <tr key={item.id}>
                      <td>{item.keterangan}</td>
                      <td>{Number(item.jumlah).toLocaleString("id-ID")}</td>
                      <td>{new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Keuangan;
