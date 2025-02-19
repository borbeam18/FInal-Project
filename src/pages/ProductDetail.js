import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const products = [
    { id: 1, name: "PAPER PLANES : ONE PERCENT T-SHIRT", image: "https://img.lazcdn.com/g/p/e2681c7524766b4cb90905ea1dfe300c.jpg_720x720q80.jpg_.webp", description: "เสื้อยืดคุณภาพสูงจาก PAPER PLANES ดีไซน์สุดเท่ห์", price: 690 },
    { id: 2, name: "URTHE - เสื้อยืด Oversize เเขนสั้น รุ่น CD-ROM TEE", image: "https://img.lazcdn.com/g/p/147f03b78ff3c2f3a2061eb98b048e0d.jpg_720x720q80.jpg_.webp", description: "[ CD-ROM TEE ]เสื้อยืด เเขนสั้น ทรง Oversize สกรีนลาย", price: 650 },
    { id: 3, name: "URTHE - เสื้อยืด แขนกุด สกรีนลาย Col. FUR24", image: "https://img.lazcdn.com/g/p/20d2047e31d9992da9c9a6745882cfcf.jpg_720x720q80.jpg_.webp", description: "เสื้อยืด แขนกุด สกรีนลาย แบรนด์ : URTHE", price: 350 },
    { id: 4, name: "URTHE - เสื้อกล้าม Col. DARKWAVE รุ่น DW GALATIC CENTER", image: "https://img.lazcdn.com/g/p/a1b54c6bb34a27d2511e3c3ff7457e46.jpg_720x720q80.jpg_.webp", description: "[ DW GALATIC CENTER ] เสื้อกล้าม", price: 490 },
    { id: 5, name: "URTHE - เสื้อฮู้ด เเขนยาว รุ่น 3D METAL JK", image: "https://img.lazcdn.com/g/p/322a9992c0029b3f63f4a932b352333d.jpg_720x720q80.jpg_.webp", description: "| 3D METAL JK | เสื้อฮู้ด ผ้าฟอก Oversize", price: 890 },
    { id: 6, name: "URTHE - เสื้อยืด เเขนสั้น สกรีนลาย รุ่น BAT TM", image: "https://img.lazcdn.com/g/p/078e9c45fd9b2fc419be49621232d467.jpg_720x720q80.jpg_.webp",description: "[ BAT TM ] เสื้อยืด เเขนสั้น สกรีนลาย แบรนด์ : URTHE วัสดุ : Cotton ขนาด : อก 40-42 นิ้ว / ยาว 28 นิ้ว สี : ดำ / ขาว / เทา",price: 200 },
    { id: 7, name: "URTHE - เสื้อแจ็คเก็ต เเขนยาว Oversize รุ่น BWWB JK", image: "https://img.lazcdn.com/g/p/85da1b56f2fe32bb76c0f7faf1f561de.jpg_720x720q80.jpg_.webp",description: "[ BWWB JK ] เสื้อแจ็คเก็ต เเขนยาว Oversize แบรนด์ : URTHE วัสดุ : ไนลอน ขนาด : อก 52 นิ้ว / ยาว 26 นิ้ว สี : ดำ",price: 890 }
  ];

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <h2 className="text-center mt-5 pt-5">ไม่พบสินค้าที่ต้องการ</h2>;
  }

  // ฟังก์ชันเพิ่มจำนวนสินค้า
  const increaseQuantity = () => setQuantity(quantity + 1);

  // ฟังก์ชันลดจำนวนสินค้า
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} alt={product.name} className="img-fluid rounded shadow" />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">{product.description}</p>
          <h4 className="text-danger">ราคา: ฿{product.price.toLocaleString()}</h4>

          {/* เพิ่ม/ลดจำนวนสินค้า */}
          <div className="d-flex align-items-center mt-3">
            <button className="btn btn-outline-secondary" onClick={decreaseQuantity}>-</button>
            <span className="mx-3">{quantity}</span>
            <button className="btn btn-outline-secondary" onClick={increaseQuantity}>+</button>
          </div>

          <button
            className="btn btn-success mt-3 w-100"
            onClick={() => addToCart({ ...product, quantity })}
          >
            เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
