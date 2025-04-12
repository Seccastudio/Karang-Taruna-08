import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const ManageArtikel = () => {
  const [headline, setHeadline] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [image, setImage] = useState("");
  const [artikelList, setArtikelList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchArtikel = async () => {
    const snapshot = await getDocs(collection(db, "artikel"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setArtikelList(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!headline || !deskripsi || !image) {
      alert("Lengkapi semua field!");
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      if (editId) {
        const artikelRef = doc(db, "artikel", editId);
        await updateDoc(artikelRef, { headline, deskripsi, image });
        setSuccessMessage("Artikel berhasil diperbarui!");
        setEditId(null);
      } else {
        await addDoc(collection(db, "artikel"), { headline, deskripsi, image });
        setSuccessMessage("Artikel berhasil ditambahkan!");
      }

      setHeadline("");
      setDeskripsi("");
      setImage("");
      fetchArtikel();
    } catch (error) {
      console.error("Gagal menyimpan artikel:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }

    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Yakin ingin menghapus artikel ini?");
    if (!confirm) return;

    await deleteDoc(doc(db, "artikel", id));
    fetchArtikel();
  };

  const handleEdit = (item) => {
    setHeadline(item.headline);
    setDeskripsi(item.deskripsi);
    setImage(item.image);
    setEditId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchArtikel();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold text-dark">
        {editId ? "Edit Artikel" : "Manage Artikel"}
      </h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Headline</label>
          <input
            type="text"
            className="form-control"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Judul artikel..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Deskripsi</label>
          <textarea
            className="form-control"
            rows="3"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Isi singkat artikel..."
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Link Gambar</label>
          <input
            type="text"
            className="form-control"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="URL gambar artikel..."
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary me-2"
          disabled={isLoading}
        >
          {isLoading
            ? editId
              ? "Menyimpan perubahan..."
              : "Menyimpan data..."
            : editId
            ? "Update Artikel"
            : "Simpan Artikel"}
        </button>

        {editId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setEditId(null);
              setHeadline("");
              setDeskripsi("");
              setImage("");
            }}
          >
            Batal Edit
          </button>
        )}
      </form>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      <h4 className="fw-semibold mt-5 mb-3">Artikel yang sudah ada</h4>

      {artikelList.length === 0 ? (
        <div className="alert alert-info" role="alert">
          Belum ada artikel yang ditambahkan. Silakan buat artikel baru.
        </div>
      ) : (
        <ul className="list-group">
          {artikelList.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div>
                <strong>{item.headline}</strong> -{" "}
                {item.deskripsi.slice(0, 40)}...
              </div>
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(item.id)}
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageArtikel;
