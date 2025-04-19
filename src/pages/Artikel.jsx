import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Link } from "react-router-dom";

const MAX_LENGTH = 150;

const Artikel = () => {
  const [artikelList, setArtikelList] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    };

    fetchArtikel();
  }, []);

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
            const deskripsiPreview =
              item.deskripsi.length > MAX_LENGTH
                ? item.deskripsi.slice(0, MAX_LENGTH) + "..."
                : item.deskripsi;

            return (
              <div className="col-md-6 col-lg-4" key={item.id}>
                <Link
                  to={`/artikel/${item.id}`}
                  className="text-decoration-none text-dark"
                >
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
                      <h5 className="card-title fw-semibold">
                        {item.headline}
                      </h5>
                      <p className="card-text text-muted">
                        {deskripsiPreview}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Artikel;
