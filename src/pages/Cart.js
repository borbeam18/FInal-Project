import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../contexts/CartContext";
import { Modal, Button } from "react-bootstrap"; // นำเข้า Modal และ Button จาก react-bootstrap
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate เพื่อย้ายหน้า
import '../App.css'; // นำเข้าไฟล์ CSS สำหรับจัดตำแหน่ง modal

function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
  const [showModal, setShowModal] = useState(false); // ใช้ state สำหรับแสดงหรือปิด Modal
  const [paymentMethod, setPaymentMethod] = useState("Credit Card"); // เก็บวิธีการชำระเงินที่เลือก
  const [selectedItems, setSelectedItems] = useState([]); // ตัวแปรเก็บการเลือกสินค้า
  const [paymentCompleted, setPaymentCompleted] = useState(false); // ใช้สำหรับตรวจสอบว่าการชำระเงินเสร็จหรือยัง
  const navigate = useNavigate(); // ใช้ navigate เพื่อเปลี่ยนหน้า

  // ฟังก์ชันเปิด Modal
  const handleShow = () => setShowModal(true);

  // ฟังก์ชันปิด Modal
  const handleClose = () => setShowModal(false);

  // ฟังก์ชันที่ใช้เมื่อผู้ใช้คลิกปุ่มชำระเงิน
  const handlePayment = () => {
    alert(`การชำระเงินเสร็จสมบูรณ์ผ่าน ${paymentMethod}`);
    setPaymentCompleted(true); // เปลี่ยนสถานะเป็นการชำระเงินเสร็จ
    setShowModal(false); // ปิด modal หลังจากการชำระเงิน
    // ลบสินค้าจากตะกร้า
    cart.forEach(item => removeFromCart(item.id));
  };

  // โหลดการเลือกสินค้าจาก localStorage เมื่อคอมโพเนนต์เริ่มต้น
  useEffect(() => {
    const savedSelections = JSON.parse(localStorage.getItem("selectedItems"));
    if (savedSelections) {
      setSelectedItems(savedSelections);
    } else {
      // หากไม่มีการบันทึกให้เลือกสินค้าทุกตัวในตะกร้าเป็น default
      setSelectedItems(cart.map(item => ({ id: item.id, selected: true })));
    }
  }, [cart]);

  // ฟังก์ชันสำหรับการเลือกสินค้า
  const toggleSelection = (id) => {
    setSelectedItems(prevState =>
      prevState.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // ฟังก์ชันสำหรับเลือกทั้งหมด
  const toggleSelectAll = () => {
    const allSelected = selectedItems.length === cart.length && selectedItems.every(item => item.selected);
    setSelectedItems(cart.map(item => ({ id: item.id, selected: !allSelected })));
  };

  // บันทึกการเลือกสินค้าลงใน localStorage ทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    if (selectedItems.length > 0) {
      localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    }
  }, [selectedItems]);

  // ฟังก์ชันการคำนวณราคาสินค้าเมื่อเลือก
  const selectedTotal = selectedItems.reduce((sum, item) => {
    const cartItem = cart.find(cartItem => cartItem.id === item.id);
    if (item.selected && cartItem) {
      return sum + cartItem.price * cartItem.quantity;
    }
    return sum;
  }, 0);

  // ฟังก์ชันที่ทำงานเมื่อเพิ่มสินค้าลงในตะกร้า
  useEffect(() => {
    if (cart.length > 0) {
      // ทำให้ทุกสินค้าที่เพิ่มใหม่ในตะกร้าถูกเลือก
      setSelectedItems((prevState) => {
        const updatedSelections = cart.map(item => {
          const existingItem = prevState.find(i => i.id === item.id);
          return existingItem ? existingItem : { id: item.id, selected: true };
        });
        return updatedSelections;
      });
    }
  }, [cart]); // ทุกครั้งที่ cart เปลี่ยนแปลง

  // ฟังก์ชันสำหรับย้ายไปยังหน้าแรก
  const handleGoHome = () => {
    navigate("/"); // เปลี่ยนหน้าไปที่หน้าแรก
  };

  return (
    <div className="container mt-5 pt-5">
      <h1>ตะกร้าสินค้า</h1>

      {cart.length === 0 || paymentCompleted ? (
        <>
          <p>{paymentCompleted ? "การชำระเงินเสร็จสมบูรณ์" : "ไม่มีสินค้าในตะกร้า"}</p>
          <button className="btn btn-warning" onClick={handleGoHome}>
            กรุณาเพิ่มสินค้า
          </button>
          {paymentCompleted && (
            <button 
            className="btn btn-info mt-3" 
            onClick={() => alert('ติดตามสถานะสินค้า')} 
            style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ติดตามสถานะสินค้า
          </button>
          )}
        </>
      ) : (
        <>
          <div>
            <input 
              type="checkbox" 
              checked={selectedItems.length === cart.length && selectedItems.every(item => item.selected)} 
              onChange={toggleSelectAll} 
            />
            <span>เลือกทั้งหมด</span>
          </div>
          <ul className="list-group">
            {cart.map((item) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                <div>
                  <input 
                    type="checkbox"
                    checked={selectedItems.find(i => i.id === item.id)?.selected || false}
                    onChange={() => toggleSelection(item.id)}
                  />
                  <span>{item.name} x {item.quantity}</span>
                </div>
                <span>{(item.price * item.quantity).toLocaleString()} บาท</span>
                <div>
                  <button className="btn btn-outline-secondary btn-sm mx-1" onClick={() => increaseQuantity(item.id)}>+</button>
                  <button className="btn btn-outline-secondary btn-sm mx-1" onClick={() => decreaseQuantity(item.id)}>-</button>
                  <button className="btn btn-danger btn-sm mx-1" onClick={() => removeFromCart(item.id)}>ลบ</button>
                </div>
              </li>
            ))}
          </ul>
          <h3 className="mt-3">รวมทั้งหมดที่เลือก: {selectedTotal.toLocaleString()} บาท</h3>
          <button className="btn btn-primary w-100" onClick={handleShow}>
            ดำเนินการชำระเงิน
          </button>
        </>
      )}

      {/* Modal สำหรับเลือกวิธีการชำระเงิน */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>เลือกวิธีการชำระเงิน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id="creditCard"
              value="Credit Card"
              checked={paymentMethod === "Credit Card"}
              onChange={() => setPaymentMethod("Credit Card")}
            />
            <label className="form-check-label" htmlFor="creditCard">
              Credit Card
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id="paypal"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={() => setPaymentMethod("PayPal")}
            />
            <label className="form-check-label" htmlFor="paypal">
              PayPal
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="paymentMethod"
              id="bankTransfer"
              value="Bank Transfer"
              checked={paymentMethod === "Bank Transfer"}
              onChange={() => setPaymentMethod("Bank Transfer")}
            />
            <label className="form-check-label" htmlFor="bankTransfer">
              Bank Transfer
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={handlePayment}>
            เสร็จสิ้นการชำระเงิน
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Cart;
