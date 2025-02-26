import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";

// ใช้ lazy loading สำหรับคอมโพเนนต์
const Navbar = lazy(() => import("./components/Navbar"));
const Home = lazy(() => import("./pages/Home"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));

function App() {
  return (
    <CartProvider>
      <Router>
        <Suspense fallback={<div>กำลังโหลด...</div>}>
          <Navbar />
          <div className="container mt-5">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </div>
        </Suspense>
      </Router>
    </CartProvider>
  );
}

export default App;
