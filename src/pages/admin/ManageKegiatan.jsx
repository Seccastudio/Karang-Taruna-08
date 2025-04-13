import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

const ManageAnggotaPeserta = () => {
  const [anggotaList, setAnggotaList] = useState([]);
  const [pesertaList, setPesertaList] = useState([]);
  const [loadingAnggota, setLoadingAnggota] = useState(true); // Track loading anggota
  const [loadingPeserta, setLoadingPeserta] = useState(true); // Track loading peserta
  const [noAnggota, setNoAnggota] = useState(false); // Track jika data anggota kosong
  const [noPeserta, setNoPeserta] = useState(false); // Track jika data peserta kosong

  const anggotaRef = collection(db, "pendaftaranKeanggotaan");
  const pesertaRef = collection(db, "pendaftaranProgram");

  // Fetch data anggota dan peserta
  const fetchData = async () => {
    setLoadingAnggota(true);
    setLoadingPeserta(true);

    const anggotaSnapshot = await getDocs(anggotaRef);
    const pesertaSnapshot = await getDocs(pesertaRef);

    const anggotaData = anggotaSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const pesertaData = pesertaSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setAnggotaList(anggotaData);
    setPesertaList(pesertaData);

    // Cek apakah data kosong
    setNoAnggota(anggotaData.length === 0);
    setNoPeserta(pesertaData.length === 0);

    setLoadingAnggota(false);
    setLoadingPeserta(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id, type) => {
    const ref = doc(db, type === "anggota" ? "pendaftaranKeanggotaan" : "pendaftaranProgram", id);
    await deleteDoc(ref);
    fetchData();
  };

  const renderCard = (data, type) => (
    <div className="card mb-3 shadow-sm" key={data.id}>
      <div className="card-body">
        <h5 className="card-title">{type === "anggota" ? data.nama : data.namaPeserta}</h5>
        <p className="card-text">
          {type === "anggota" ? (
            <>
              <strong>Email:</strong> {data.email}<br />
              <strong>Alamat:</strong> {data.alamat}
            </>
          ) : (
            <>
              <strong>Program:</strong> {data.program}<br />
              <strong>Nomor HP:</strong> {data.hp}
            </>
          )}
        </p>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(data.id, type)}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-4">Manajemen Anggota & Peserta Program</h2>

      {/* Notifikasi Loading */}
      {loadingAnggota || loadingPeserta ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Memuat data...</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <h4 className="mb-3 text-primary">Daftar Anggota</h4>

            {/* Notifikasi Data Anggota Kosong */}
            {noAnggota ? (
              <div className="alert alert-info text-center" role="alert">
                Belum ada data anggota ditambahkan.
              </div>
            ) : (
              anggotaList.map((anggota) => renderCard(anggota, "anggota"))
            )}
          </div>

          <div className="col-md-6">
            <h4 className="mb-3 text-success">Daftar Peserta Program</h4>

            {/* Notifikasi Data Peserta Kosong */}
            {noPeserta ? (
              <div className="alert alert-info text-center" role="alert">
                Belum ada data peserta ditambahkan.
              </div>
            ) : (
              pesertaList.map((peserta) => renderCard(peserta, "peserta"))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAnggotaPeserta;
