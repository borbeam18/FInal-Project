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
    origin: "http://localhost:3000",
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

const verifyAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};

// 📌 **1. ลงทะเบียนลูกค้า**
app.post("/register", (req, res) => {
    const { fullName, email, phone, address, password, status } = req.body;
    const hashPassword = bcrypt.hashSync(password, 8);

    db.query("INSERT INTO tb_customers (FullName, Email, Phone, Address, Password, Status) VALUES (?, ?, ?, ?, ?, ?)", 
    [fullName, email, phone, address, hashPassword, status], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Customer registered successfully" });
    });
});

// 📌 **Login พร้อมแยก User และ Admin**
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM tb_customers WHERE Email = ?", [email], (err, results) => {
        if(err){
            return res.status(500).json({message: "Database Error", error: err});
        }

        //ตรวจสอบว่าพบผู้ใช้หรือไม่
        if(results.length === 0){
            return res.status(401).json({message: "Invalid email or password"});
        }

        const user = results[0]; //ดึงข้อมูลผู้ใช้จากฐานข้อมูล
        const hashedPassword = user.Password;

        //ตรวจสอบว่ารหัสผ่านถูกต้องหรือไม่
        if(!hashedPassword || !bcrypt.compareSync(password, hashedPassword)){
            return res.status(401).json({message: "Invalid email or password"});
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

// 📌 **API ตะกร้าสินค้า (Cart)**
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

app.listen(5000, () => {
    console.log('Server running on port http://localhost:5000');
});
