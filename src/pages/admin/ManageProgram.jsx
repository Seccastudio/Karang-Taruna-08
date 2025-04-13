import { useEffect, useState, useRef } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const ManageProgram = () => {
  const topRef = useRef(null);

  // State program
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [image, setImage] = useState("");
  const [programList, setProgramList] = useState([]);
  const [editingProgramId, setEditingProgramId] = useState(null);

  // State pembimbing
  const [namaPembimbing, setNamaPembimbing] = useState("");
  const [profilPembimbing, setProfilPembimbing] = useState("");
  const [fotoPembimbing, setFotoPembimbing] = useState("");
  const [programYangDibimbing, setProgramYangDibimbing] = useState("");
  const [pembimbingList, setPembimbingList] = useState([]);
  const [editingPembimbingId, setEditingPembimbingId] = useState(null);

  const fetchProgram = async () => {
    const snapshot = await getDocs(collection(db, "program"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProgramList(data);
  };

  const fetchPembimbing = async () => {
    const snapshot = await getDocs(collection(db, "pembimbing"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPembimbingList(data);
  };

  useEffect(() => {
    fetchProgram();
    fetchPembimbing();
  }, []);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitProgram = async (e) => {
    e.preventDefault();
    if (!judul || !deskripsi || !image) {
      alert("Harap lengkapi semua field program!");
      return;
    }

    if (editingProgramId) {
      await updateDoc(doc(db, "program", editingProgramId), {
        judul,
        deskripsi,
        image,
      });
      setEditingProgramId(null);
    } else {
      await addDoc(collection(db, "program"), {
        judul,
        deskripsi,
        image,
      });
    }

    setJudul("");
    setDeskripsi("");
    setImage("");
    fetchProgram();
  };

  const handleEditProgram = (program) => {
    setJudul(program.judul);
    setDeskripsi(program.deskripsi);
    setImage(program.image);
    setEditingProgramId(program.id);
    scrollToTop();
  };

  const handleDeleteProgram = async (id) => {
    if (window.confirm("Yakin ingin menghapus program ini?")) {
      await deleteDoc(doc(db, "program", id));
      fetchProgram();
    }
  };

  const handleSubmitPembimbing = async (e) => {
    e.preventDefault();
    if (!namaPembimbing || !profilPembimbing || !fotoPembimbing || !programYangDibimbing) {
      alert("Harap lengkapi semua field pembimbing!");
      return;
    }

    if (editingPembimbingId) {
      await updateDoc(doc(db, "pembimbing", editingPembimbingId), {
        nama: namaPembimbing,
        profil: profilPembimbing,
        foto: fotoPembimbing,
        program: programYangDibimbing,
      });
      setEditingPembimbingId(null);
    } else {
      await addDoc(collection(db, "pembimbing"), {
        nama: namaPembimbing,
        profil: profilPembimbing,
        foto: fotoPembimbing,
        program: programYangDibimbing,
      });
    }

    setNamaPembimbing("");
    setProfilPembimbing("");
    setFotoPembimbing("");
    setProgramYangDibimbing("");
    fetchPembimbing();
  };

  const handleEditPembimbing = (pembimbing) => {
    setNamaPembimbing(pembimbing.nama);
    setProfilPembimbing(pembimbing.profil);
    setFotoPembimbing(pembimbing.foto);
    setProgramYangDibimbing(pembimbing.program);
    setEditingPembimbingId(pembimbing.id);
    scrollToTop();
  };

  const handleDeletePembimbing = async (id) => {
    if (window.confirm("Yakin ingin menghapus pembimbing ini?")) {
      await deleteDoc(doc(db, "pembimbing", id));
      fetchPembimbing();
    }
  };

  return (
    <div className="container py-5">
      <div ref={topRef}></div>
      <h2 className="fw-bold mb-4">Manage Program Unggulan & Pembimbing</h2>

      <div className="row">
        {/* Form Program */}
        <div className="col-md-6 mb-4">
          <h5>{editingProgramId ? "Edit Program" : "Form Program Unggulan"}</h5>
          <form onSubmit={handleSubmitProgram}>
            <div className="mb-3">
              <label className="form-label">Judul Program</label>
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
              <label className="form-label">Gambar (URL)</label>
              <input
                type="text"
                className="form-control"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingProgramId ? "Update Program" : "Tambah Program"}
            </button>
          </form>
        </div>

        {/* Form Pembimbing */}
        <div className="col-md-6 mb-4">
          <h5>{editingPembimbingId ? "Edit Pembimbing" : "Form Profil Pembimbing Program"}</h5>
          <form onSubmit={handleSubmitPembimbing}>
            <div className="mb-3">
              <label className="form-label">Nama Pembimbing</label>
              <input
                type="text"
                className="form-control"
                value={namaPembimbing}
                onChange={(e) => setNamaPembimbing(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Profil / Bio</label>
              <textarea
                className="form-control"
                rows="3"
                value={profilPembimbing}
                onChange={(e) => setProfilPembimbing(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Foto (URL)</label>
              <input
                type="text"
                className="form-control"
                value={fotoPembimbing}
                onChange={(e) => setFotoPembimbing(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Program yang Dibimbing</label>
              <input
                type="text"
                className="form-control"
                value={programYangDibimbing}
                onChange={(e) => setProgramYangDibimbing(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-success">
              {editingPembimbingId ? "Update Pembimbing" : "Tambah Pembimbing"}
            </button>
          </form>
        </div>
      </div>

      {/* List Program */}
      <h5 className="mt-4">Daftar Program:</h5>
      {programList.length === 0 ? (
        <div className="alert alert-info">Belum ada program yang ditambahkan.</div>
      ) : (
        <ul className="list-group mb-4">
          {programList.map((item) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={item.id}
            >
              <span>{item.judul}</span>
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEditProgram(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteProgram(item.id)}
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* List Pembimbing */}
      <h5 className="mt-4">Daftar Pembimbing Program:</h5>
      {pembimbingList.length === 0 ? (
        <div className="alert alert-warning">Belum ada pembimbing ditambahkan.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {pembimbingList.map((pembimbing) => (
            <div className="col" key={pembimbing.id}>
              <div className="card h-100 shadow-sm">
                {pembimbing.foto && (
                  <img
                    src={pembimbing.foto}
                    alt={pembimbing.nama}
                    className="card-img-top"
                    style={{ objectFit: "cover", height: "180px" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{pembimbing.nama}</h5>
                  <p className="card-text">{pembimbing.profil}</p>
                  <p className="text-muted small">
                    <strong>Program Dibimbing:</strong> {pembimbing.program}
                  </p>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditPembimbing(pembimbing)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeletePembimbing(pembimbing.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProgram;
