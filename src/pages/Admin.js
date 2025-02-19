import React, { useState } from "react";

function Admin() {
  const [products, setProducts] = useState([
    { id: 1, name: "PAPER PLANES T-SHIRT", price: 690 },
    { id: 2, name: "URTHE Oversize TEE", price: 650 },
  ]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });

  const handleAddProduct = () => {
    const newId = products.length + 1;
    setProducts([...products, { id: newId, ...newProduct }]);
    setNewProduct({ name: "", price: "" });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handleEditProduct = (id) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, name: "Updated " + product.name, price: product.price + 100 } : product
    );
    setProducts(updatedProducts);
  };

  return (
    <div className="container mt-5">
      <h2>Admin Panel</h2>
      <div className="mb-4">
        <h4>เพิ่มสินค้าใหม่</h4>
        <input
          type="text"
          className="form-control"
          placeholder="ชื่อสินค้า"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          className="form-control mt-2"
          placeholder="ราคาสินค้า"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <button onClick={handleAddProduct} className="btn btn-primary mt-3">เพิ่มสินค้า</button>
      </div>

      <h4>รายการสินค้าปัจจุบัน</h4>
      <ul className="list-group">
        {products.map((product) => (
          <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
            {product.name} - ฿{product.price}
            <div>
              <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditProduct(product.id)}>แก้ไข</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(product.id)}>ลบ</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
