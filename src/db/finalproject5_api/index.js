const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const db = require('./database');
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

const JWT_SECRET = "1478";

app.use(cors({
    origin: "http://localhost:3001",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));


// Middleware ตรวจสอบ Token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "No token provided" });

    jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });
        req.user = decoded;
        next();
    });
};



// 📌 **1. ลงทะเบียนลูกค้า**
app.post("/register", (req, res) => {
    const { fullName, email, phone, address, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, 8);

    db.query("INSERT INTO tb_customers (FullName, Email, Phone, Address, Password) VALUES (?, ?, ?, ?, ?)", 
    [fullName, email, phone, address, hashPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Customer registered successfully" });
    });
});


// 📌 **Login**
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM tb_customers WHERE Email = ?", [email], (err, results) => {
        if(err){
            return res.status(500).json({message: "Database Error", error: err});
        }

        //ตรวจสอบว่าพบผู้ใช้หรือไม่
        if(results.length === 0){
            return res.status(401).json({message: "Invaild email or password"});
        }

        
        const user = results[0]; //ดึงข้อมูลผู้ใช้จากฐานข้อมูล
        const hashedPassword = user.Password;

        //ตรวจสอบว่ารหัสผ่านถูกต้องหรือไม่
        if(!hashedPassword || !bcrypt.compareSync(password, hashedPassword)){
            return res.status(401).json({message: "Invaild email or password"});
        }

        //สร้าง JWT_SECRET
        const token = jwt.sign(
            {id: user.CustomerID, email: user.Email},
            JWT_SECRET,
            {expiresIn: "2h"}
        );

        res.json({message: "Login Successful", token});
    });
});

// 📌 **3. ดูรายการสินค้า (GET /products)**
app.get("/products", verifyToken, (req, res) => {
    db.query("SELECT * FROM tb_products", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/products/:id", verifyToken, (req, res) => {
    const productId = req.params.id;

    db.query("SELECT * FROM tb_products WHERE ProductID = ?", [productId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ message: "Product not found" });

        res.json(result[0]); // ส่งข้อมูลสินค้าเป็น JSON
    });
});


// 📌 **4. เพิ่มสินค้า (POST /products)**
app.post("/products", verifyToken, (req, res) => {
    const { productName, description, price, stock, imageUrl } = req.body;

    db.query("INSERT INTO tb_products (ProductName, Description, Price, Stock, Image_url) VALUES (?, ?, ?, ?, ?)", 
    [productName, description, price, stock, imageUrl], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product added successfully", productID: result.insertId });
    });
});


// 📌 **5. แก้ไขสินค้า (PUT /products/:id)**
app.put("/products/:id", verifyToken, (req, res) => {
    const { productName, description, price, stock, imageUrl } = req.body; // รวมทั้ง description และ imageUrl
    const { id } = req.params; // รับค่าจาก URL parameter

    db.query("UPDATE tb_products SET ProductName = ?, Description = ?, Price = ?, Stock = ?, Image_url = ? WHERE ProductID = ?",
        [productName, description, price, stock, imageUrl, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product updated successfully" });
    });
});


// 📌 **6. ลบสินค้า (DELETE /products/:id)**
app.delete("/products/:id", verifyToken, (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM tb_products WHERE ProductID = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product deleted successfully" });
    });
});

// 📌 **7. สร้าง Order (POST /orders)**
app.post("/orders", verifyToken, (req, res) => {
    const { customerID, totalPrice, status,  created_at	, products } = req.body;

    if (!customerID || !totalPrice || !status || !created_at || !products || products.length === 0) {
        return res.status(400).json({ error: "Invalid request data" });
    }

    // คำนวณ total_price จากสินค้า
    let TotalPrice = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

    // เพิ่มคำสั่ง INSERT เข้าไปในตาราง `order`
    const insertOrderQuery = "INSERT INTO tb_orders (CustomerID, TotalPrice, Status, Created_at) VALUES (?, ?, ?, ?)";
    db.query(insertOrderQuery, [customerID, totalPrice, status,  created_at], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const orderID = result.insertId; // ดึง OrderID ที่เพิ่งถูกเพิ่ม
        const orderDetails = products.map(p => [orderID, p.productID, p.quantity, p.price]);

        // เพิ่มข้อมูลลงตาราง `orderdetail`
        const insertOrderDetailQuery = "INSERT INTO tb_order_items (OrderID, ProductID, Quantity, Price) VALUES ?";
        db.query(insertOrderDetailQuery, [orderDetails], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Order placed successfully", orderID, TotalPrice });
        });
    });
});

