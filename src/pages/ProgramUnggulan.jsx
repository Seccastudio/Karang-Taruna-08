import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const ProgramUnggulan = () => {
  const [programList, setProgramList] = useState([]);
  const [showFullText, setShowFullText] = useState({});
  const [loading, setLoading] = useState(true); // Tambahkan loading

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const snapshot = await getDocs(collection(db, "program"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProgramList(data);
      } catch (error) {
        console.error("Gagal memuat program unggulan:", error);
      } finally {
        setLoading(false); // Akhiri loading
      }
    };

    fetchProgram();
  }, []);

  const toggleText = (id) => {
    setShowFullText((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const maxLength = 150;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center text-dark">Program Unggulan</h2>
      <div className="row g-4">
        {loading ? (
          <div className="alert alert-warning text-center">
            Sedang memuat data...
          </div>
        ) : programList.length === 0 ? (
          <div className="alert alert-info text-center">
            Belum ada program unggulan.
          </div>
        ) : (
          programList.map((item) => {
            const isLongText = item.deskripsi.length > maxLength;
            const isExpanded = showFullText[item.id];
            const displayText =
              isExpanded || !isLongText
                ? item.deskripsi
                : item.deskripsi.slice(0, maxLength) + "...";

            return (
              <div className="col-md-6 col-lg-4" key={item.id}>
                <div className="card h-100 shadow-sm border-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.judul}
                      className="card-img-top"
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title fw-semibold">{item.judul}</h5>
                    <p className="card-text text-muted">{displayText}</p>
                    {isLongText && (
                      <button
                        className="btn btn-sm btn-link p-0"
                        onClick={() => toggleText(item.id)}
                      >
                        {isExpanded ? "Sembunyikan" : "Baca selengkapnya"}
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

export default ProgramUnggulan;
