import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Products from "./Products"; // นำเข้าไฟล์ Products.js

function Home() {
  return (
    <div className="container mt-5 pt-5"> {/* เพิ่ม pt-5 ป้องกัน Navbar บัง */}
      <div className="row align-items-center">
        {/* คอลัมน์ซ้าย - แสดงรูปภาพสินค้า */}
        <div className="col-md-6">
          <img
            src="https://via.placeholder.com/500x300"
            className="d-block w-100 rounded shadow"
            alt="Main Image"
          />
        </div>

        {/* คอลัมน์ขวา - ข้อความและปุ่มเลือกซื้อสินค้า */}
        <div className="col-md-6 text-center">
          <h1 className="fw-bold">ยินดีต้อนรับสู่ MyShop</h1>
          <p className="lead text-muted">ช้อปสินค้าเสื้อผ้าคุณภาพในราคาพิเศษ</p>
        </div>
      </div>

      {/* แสดงรายการสินค้า */}
      <Products />
    </div>
  );
}

export default Home;
