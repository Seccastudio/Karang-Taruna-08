import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ManageKegiatan = () => {
  const [kegiatanList, setKegiatanList] = useState([]);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(true); // Track loading state
  const [dataKosong, setDataKosong] = useState(false); // Track if there is no data

  const kegiatanRef = collection(db, "kegiatan");

  const fetchKegiatan = async () => {
    setLoading(true);
    const snapshot = await getDocs(kegiatanRef);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setKegiatanList(data);
    setDataKosong(data.length === 0); // Set dataKosong to true if no data exists
    setLoading(false);
  };

  useEffect(() => {
    fetchKegiatan();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul || !deskripsi || !tanggal) return;

    let imageUrl = previewURL;
    if (imageFile) {
      imageUrl = await toBase64(imageFile);
    }

    if (editMode) {
      const docRef = doc(db, "kegiatan", editId);
      await updateDoc(docRef, {
        judul,
        deskripsi,
        tanggal,
        imageUrl,
      });
      setEditMode(false);
      setEditId(null);
    } else {
      await addDoc(kegiatanRef, {
        judul,
        deskripsi,
        tanggal,
        imageUrl,
      });
    }

    setJudul("");
    setDeskripsi("");
    setTanggal("");
    setImageFile(null);
    setPreviewURL("");
    fetchKegiatan();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "kegiatan", id));
    fetchKegiatan();
  };

  const handleEdit = (item) => {
    setJudul(item.judul);
    setDeskripsi(item.deskripsi);
    setTanggal(item.tanggal);
    setPreviewURL(item.imageUrl || "");
    setEditId(item.id);
    setEditMode(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold">🛠️ Kelola Kegiatan</h2>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <label className="form-label">Judul Kegiatan</label>
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
          <label className="form-label">Tanggal Kegiatan</label>
          <input
            type="date"
            className="form-control"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Gambar (opsional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewURL && (
            <img
              src={previewURL}
              alt="Preview"
              className="mt-2 rounded shadow"
              style={{ height: "150px", objectFit: "cover" }}
            />
          )}
        </div>

        <button
          type="submit"
          className={`btn ${editMode ? "btn-warning" : "btn-success"}`}
        >
          {editMode ? "Update Kegiatan" : "Tambah Kegiatan"}
        </button>
      </form>

      {/* Loading and Empty Data Notification */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Memuat data kegiatan...</p>
        </div>
      ) : dataKosong ? (
        <div className="alert alert-info text-center" role="alert">
          Belum ada data kegiatan ditambahkan.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {kegiatanList.map((item) => (
            <div className="col" key={item.id}>
              <div className="card shadow-sm h-100">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    className="card-img-top"
                    alt={item.judul}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{item.judul}</h5>
                  <p className="card-text">{item.deskripsi}</p>
                </div>
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Tanggal: {new Date(item.tanggal).toLocaleDateString()}
                  </small>
                  <div>
                    <button
                      onClick={() => handleEdit(item)}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageKegiatan;
