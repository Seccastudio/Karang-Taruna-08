import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const ProgramUnggulan = () => {
  const [programList, setProgramList] = useState([]);
  const [mentorList, setMentorList] = useState([]);
  const [showFullText, setShowFullText] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch Program
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
      setLoading(false);
    }
  };

  // Fetch Pembimbing
  const fetchMentor = async () => {
    try {
      const snapshot = await getDocs(collection(db, "pembimbing"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMentorList(data);
    } catch (error) {
      console.error("Gagal memuat data pembimbing:", error);
    }
  };

  useEffect(() => {
    fetchProgram();
    fetchMentor();
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
      <div className="row">
        {/* Kolom Kiri: Program */}
        <div className="col-lg-9">
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
                        <button
                          className="btn btn-primary mb-3"
                          onClick={() => navigate("/pendaftaran")}
                        >
                          Daftar
                        </button>
                        <h5 className="card-title fw-semibold">
                          {item.judul}
                        </h5>
                        <p className="card-text text-muted">{displayText}</p>
                        {isLongText && (
                          <button
                            className="btn btn-sm btn-link p-0"
                            onClick={() => toggleText(item.id)}
                          >
                            {isExpanded
                              ? "Sembunyikan"
                              : "Baca selengkapnya"}
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

        {/* Sidebar Kanan: Pembimbing */}
        <div className="col-lg-3">
          <h5 className="mb-3 text-dark">Profil Pembimbing</h5>
          {mentorList.length === 0 ? (
            <p className="text-muted">Belum ada data pembimbing.</p>
          ) : (
            mentorList.map((mentor) => (
              <div className="card mb-3" key={mentor.id}>
                {mentor.foto && (
                  <img
                    src={mentor.foto}
                    alt={mentor.nama}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h6 className="card-title mb-1">{mentor.nama}</h6>
                  <p className="text-muted small mb-1">
                    <strong>Pembimbing:</strong> {mentor.program}
                  </p>
                  <p className="card-text small">{mentor.profil}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramUnggulan;
