import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";

const Produk = () => {
  const [produkList, setProdukList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [alamat, setAlamat] = useState("");
  const [noWA, setNoWA] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [notification, setNotification] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");

  const fetchProduk = async () => {
    try {
      const snapshot = await getDocs(collection(db, "produk"));
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((p) => p.stok > 0 && p.status === "tersedia");
      setProdukList(data);
    } catch (err) {
      console.error("Gagal memuat produk:", err);
    }
  };

  const handleBeli = async (produk) => {
    setSelectedProduct(produk);
    setQuantity(1);
    setDeliveryOption("pickup");
    setAlamat("");
    setNoWA("");
    calculateTotal(produk.harga, 1, "pickup");
  
    // Ambil alamat penjual (dari field produk misal "alamatPenjual")
    if (produk.lokasiPenjual) { // pastikan nama field sesuai
      setSellerAddress(produk.lokasiPenjual); // Simpan alamat penjual
    } else {
      // fallback jika perlu fetch seller detail dari koleksi "users"
      try {
        const sellerDoc = await getDoc(doc(db, "users", produk.penjualId));
        if (sellerDoc.exists()) {
          const data = sellerDoc.data();
          setSellerAddress(data.alamat || "Alamat tidak ditemukan");
        }
      } catch (err) {
        console.error("Gagal ambil alamat penjual:", err);
        setSellerAddress("Alamat tidak tersedia");
      }
    }
  
    setShowModal(true);
  };
  

  const calculateTotal = (harga, jumlah, opsiPengiriman) => {
    const dasar = harga * jumlah;
    const biayaKirim = opsiPengiriman === "delivery" ? 1000 : 0;
    setTotalPrice(dasar + biayaKirim);
  };

  const handleQuantityChange = (e) => {
    const jumlahBaru = parseInt(e.target.value) || 1;
    setQuantity(jumlahBaru);
    calculateTotal(selectedProduct.harga, jumlahBaru, deliveryOption);
  };

  const handleDeliveryOptionChange = (e) => {
    const opsi = e.target.value;
    setDeliveryOption(opsi);
    calculateTotal(selectedProduct.harga, quantity, opsi);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedProduct || quantity <= 0) {
      setNotification("Jumlah produk tidak valid.");
      return;
    }
  
    // Cek apakah stok mencukupi
    if (selectedProduct.stok < quantity) {
      setNotification(`Stok ${selectedProduct.nama} tidak mencukupi.`);
      return;
    }
  
    try {
      const produkRef = doc(db, "produk", selectedProduct.id);
  
      await updateDoc(produkRef, {
        stok: selectedProduct.stok - quantity,
        status: "dibeli",
      });
  
      const pembelianData = {
        produkId: selectedProduct.id,
        nama: selectedProduct.nama,
        jumlah: quantity,
        totalHarga: totalPrice,
        deliveryOption,
        alamat: deliveryOption === "delivery" ? alamat : sellerAddress,
        noWA: deliveryOption === "delivery" ? noWA : "",
        status: "Menunggu Konfirmasi Admin",
        waktu: new Date(),
      };
  
      await addDoc(collection(db, "pembelian"), pembelianData);
  
      await addDoc(collection(db, "manageproduk"), {
        ...pembelianData,
        produkRef: produkRef,
        proses: "Menunggu Konfirmasi Admin",
      });
  
      setNotification(`Produk ${selectedProduct.nama} berhasil dibeli!`);
      setShowModal(false);
      fetchProduk(); // reload produk
    } catch (err) {
      console.error("Gagal beli produk:", err);
      setNotification("Terjadi kesalahan saat membeli.");
    }
  };
  

  useEffect(() => {
    fetchProduk();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center text-dark">Daftar Produk</h2>

      {notification && (
        <div className="alert alert-info text-center">{notification}</div>
      )}

      <div className="row">
        {produkList.length === 0 ? (
          <div className="alert alert-info text-center">
            Belum ada produk tersedia.
          </div>
        ) : (
          produkList.map((produk) => (
            <div className="col-md-4 mb-4" key={produk.id}>
              <div className="card h-100 shadow-sm">
                {produk.image && (
                  <img
                    src={produk.image}
                    alt={produk.nama}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{produk.nama}</h5>
                  <p className="text-muted">Rp {produk.harga}</p>
                  <p className="text-muted">Stok: {produk.stok}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleBeli(produk)}
                  >
                    Beli
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && selectedProduct && (
  <div className="modal d-block" tabIndex="-1" role="dialog">
    <div className="modal-dialog" role="document">
      <div className="modal-content shadow-lg">
        <div className="modal-header">
          <h5 className="modal-title">Beli: {selectedProduct.nama}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
          ></button>
        </div>

        <div className="modal-body">
          <div className="mb-2">
            <label>Jumlah:</label>
            <input
              type="number"
              className="form-control"
              min="1"
              max={selectedProduct.stok}
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>

          <div className="mb-2">
            <label>Pengiriman:</label>
            <select
              className="form-select"
              value={deliveryOption}
              onChange={handleDeliveryOptionChange}
            >
              <option value="pickup">Ambil Langsung</option>
              <option value="delivery">Antar</option>
            </select>
          </div>

          {deliveryOption === "pickup" && (
            <div className="mb-2">
              <label>Alamat Penjual:</label>
              <p className="text-muted">{sellerAddress}</p>
            </div>
          )}

          {deliveryOption === "delivery" && (
            <>
              <div className="mb-2">
                <label>Alamat:</label>
                <input
                  type="text"
                  className="form-control"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label>Nomor WA:</label>
                <input
                  type="text"
                  className="form-control"
                  value={noWA}
                  onChange={(e) => setNoWA(e.target.value)}
                />
              </div>
            </>
          )}

          <p className="fw-bold mt-3">Total: Rp {totalPrice}</p>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-success"
            onClick={handleConfirmPurchase}
          >
            Konfirmasi Beli
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Produk;
