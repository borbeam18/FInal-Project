import React from "react";
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();

  // ข้อมูลสินค้า (จำลอง)
  const products = [
    { id: 1, name: "PAPER PLANES : ONE PERCENT T-SHIRT", image: "https://img.lazcdn.com/g/p/e2681c7524766b4cb90905ea1dfe300c.jpg_720x720q80.jpg_.webp", description: "เสื้อยืดคุณภาพสูงจาก PAPER PLANES ดีไซน์สุดเท่ห์", price: 690 },
    { id: 2, name: "URTHE - เสื้อยืด Oversize เเขนสั้น รุ่น CD-ROM TEE", image: "https://img.lazcdn.com/g/p/147f03b78ff3c2f3a2061eb98b048e0d.jpg_720x720q80.jpg_.webp", description: "[ CD-ROM TEE ]เสื้อยืด เเขนสั้น ทรง Oversize สกรีนลาย แบรนด์ : URTHEวัสดุ : Cotton ขนาด : อก 46 นิ้ว / ยาว : 29 นิ้ว สี : ดำ / ขาว", price: 650 },
    { id: 3, name: "URTHE - เสื้อยืด แขนกุด สกรีนลาย Col. FUR24", image: "https://img.lazcdn.com/g/p/20d2047e31d9992da9c9a6745882cfcf.jpg_720x720q80.jpg_.webp", description: "เสื้อยืด แขนกุด สกรีนลาย แบรนด์ : URTHE วัสดุ : Cotton รุ่น FUR Amyas Amity Audrey ขนาด : อก 44 นิ้ว / ยาว 28 นิ้ว สี : ดำ ราคา : 350 บาท รุ่นFUR Alva Augustus Azura ขนาด : อก 46 นิ้ว / ยาว 28 นิ้ว สี : ขาว", price: 350 },
    { id: 4, name: "URTHE - เสื้อกล้าม Col. DARKWAVE รุ่น DW GALATIC CENTER", image: "https://img.lazcdn.com/g/p/a1b54c6bb34a27d2511e3c3ff7457e46.jpg_720x720q80.jpg_.webp",description: "[ DW GALATIC CENTER ] เสื้อกล้าม แบรนด์ : URTHE วัสดุ : ผ้าสแปนเด็กซ์ ขนาด : อก 28-30 นิ้ว / ยาว 16 นิ้ว", price: 490 },
    { id: 5, name: "URTHE - เสื้อฮู้ด เเขนยาว รุ่น 3D METAL JK", image: "https://img.lazcdn.com/g/p/322a9992c0029b3f63f4a932b352333d.jpg_720x720q80.jpg_.webp",description: "| 3D METAL JK | เสื้อฮู้ด ผ้าฟอก Oversize *รุ่นสีดำ ซิปลอกเกิดจากการฟอกสีเสื้อ* แบรนด์ : URTHE วัสดุ : Cotton ขนาด : อก 52 นิ้ว / ยาว 26 นิ้ว สี : ดำ / เทา", price: 890 },
  ];

  // ค้นหาสินค้าจาก ID
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <h2 className="text-center mt-5 pt-5">ไม่พบสินค้าที่ต้องการ</h2>;
  }

  return (
    <div className="container mt-5 pt-5 ">
      <div className="row">
        {/* แสดงรูปสินค้า */}
        <div className="col-md-6">
          <img src={product.image} alt={product.name} className="img-fluid rounded shadow" />
        </div>
        
        {/* แสดงรายละเอียดสินค้า */}
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.description}</p>
          <h4 className="text-danger">ราคา: ฿{product.price.toLocaleString()}</h4>
          <button className="btn btn-success mt-3 w-100">เพิ่มลงตะกร้า</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
