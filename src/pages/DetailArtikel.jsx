// pages/DetailArtikel.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Helmet } from "react-helmet";

const DetailArtikel = () => {
  const { id } = useParams();
  const [artikel, setArtikel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArtikel = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "artikel", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArtikel({ id: docSnap.id, ...docSnap.data() });
        } else {
          setArtikel(null);
        }
      } catch (error) {
        console.error("Gagal memuat artikel:", error);
        setArtikel(null);
      }
      setIsLoading(false);
    };

    fetchArtikel();
  }, [id]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-info text-center" role="alert">
          Sedang memuat artikel...
        </div>
      </div>
    );
  }

  if (!artikel) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-warning text-center" role="alert">
          Belum ada artikel yang ditambahkan.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Adding Helmet for SEO */}
      <Helmet>
        <title>{artikel.headline} - Karang Taruna 08</title>
        <meta name="description" content={artikel.deskripsi} />
        <meta property="og:title" content={artikel.headline} />
        <meta property="og:description" content={artikel.deskripsi} />
        <meta property="og:image" content={artikel.image} />
        <meta property="og:url" content={`https://karangtaruna08.vercel.app/article/${id}`} />
      </Helmet>

      <h2 className="fw-bold">{artikel.headline}</h2>
      <img src={artikel.image} alt={artikel.headline} className="img-fluid my-3" width={500} />
      <p>{artikel.deskripsi}</p>
    </div>
  );
};

export default DetailArtikel;
