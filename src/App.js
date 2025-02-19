import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// คอมโพเนนต์ที่ใช้งานในแอพ
import Navbar from "./components/Navbar"; 
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";

function App() {
  return (
    <Router>
      {/* แถบเมนูนำทาง */}
      <Navbar />

      {/* เนื้อหาหลักของแอพ */}
      <div className="container mt-5">
        <Routes>
          {/* การตั้งค่าเส้นทางของหน้า */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
