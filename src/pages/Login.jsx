import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(60); // dalam detik

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isLocked && lockTimer > 0) {
      timer = setInterval(() => {
        setLockTimer((prev) => prev - 1);
      }, 1000);
    } else if (lockTimer === 0) {
      setIsLocked(false);
      setAttempts(0);
      setLockTimer(60);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockTimer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (isLocked) {
      setError(`Terlalu banyak percobaan. Coba lagi dalam ${lockTimer} detik.`);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Login failed:", err.message);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setIsLocked(true);
        setError("Terlalu banyak percobaan gagal. Akun dikunci selama 1 menit.");
      } else {
        setError(`Email atau password salah! Percobaan ke-${newAttempts}/3`);
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-4">
          <h4 className="mt-3 fw-semibold">Login Admin</h4>
        </div>
        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLocked}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLocked}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={isLocked}>
            {isLocked ? `Tunggu ${lockTimer} detik...` : "Login"}
          </button>
        </form>
        <div className="text-center text-muted mt-4" style={{ fontSize: "0.85rem" }}>
          Karang Taruna DungusMaung
        </div>
      </div>
    </div>
  );
};

export default Login;
