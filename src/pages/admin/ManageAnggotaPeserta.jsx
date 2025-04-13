import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ManageAnggotaPeserta = () => {
  const [anggotaList, setAnggotaList] = useState([]);
  const [pesertaList, setPesertaList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editType, setEditType] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const anggotaSnapshot = await getDocs(collection(db, 'pendaftaranKeanggotaan'));
    const pesertaSnapshot = await getDocs(collection(db, 'pendaftaranProgram'));
    setAnggotaList(anggotaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setPesertaList(pesertaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id, type) => {
    const ref = doc(db, type === 'anggota' ? 'pendaftaranKeanggotaan' : 'pendaftaranProgram', id);
    await deleteDoc(ref);
    fetchData();
  };

  const handleEdit = (data, type) => {
    setEditData(data);
    setEditType(type);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const ref = doc(db, editType === 'anggota' ? 'pendaftaranKeanggotaan' : 'pendaftaranProgram', editData.id);
    await updateDoc(ref, editData);
    setShowModal(false);
    fetchData();
  };

  const renderCard = (data, type) => (
    <div className="card mb-3 shadow-sm" key={data.id}>
      <div className="card-body">
        <h5 className="card-title">{type === 'anggota' ? data.nama : data.namaPeserta}</h5>
        <p className="card-text">
          {type === 'anggota' ? (
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
          <button className="btn btn-sm btn-warning" onClick={() => handleEdit(data, type)}>Edit</button>
          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(data.id, type)}>Hapus</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-5">Manajemen Anggota & Peserta Program</h2>
      <div className="row">
        <div className="col-md-6">
          <h4 className="mb-3 text-primary">Daftar Anggota</h4>
          {anggotaList.length > 0 ? anggotaList.map(anggota => renderCard(anggota, 'anggota')) : <p>Belum ada anggota.</p>}
        </div>
        <div className="col-md-6">
          <h4 className="mb-3 text-success">Daftar Peserta Program</h4>
          {pesertaList.length > 0 ? pesertaList.map(peserta => renderCard(peserta, 'peserta')) : <p>Belum ada peserta.</p>}
        </div>
      </div>

      {/* Modal Manual Bootstrap */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit {editType === 'anggota' ? 'Anggota' : 'Peserta'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  {editType === 'anggota' ? (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Nama</label>
                        <input name="nama" className="form-control" value={editData?.nama || ''} onChange={handleModalChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input name="email" className="form-control" value={editData?.email || ''} onChange={handleModalChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Alamat</label>
                        <textarea name="alamat" className="form-control" value={editData?.alamat || ''} onChange={handleModalChange}></textarea>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Nama Peserta</label>
                        <input name="namaPeserta" className="form-control" value={editData?.namaPeserta || ''} onChange={handleModalChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Program</label>
                        <input name="program" className="form-control" value={editData?.program || ''} onChange={handleModalChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Nomor HP</label>
                        <input name="hp" className="form-control" value={editData?.hp || ''} onChange={handleModalChange} />
                      </div>
                    </>
                  )}
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button className="btn btn-primary" onClick={handleUpdate}>Simpan Perubahan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAnggotaPeserta;
