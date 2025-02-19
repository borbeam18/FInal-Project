import React from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Products from "./Products"; // นำเข้าไฟล์ Products.js

function Home() {
  return (
    <div className="container mt-5 pt-5"> {/* เพิ่ม pt-5 ป้องกัน Navbar บัง */}
      <div className="row align-items-center">
        {/* คอลัมน์ซ้าย - แสดงรูปภาพสินค้า */}
        <div className="col-md-6">
        <Carousel className="mb-4">
        <Carousel.Item interval={3000}> {/* เปลี่ยนรูปทุก 3 วิ */}
          <img
            className="d-block w-100 rounded shadow"
            src="https://th-test-11.slatic.net/shop/131c7b4b1f37b316d9d329dcf7fb32c2.png"
            alt="Slide 1"
          />
        </Carousel.Item>
        <Carousel.Item interval={3000}> {/* เปลี่ยนรูปทุก 3 วิ */}
          <img
            className="d-block w-100 rounded shadow"
            src="https://th-test-11.slatic.net/shop/16ae4b02d05af285fdb24368f5116039.png"
            alt="Slide 2"
          />
        </Carousel.Item>
        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100 rounded shadow"
            src="https://th-test-11.slatic.net/shop/e4d4dc8b71880583befaf6ad7fdcbe9b.png"
            alt="Slide 3"
          />
        </Carousel.Item>
        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100 rounded shadow"
            src="https://th-test-11.slatic.net/shop/d138896fe10c4f3b9b11a7888374c8d8.png"
            alt="Slide 4"
          />
        </Carousel.Item>
        <Carousel.Item interval={3000}>
          <img
            className="d-block w-100 rounded shadow"
            src="https://th-test-11.slatic.net/shop/da5b00e12bbce669385b83f16d32cb11.png"
            alt="Slide 5"
          />
        </Carousel.Item>
      </Carousel>
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
