import { useEffect, useState } from "react";
import { collection, addDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

const ManageKeuangan = () => {
  const [keuanganList, setKeuanganList] = useState([]);
  const [keterangan, setKeterangan] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [tipe, setTipe] = useState("pemasukan");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const keuanganRef = collection(db, "keuangan");

  const fetchKeuangan = async () => {
    const snapshot = await getDocs(keuanganRef);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setKeuanganList(data);
  };

  useEffect(() => {
    fetchKeuangan();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keterangan || !jumlah || isNaN(jumlah)) {
      alert("Isi data dengan benar ya, sayang 😘");
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      await addDoc(keuanganRef, {
        keterangan,
        jumlah: Number(jumlah),
        tipe,
        tanggal: new Date().toISOString(),
      });

      setSuccessMessage("Data keuangan berhasil ditambahkan 💰✨");
      setKeterangan("");
      setJumlah("");
      setTipe("pemasukan");
      fetchKeuangan();
    } catch (error) {
      console.error("Gagal menambahkan data keuangan:", error);
      alert("Ada masalah waktu menyimpan, coba lagi yaa 😢");
    }

    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Yakin mau hapus data ini, ayang?");
    if (!confirm) return;

    await deleteDoc(doc(db, "keuangan", id));
    fetchKeuangan();
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-darky">Kelola Keuangan</h2>
        <p className="text-muted">Catatan pemasukan dan pengeluaran Karang Taruna</p>
      </div>

      {/* Notifikasi sukses */}
      {successMessage && (
        <div className="alert alert-success text-center" role="alert">
          {successMessage}
        </div>
      )}

      {/* Form Tambah */}
      <form onSubmit={handleSubmit} className="row g-3 mb-5">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Keterangan"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Jumlah"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={tipe}
            onChange={(e) => setTipe(e.target.value)}
          >
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Tambah"}
          </button>
        </div>
      </form>

      {/* Daftar Keuangan */}
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th>Keterangan</th>
              <th>Jumlah</th>
              <th>Tipe</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {keuanganList.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted py-3">
                  Belum ada data keuangan.
                </td>
              </tr>
            ) : (
              keuanganList.map((item) => (
                <tr key={item.id}>
                  <td>{item.keterangan}</td>
                  <td>Rp {item.jumlah.toLocaleString("id-ID")}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.tipe === "pemasukan" ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {item.tipe}
                    </span>
                  </td>
                  <td>{new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageKeuangan;
