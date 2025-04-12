import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [jumlahKegiatan, setJumlahKegiatan] = useState(0);
  const [jumlahKeuangan, setJumlahKeuangan] = useState(0);
  const [jumlahArtikel, setJumlahArtikel] = useState(0);
  const [jumlahProgram, setJumlahProgram] = useState(0);

  const [headlineText, setHeadlineText] = useState('');
  const [headlineImage, setHeadlineImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const [struktur, setStruktur] = useState({
    ketua: '', wakil: '', sekretaris: '', bendahara: '',
    koordinatorSosial: '', koordinatorBudaya: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const kegiatanSnapshot = await getDocs(collection(db, "kegiatan"));
      const keuanganSnapshot = await getDocs(collection(db, "keuangan"));
      const artikelSnapshot = await getDocs(collection(db, "artikel"));
      const programSnapshot = await getDocs(collection(db, "program"));

      setJumlahKegiatan(kegiatanSnapshot.size);
      setJumlahKeuangan(keuanganSnapshot.size);
      setJumlahArtikel(artikelSnapshot.size);
      setJumlahProgram(programSnapshot.size);

      const headlineDoc = await getDoc(doc(db, 'homeContent', 'headline'));
      const strukturDoc = await getDoc(doc(db, 'homeContent', 'strukturOrganisasi'));

      if (headlineDoc.exists()) {
        const data = headlineDoc.data();
        setHeadlineText(data.text || '');
        setHeadlineImage(data.image || '');
        setImagePreview(data.image || '');
      }

      if (strukturDoc.exists()) setStruktur(strukturDoc.data());
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      alert("Mengkonversi gambar ke Base64, mohon tunggu...");
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeadlineImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveChanges = async () => {
    await setDoc(doc(db, 'homeContent', 'headline'), {
      text: headlineText,
      image: headlineImage
    });

    await setDoc(doc(db, 'homeContent', 'strukturOrganisasi'), struktur);
    alert("Perubahan berhasil disimpan!");
  };

  if (loading) return <div className="text-center my-5">Sedang memuat data...</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 fw-bold">Dashboard Admin</h2>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Jumlah Kegiatan</h5>
              <p className="card-text fs-1">{jumlahKegiatan}</p>
              <p className="card-text">Total kegiatan yang telah dicatat oleh admin.</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Jumlah Catatan Keuangan</h5>
              <p className="card-text fs-1">{jumlahKeuangan}</p>
              <p className="card-text">Total transaksi keuangan yang tercatat.</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-white bg-dark h-100">
            <div className="card-body">
              <h5 className="card-title">Jumlah Artikel</h5>
              <p className="card-text fs-1">{jumlahArtikel}</p>
              <p className="card-text">Total Artikel yang dibuat.</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-white bg-danger h-100">
            <div className="card-body">
              <h5 className="card-title">Jumlah Program</h5>
              <p className="card-text fs-1">{jumlahProgram}</p>
              <p className="card-text">Total program yang tercatat.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
      <h3 className="fw-bold mb-4 text-center text-dark">Edit Headline & Struktur Organisasi</h3>

        <div className="mb-3">
          <label className="form-label">Headline</label>
          <input
            type="text"
            className="form-control"
            value={headlineText}
            onChange={(e) => setHeadlineText(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Gambar Headline</label>
          <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="img-fluid mt-2" style={{ maxWidth: "300px" }} />
          )}
        </div>

        <div className="row">
          {Object.entries(struktur).map(([key, value]) => (
            <div className="col-md-6 mb-3" key={key}>
              <label className="form-label text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="text"
                className="form-control"
                value={value}
                onChange={(e) => setStruktur({ ...struktur, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        <button className="btn btn-primary" onClick={saveChanges}>
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
