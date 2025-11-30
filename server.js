const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const userModel = require("./models/User");

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
      maxAge: 5 * 60 * 1000,
    },
  })
);

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// EJS TEMPLATE ENGINE
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// ---------------- LOGIN PAGE ----------------
app.get("/login", (req, res) => {
  res.render("login");
});

// ---------------- LOGIN PROCESS ----------------
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

  // Store session
  req.session.user = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  // If admin → dashboard
  if (user.role === "admin") {
    return res.redirect("/admin/dashboard");
  }

  // Otherwise redirect anywhere you want
  res.send("Login successful for non-admin user");
});


// ---------------- ADMIN ROUTES ----------------
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

// START SERVER
app.listen(3000, () => {
  console.log("Server started at 3000");
});
