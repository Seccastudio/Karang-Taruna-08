import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const Kegiatan = () => {
  const [kegiatanList, setKegiatanList] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true); // tambahkan state loading

  const fetchKegiatan = async () => {
    try {
      const snapshot = await getDocs(collection(db, "kegiatan"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setKegiatanList(data);
    } catch (error) {
      console.error("Gagal mengambil data kegiatan:", error);
    } finally {
      setLoading(false); // pastikan loading selesai setelah fetch
    }
  };

  useEffect(() => {
    fetchKegiatan();
  }, []);

  const toggleExpanded = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark">Daftar Kegiatan Karang Taruna</h2>
        <p className="text-muted">Informasi kegiatan yang sedang dan akan dilaksanakan</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Memuat data kegiatan...</p>
        </div>
      ) : kegiatanList.length === 0 ? (
        <div className="alert alert-info text-center">
          Belum ada kegiatan yang tersedia.
        </div>
      ) : (
        <div className="row g-4">
          {kegiatanList.map((item) => {
            const isExpanded = expanded[item.id];
            const shortDescription = item.deskripsi.length > 150
              ? item.deskripsi.substring(0, 150) + "..."
              : item.deskripsi;

            return (
              <div className="col-md-6 col-lg-4" key={item.id}>
                <div className="card h-100 shadow-sm border-0">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.judul}
                      className="card-img-top"
                      style={{ width: "350px", height: "250px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">{item.judul}</h5>
                    <p className="card-text text-secondary">
                      {isExpanded ? item.deskripsi : shortDescription}
                    </p>
                    {item.deskripsi.length > 150 && (
                      <button
                        className="btn btn-link p-0"
                        onClick={() => toggleExpanded(item.id)}
                      >
                        {isExpanded ? "Sembunyikan" : "Baca Selengkapnya"}
                      </button>
                    )}
                  </div>
                  <div className="card-footer bg-white border-0 text-end">
                    <small className="text-muted">
                      🗓 {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Kegiatan;
