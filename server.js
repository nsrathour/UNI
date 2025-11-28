const express = require("express");
const path = require("path");
const userModel = require("./models/User.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const session = require("express-session");

mongoose
  .connect("mongodb://localhost:27017/UAAS")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const app = express();

// SESSION
app.use(
  session({
    name: "sid",
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 5 * 60 * 1000, // 5 mins
    },
  })
);

// READ FORM DATA
app.use(express.urlencoded({ extended: true }));

// STATIC FOLDER
app.use(express.static("public"));

// EJS SETUP
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// ---------- LOGIN PAGE ----------
app.get("/login", (req, res) => {
  res.render("login");
});


// ---------- POST LOGIN ----------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Enter Email and Password" });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid Email or Password" });
  }

  const validUser = await bcrypt.compare(password, user.password);

  if (!validUser) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  // 🔥 STORE LOGIN SESSION
  req.session.user = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  res.redirect("/admin/dashboard");
});


// 🔐 Middleware to protect admin routes
function isAdmin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user.role !== "admin") {
    return res.status(403).send("Access Denied");
  }

  next();
}


// ---------- ADMIN DASHBOARD ----------
app.get("/admin/dashboard", isAdmin, (req, res) => {
  res.render("admin-dashboard", {
    user: req.session.user,
  });
});


// SERVER START
app.listen(3000, () => {
  console.log("server started at 3000");
});
