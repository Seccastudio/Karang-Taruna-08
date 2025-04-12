import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const ManageProgram = () => {
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [image, setImage] = useState("");
  const [programList, setProgramList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchProgram = async () => {
    const snapshot = await getDocs(collection(db, "program"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProgramList(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!judul || !deskripsi || !image) {
      alert("Harap lengkapi semua field!");
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      await addDoc(collection(db, "program"), {
        judul,
        deskripsi,
        image,
      });

      setSuccessMessage("Program berhasil ditambahkan!");
      setJudul("");
      setDeskripsi("");
      setImage("");
      fetchProgram();
    } catch (error) {
      console.error("Gagal menambahkan program:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }

    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Yakin ingin menghapus program ini?");
    if (!confirm) return;

    await deleteDoc(doc(db, "program", id));
    fetchProgram();
  };

  useEffect(() => {
    fetchProgram();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Manage Program Unggulan</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Judul Program</label>
          <input
            type="text"
            className="form-control"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Deskripsi</label>
          <textarea
            className="form-control"
            rows="3"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Gambar</label>
          <textarea
            className="form-control"
            rows="3"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Masukkan url gambar..."
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Tambah Program"}
        </button>
      </form>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      <h5>Daftar Program:</h5>
      {programList.length === 0 ? (
        <div className="alert alert-info">Belum ada program yang ditambahkan.</div>
      ) : (
        <ul className="list-group">
          {programList.map((item) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={item.id}
            >
              {item.judul}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(item.id)}
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageProgram;
