import React, { useState, useContext, useEffect } from "react";
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
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState(""); // State สำหรับยืนยันรหัสผ่าน
  const [registerStatus, setRegisterStatus] = useState("active");

  // State for logged-in user
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLoginModalOpen = () => setShowLoginModal(true);
  const handleLoginModalClose = () => setShowLoginModal(false);
  const handleRegisterModalOpen = () => setShowRegisterModal(true);
  const handleRegisterModalClose = () => setShowRegisterModal(false);

  // Fetch logged-in user from localStorage if available
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      const token = userData.token;
      if (token) {
        const username = userData.email.split('@')[0];
        setLoggedInUser({ email: userData.email, username: username });
      } else {
        console.log("No token found!");
      }
    }
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    const data = await response.json();
    if (response.ok) {
      // Store user data and token in localStorage
      localStorage.setItem('user', JSON.stringify({ email: loginEmail, token: data.token }));
      alert(data.message);
      const username = loginEmail.split('@')[0]; // Extract username from email
      setLoggedInUser({ email: loginEmail, username: username });
      handleLoginModalClose();
    } else {
      alert(data.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่ารหัสผ่านและยืนยันรหัสผ่านตรงกัน
    if (registerPassword !== registerPasswordConfirm) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    // เช็คว่าอีเมลมีอยู่แล้วในระบบ
    const responseEmailCheck = await fetch("http://localhost:3000/check-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: registerEmail }),
    });
    const emailCheckData = await responseEmailCheck.json();
    if (!responseEmailCheck.ok || emailCheckData.exists) {
      alert("อีเมลนี้ถูกใช้แล้ว กรุณาใช้ email อื่น");
      return;
    }

    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName: registerFullName,
        email: registerEmail,
        phone: registerPhone,
        address: registerAddress,
        password: registerPassword
      })
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      handleRegisterModalClose();
    } else {
      alert(data.error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data from localStorage
    setLoggedInUser(null); // Clear the logged-in user from the state

    // Clear login and register form fields
    setLoginEmail('');
    setLoginPassword('');
    setRegisterFullName('');
    setRegisterEmail('');
    setRegisterPhone('');
    setRegisterAddress('');
    setRegisterPassword('');
    setRegisterPasswordConfirm(''); // ลบค่าของยืนยันรหัสผ่าน
    setRegisterStatus('active');
  };

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">MyShop</Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">หน้าแรก</Link>
          </li>
          {loggedInUser ? (
            <>
              <li className="nav-item">
                <span className="nav-link text-white">Hello, {loggedInUser.username}</span> {/* Show username instead of email */}
              </li>
              <li className="nav-item">
                <button className="nav-link btn" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <button className="nav-link btn me-2" onClick={handleLoginModalOpen}>Login</button>
              </li>
              <li className="nav-item">
                <button className="nav-link btn" onClick={handleRegisterModalOpen}>Register</button>
              </li>
            </>
          )}
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
              <h5 className="modal-title">สมัครสมาชิก</h5>
              <button type="button" className="btn-close" onClick={handleRegisterModalClose}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleRegisterSubmit}>
                <div className="mb-3">
                  <label className="form-label">ชื่อ-นามสกุล</label>
                  <input type="text" className="form-control" required value={registerFullName} onChange={(e) => setRegisterFullName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">อีเมล</label>
                  <input type="email" className="form-control" required value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">เบอร์โทรศัพท์</label>
                  <input type="text" className="form-control" value={registerPhone} onChange={(e) => setRegisterPhone(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">ที่อยู่</label>
                  <textarea className="form-control" rows="3" value={registerAddress} onChange={(e) => setRegisterAddress(e.target.value)}></textarea>
                </div>
                <div className="mb-3 position-relative">
                  <label className="form-label">รหัสผ่าน</label>
                  <input type={showRegisterPassword ? "text" : "password"} className="form-control" required value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} />
                  <button type="button" className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y" onClick={() => setShowRegisterPassword(!showRegisterPassword)}>
                    {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="mb-3 position-relative">
                  <label className="form-label">ยืนยันรหัสผ่าน</label>
                  <input type={showConfirmPassword ? "text" : "password"} className="form-control" required value={registerPasswordConfirm} onChange={(e) => setRegisterPasswordConfirm(e.target.value)} />
                  <button type="button" className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
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
