import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLoginModalOpen = () => setShowLoginModal(true);
  const handleLoginModalClose = () => setShowLoginModal(false);
  const handleRegisterModalOpen = () => setShowRegisterModal(true);
  const handleRegisterModalClose = () => setShowRegisterModal(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container d-flex justify-content-between align-items-center">
        {/* โลโก้ */}
        <Link className="navbar-brand" to="/">MyShop</Link>

        {/* แถบค้นหาอยู่ตรงกลาง */}
        <form className="d-flex flex-grow-1 justify-content-center" style={{ maxWidth: "800px" }}>
          <input 
            className="form-control me-2" 
            type="search" 
            placeholder="ค้นหาสินค้า..." 
            aria-label="Search" 
          />
          <button className="btn " type="submit">ค้นหา</button>
        </form>

        {/* เมนูด้านขวา */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">หน้าแรก</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/cart">ตะกร้าสินค้า</Link>
          </li>

          {/* เพิ่มปุ่ม Login และ Register */}
          <li className="nav-item">
            <button className="nav-link btn  me-2" onClick={handleLoginModalOpen}>
              Login
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link btn " onClick={handleRegisterModalOpen}>
              Register
            </button>
          </li>
        </ul>
      </div>

      {/* Login Modal */}
      <div className={`modal fade ${showLoginModal ? "show" : ""}`} style={{ display: showLoginModal ? "block" : "none", backgroundColor: "rgba(0, 0, 0, 0.6)" }} tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered"> {/* ใช้ modal-dialog-centered เพื่อให้แสดงตรงกลาง */}
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">Login</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleLoginModalClose}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">อีเมล</label>
                  <input type="email" className="form-control" id="loginEmail" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">รหัสผ่าน</label>
                  <input type="password" className="form-control" id="loginPassword" required />
                </div>
                <button type="submit" className="btn btn-primary w-100">เข้าสู่ระบบ</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      <div className={`modal fade ${showRegisterModal ? "show" : ""}`} style={{ display: showRegisterModal ? "block" : "none", backgroundColor: "rgba(0, 0, 0, 0.6)" }} tabIndex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered"> {/* ใช้ modal-dialog-centered เพื่อให้แสดงตรงกลาง */}
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="registerModalLabel">Register</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleRegisterModalClose}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="registerEmail" className="form-label">อีเมล</label>
                  <input type="email" className="form-control" id="registerEmail" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerPassword" className="form-label">รหัสผ่าน</label>
                  <input type="password" className="form-control" id="registerPassword" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerConfirmPassword" className="form-label">ยืนยันรหัสผ่าน</label>
                  <input type="password" className="form-control" id="registerConfirmPassword" required />
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
