import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaEye, FaEyeSlash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { CartContext } from "../contexts/CartContext";

function Navbar() {
  const { cart } = useContext(CartContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerAddress, setRegisterAddress] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerStatus, setRegisterStatus] = useState("active");

  const handleLoginModalOpen = () => setShowLoginModal(true);
  const handleLoginModalClose = () => setShowLoginModal(false);
  const handleRegisterModalOpen = () => setShowRegisterModal(true);
  const handleRegisterModalClose = () => setShowRegisterModal(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      // Save token or perform other actions like redirecting
    } else {
      alert(data.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: registerFullName,
        email: registerEmail,
        phone: registerPhone,
        address: registerAddress,
        password: registerPassword,
        status: registerStatus,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      handleRegisterModalClose();
    } else {
      alert(data.error);
    }
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">MyShop</Link>
        <form className="d-flex flex-grow-1 justify-content-center" style={{ maxWidth: "800px" }}>
          <input className="form-control me-2" type="search" placeholder="ค้นหาสินค้า..." aria-label="Search" />
          <button className="btn btn-light" type="submit">ค้นหา</button>
        </form>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">หน้าแรก</Link>
          </li>
          <li className="nav-item">
            <button className="nav-link btn me-2" onClick={handleLoginModalOpen}>Login</button>
          </li>
          <li className="nav-item">
            <button className="nav-link btn" onClick={handleRegisterModalOpen}>Register</button>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/cart">
              <div className="position-relative">
                <FaShoppingCart size={30} />
                {totalQuantity > 0 && (
                  <span className="badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle">
                    {totalQuantity}
                  </span>
                )}
              </div>
            </Link>
          </li>
        </ul>
      </div>

      {/* Login Modal */}
      <div className={`modal fade ${showLoginModal ? "show" : ""}`} style={{ display: showLoginModal ? "block" : "none", backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Login</h5>
              <button type="button" className="btn-close" onClick={handleLoginModalClose}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-3">
                  <label className="form-label">อีเมล</label>
                  <input type="email" className="form-control" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>
                <div className="mb-3 position-relative">
                  <label className="form-label">รหัสผ่าน</label>
                  <div className="input-group">
                    <input type={showLoginPassword ? "text" : "password"} className="form-control" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowLoginPassword(!showLoginPassword)}>
                      {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">เข้าสู่ระบบ</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      <div className={`modal fade ${showRegisterModal ? "show" : ""}`} style={{ display: showRegisterModal ? "block" : "none", backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Register</h5>
              <button type="button" className="btn-close" onClick={handleRegisterModalClose}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleRegisterSubmit}>
                <div className="mb-3">
                  <label className="form-label">ชื่อผู้ใช้</label>
                  <input type="text" className="form-control" required value={registerFullName} onChange={(e) => setRegisterFullName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">เบอร์โทร</label>
                  <input type="tel" className="form-control" required value={registerPhone} onChange={(e) => setRegisterPhone(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">ที่อยู่</label>
                  <input type="text" className="form-control" required value={registerAddress} onChange={(e) => setRegisterAddress(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">อีเมล</label>
                  <input type="email" className="form-control" required value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                </div>
                <div className="mb-3 position-relative">
                  <label className="form-label">รหัสผ่าน</label>
                  <div className="input-group">
                    <input type={showRegisterPassword ? "text" : "password"} className="form-control" required value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowRegisterPassword(!showRegisterPassword)}>
                      {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div className="mb-3 position-relative">
                  <label className="form-label">ยืนยันรหัสผ่าน</label>
                  <div className="input-group">
                    <input type={showConfirmPassword ? "text" : "password"} className="form-control" required />
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">สมัครสมาชิก</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
