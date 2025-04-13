import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const ManageProduk = () => {
  const [produkList, setProdukList] = useState([]);
  const [statusSummary, setStatusSummary] = useState({
    total: 0,
    dibeli: 0,
    dikemas: 0,
    terkirim: 0,
  });
  const [notif, setNotif] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
    hargaDelivery: "",
    lokasiPenjual: "",
    image: "",
    stok: 1,
    status: "tersedia",
    deliveryType: "", // Menambah field untuk delivery type (pickup/delivery)
    alamat: "",      // Menambah field untuk alamat jika delivery
    nomorWA: "",     // Menambah field untuk nomor WA jika delivery
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchProduk = async () => {
    const snapshot = await getDocs(collection(db, "produk"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProdukList(data);

    const summary = {
      total: data.length,
      dibeli: data.filter((p) => p.status === "dibeli").length,
      dikemas: data.filter((p) => p.status === "dikemas").length,
      terkirim: data.filter((p) => p.status === "terkirim").length,
    };
    setStatusSummary(summary);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateDoc(doc(db, "produk", editId), {
          ...formData,
          harga: parseInt(formData.harga),
          hargaDelivery: parseInt(formData.hargaDelivery),
          stok: parseInt(formData.stok),
        });
        alert("Produk berhasil diperbarui!");
      } else {
        await addDoc(collection(db, "produk"), {
          ...formData,
          harga: parseInt(formData.harga),
          hargaDelivery: parseInt(formData.hargaDelivery),
          stok: parseInt(formData.stok),
        });
        alert("Produk berhasil ditambahkan!");
      }

      resetForm();
      fetchProduk();
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      alert("Gagal menyimpan produk.");
    }
  };

  const handleEdit = (produk) => {
    setFormData({
      nama: produk.nama,
      deskripsi: produk.deskripsi,
      harga: produk.harga,
      hargaDelivery: produk.hargaDelivery,
      lokasiPenjual: produk.lokasiPenjual,
      image: produk.image,
      stok: produk.stok,
      status: produk.status || "tersedia",
      deliveryType: produk.deliveryType || "", // Mengisi data deliveryType jika ada
      alamat: produk.alamat || "",             // Mengisi data alamat jika ada
      nomorWA: produk.nomorWA || "",           // Mengisi data nomor WA jika ada
    });
    setEditId(produk.id);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      await deleteDoc(doc(db, "produk", id));
      fetchProduk();
    }
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      deskripsi: "",
      harga: "",
      hargaDelivery: "",
      lokasiPenjual: "",
      image: "",
      stok: 1,
      status: "tersedia",
      deliveryType: "",
      alamat: "",
      nomorWA: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "produk", id), { status: newStatus });
    fetchProduk();
  };

  const handleKonfirmasi = async (produk) => {
    if (produk.status === "dibeli") {
      await updateStatus(produk.id, "dikemas");
    } else if (produk.status === "dikemas") {
      await updateStatus(produk.id, "terkirim");
    }
  };

  const handleTolak = async (produk) => {
    await updateStatus(produk.id, "tersedia");
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center text-dark">Manage Produk (Masih dalam pengembangan)</h2>

      {/* Notifikasi Pembelian */}
      {notif && <div className="alert alert-success">{notif}</div>}

      {/* Produk dibeli / dikemas */}
      {(produkList.some(p => p.status === "dibeli" || p.status === "dikemas")) && (
        <div className="mb-4">
          <h5 className="fw-semibold">Notifikasi Pembelian</h5>
          <div className="row">
            {produkList
              .filter((p) => p.status === "dibeli" || p.status === "dikemas")
              .map((produk) => (
                <div className="col-md-4 mb-3" key={produk.id}>
                  <div className="card shadow-sm">
                    {produk.image && (
                      <img
                        src={produk.image}
                        alt={produk.nama}
                        className="card-img-top"
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{produk.nama}</h5>
                      <p className="text-muted">Status: {produk.status}</p>

                      {/* Menampilkan informasi tambahan */}
                      {produk.status === "dibeli" && (
                        <div className="alert alert-info">
                          <p><strong>Opsi Pengiriman:</strong> {produk.deliveryType}</p>
                          {produk.deliveryType === "delivery" && (
                            <div>
                              <p><strong>Alamat:</strong> {produk.alamat}</p>
                              <p><strong>Nomor WA:</strong> {produk.nomorWA}</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleKonfirmasi(produk)}
                        >
                          Konfirmasi
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleTolak(produk)}
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Form Produk */}
      <div className="card mb-4">
        <div className="card-header fw-semibold">
          {isEditing ? "Edit Produk" : "Tambah Produk"}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nama Produk</label>
                <input
                  type="text"
                  name="nama"
                  className="form-control"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Harga</label>
                <input
                  type="number"
                  name="harga"
                  className="form-control"
                  value={formData.harga}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Harga Delivery</label>
                <input
                  type="number"
                  name="hargaDelivery"
                  className="form-control"
                  value={formData.hargaDelivery}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Stok</label>
                <input
                  type="number"
                  name="stok"
                  className="form-control"
                  value={formData.stok}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  className="form-control"
                  rows="3"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Lokasi Penjual</label>
                <input
                  type="text"
                  name="lokasiPenjual"
                  className="form-control"
                  value={formData.lokasiPenjual}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Gambar (URL)</label>
                <input
                  type="text"
                  name="image"
                  className="form-control"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="tersedia">Tersedia</option>
                  <option value="dibeli">Dibeli</option>
                  <option value="dikemas">Dikemas</option>
                  <option value="terkirim">Terkirim</option>
                </select>
              </div>

              {/* Menampilkan input alamat dan nomor WA jika delivery */}
              {formData.deliveryType === "delivery" && (
                <>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Alamat</label>
                    <input
                      type="text"
                      name="alamat"
                      className="form-control"
                      value={formData.alamat}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nomor WA</label>
                    <input
                      type="text"
                      name="nomorWA"
                      className="form-control"
                      value={formData.nomorWA}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}
            </div>

            <div className="d-flex justify-content-between">
              {/* <button type="submit" className="btn btn-primary">
                {isEditing ? "Perbarui Produk" : "Tambah Produk"}
              </button> */}
              {/* {isEditing && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Batal
                </button>
              )} */}
            </div>
          </form>
        </div>
      </div>

      {/* Daftar Produk */}
      <div className="card">
        <div className="card-header fw-semibold">Daftar Produk</div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Harga</th>
                <th>Status</th>
                <th>Opsi</th>
              </tr>
            </thead>
            <tbody>
              {produkList.map((produk) => (
                <tr key={produk.id}>
                  <td>{produk.nama}</td>
                  <td>{produk.harga}</td>
                  <td>{produk.status}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(produk)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDelete(produk.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageProduk;
