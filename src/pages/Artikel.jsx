import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const MAX_LENGTH = 150;

const Artikel = () => {
  const [artikelList, setArtikelList] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [loading, setLoading] = useState(true); // Tambahkan state loading

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const snapshot = await getDocs(collection(db, "artikel"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArtikelList(data);
      } catch (error) {
        console.error("Gagal memuat data artikel:", error);
      } finally {
        setLoading(false); // Akhiri loading setelah data diambil
      }
    };

    fetchArtikel();
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center text-dark">Artikel Terbaru</h2>
      <div className="row g-4">
        {loading ? (
          <div className="alert alert-warning text-center">
            Sedang memuat data...
          </div>
        ) : artikelList.length === 0 ? (
          <div className="alert alert-info text-center">
            Belum ada artikel yang tersedia.
          </div>
        ) : (
          artikelList.map((item) => {
            const isExpanded = expandedIds.includes(item.id);
            const isLongText = item.deskripsi.length > MAX_LENGTH;
            const deskripsiPreview = isExpanded
              ? item.deskripsi
              : item.deskripsi.slice(0, MAX_LENGTH) + (isLongText ? "..." : "");

            return (
              <div className="col-md-6 col-lg-4" key={item.id}>
                <div className="card h-100 shadow-sm border-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.headline}
                      className="card-img-top"
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">{item.headline}</h5>
                    <p className="card-text text-muted">{deskripsiPreview}</p>
                    {isLongText && (
                      <button
                        className="btn btn-link p-0"
                        onClick={() => toggleExpand(item.id)}
                      >
                        {isExpanded ? "Sembunyikan" : "Baca Selengkapnya"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Artikel;