// 📌 **8. ดูรายการ Order (GET /orders)**
app.get("/orders", verifyToken, (req, res) => {
    db.query(`SELECT o.OrderID, o.Created_at, c.FullName, p.ProductName, od.Quantity
              FROM tb_orders o
              JOIN tb_customers c ON o.CustomerID = c.CustomerID
              JOIN tb_order_items od ON o.OrderID = od.OrderID
              JOIN tb_products p ON od.ProductID = p.ProductID`, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 📌 **9. ลบ Order (DELETE /orders/:id)**
app.delete("/orders/:id", verifyToken, (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM tb_order_items WHERE OrderID = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query("DELETE FROM tb_orders WHERE OrderID = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Order deleted successfully" });
        });
    });
});

// 📌 **10. ดูรายการผู้ใช้งาน (GET /customers)**
app.get("/customers", verifyToken, (req, res) => {
    db.query("SELECT * FROM tb_customers", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 📌 ** หน้าการชำระเงิน (Payment Page)**
app.post("/payments", verifyToken, (req, res) => {
    const { orderID, paymentMethod } = req.body;
    const transactionDate = new Date();
    db.query("INSERT INTO tb_payments (OrderID, PaymentMethod, PaymentStatus, TransactionDate) VALUES (?, ?, 'Pending', ?)", [orderID, paymentMethod, transactionDate], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Payment recorded successfully", paymentID: result.insertId });
    });
});

// 📌 ** หน้าติดตามสถานะคำสั่งซื้อ (Order Tracking Page)**
app.get("/orderstatus/:id", verifyToken, (req, res) => {
    const { id } = req.params;
    db.query("SELECT o.OrderID, o.Status, os.Updated_at FROM tb_orders o JOIN tb_order_status os ON o.OrderID = os.OrderID WHERE o.OrderID = ? ORDER BY os.Updated_at DESC LIMIT 1", [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Order not found" });
        res.json(results[0]);
    });
});


// ======================= 🛒 API ตะกร้าสินค้า (Cart) =======================

// เพิ่มสินค้าลงตะกร้า
app.post("/cart", (req, res) => {
    const { customerID, productId, quantity } = req.body;

    // เช็กค่าที่ส่งมาว่าไม่มีค่า null หรือ undefined
    if (!customerID || !productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: "Invalid input data" });
    }

    // ตรวจสอบว่าสินค้าอยู่ในตะกร้าหรือยัง
    db.query(
        "SELECT * FROM tb_cart WHERE CustomerID = ? AND ProductID = ?",
        [customerID, productId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length > 0) {
                // ถ้ามีสินค้าอยู่แล้ว ให้เพิ่มจำนวนสินค้า
                db.query(
                    "UPDATE tb_cart SET Quantity = Quantity + ? WHERE CustomerID = ? AND ProductID = ?",
                    [quantity, customerID, productId],
                    (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: "Cart updated successfully" });
                    }
                );
            } else {
                // ถ้ายังไม่มีสินค้าในตะกร้า ให้เพิ่มแถวใหม่
                db.query(
                    "INSERT INTO tb_cart (CustomerID, ProductID, Quantity) VALUES (?, ?, ?)",
                    [customerID, productId, quantity],
                    (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: "Added to cart" });
                    }
                );
            }
        }
    );
});


// ดึงรายการตะกร้าสินค้าของผู้ใช้
app.get("/cart/:customerID", (req, res) => {
    const customerID = req.params.customerID;
    db.query(
        "SELECT c.CartID, p.ProductName, p.Price, c.Quantity FROM tb_cart c JOIN tb_products p ON c.ProductID = p.ProductID WHERE c.CustomerID = ?",
        [customerID],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
});

// ลบสินค้าออกจากตะกร้า
app.delete("/cart/:id", (req, res) => {
    const cartId = req.params.id;
    db.query("DELETE FROM tb_cart WHERE CartID = ?", [cartId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Item removed from cart" });
    });
});

app.listen(5000, () => {
    console.log('Server running on port http://localhost:5000');
});