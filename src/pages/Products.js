import React from "react";
import { useNavigate } from "react-router-dom";

function Products() {
  const navigate = useNavigate(); // ใช้ navigate เพื่อเปลี่ยนหน้า

  // รายการสินค้าพร้อมราคา
  const products = [
    { id: 1, name: "PAPER PLANES : ONE PERCENT T-SHIRT", image: "https://img.lazcdn.com/g/p/e2681c7524766b4cb90905ea1dfe300c.jpg_720x720q80.jpg_.webp", price: 690 },
    { id: 2, name: "URTHE - เสื้อยืด Oversize เเขนสั้น รุ่น CD-ROM TEE", image: "https://img.lazcdn.com/g/p/147f03b78ff3c2f3a2061eb98b048e0d.jpg_720x720q80.jpg_.webp", price: 650 },
    { id: 3, name: "URTHE - เสื้อยืด แขนกุด สกรีนลาย Col. FUR24", image: "https://img.lazcdn.com/g/p/20d2047e31d9992da9c9a6745882cfcf.jpg_720x720q80.jpg_.webp", price: 350 },
    { id: 4, name: "URTHE - เสื้อกล้าม Col. DARKWAVE รุ่น DW GALATIC CENTER", image: "https://img.lazcdn.com/g/p/a1b54c6bb34a27d2511e3c3ff7457e46.jpg_720x720q80.jpg_.webp", price: 490 },
    { id: 5, name: "URTHE - เสื้อฮู้ด เเขนยาว รุ่น 3D METAL JK", image: "https://img.lazcdn.com/g/p/322a9992c0029b3f63f4a932b352333d.jpg_720x720q80.jpg_.webp", price: 890 },
    { id: 6, name: "URTHE - เสื้อยืด เเขนสั้น สกรีนลาย รุ่น BAT TM", image: "https://img.lazcdn.com/g/p/078e9c45fd9b2fc419be49621232d467.jpg_720x720q80.jpg_.webp", price: 200 },
    { id: 7, name: "URTHE - เสื้อแจ็คเก็ต เเขนยาว Oversize รุ่น BWWB JK", image: "https://img.lazcdn.com/g/p/85da1b56f2fe32bb76c0f7faf1f561de.jpg_720x720q80.jpg_.webp", price: 890 }
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">สินค้าของเรา</h2>
      <div className="row">
        {products.map(product => (
          <div className="col-md-2 mb-4" key={product.id}>
            {/* คลิกที่การ์ดเพื่อไปยังหน้าสินค้า */}
            <div className="card h-100 shadow-sm d-flex flex-column" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: "pointer" }}>
              <img 
                src={product.image} 
                alt={product.name} 
                className="card-img-top" 
                style={{ 
                  objectFit: 'cover', // ทำให้ภาพไม่ยืดหรือบีบ
                  height: '200px', // ตั้งความสูงให้เท่ากัน
                  width: '100%' // ตั้งความกว้างให้เต็มการ์ด
                }} 
              />
              <div className="card-body d-flex flex-column justify-content-between text-center">
                <h5 className="card-title">{product.name}</h5>
                <p className="text-danger fw-bold mb-0 ">฿{product.price.toLocaleString()}</p> {/* ราคาล่างสุด */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
