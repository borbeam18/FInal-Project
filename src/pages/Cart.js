import React from "react";

function Cart() {
  // ตัวอย่างสินค้าในตะกร้า
  const cartItems = [
    { id: 1, name: "Product 1", price: 100, quantity: 2 },
    { id: 2, name: "Product 2", price: 200, quantity: 1 },
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mt-5 pt-5">
      <h1>ตะกร้าสินค้า</h1>
      <ul className="list-group">
        {cartItems.map(item => (
          <li className="list-group-item" key={item.id}>
            {item.name} x {item.quantity} - {item.price * item.quantity} บาท
          </li>
        ))}
      </ul>
      <h3 className="mt-3">รวมทั้งหมด: {total} บาท</h3>
      <button className="btn btn-primary">ดำเนินการชำระเงิน</button>
    </div>
  );
}

export default Cart;
