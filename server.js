const express = require("express");
const path = require("path");

const app = express();

// Middleware to read form data
app.use(express.urlencoded({ extended: true }));

// Public folder (for CSS)
app.use(express.static("public"));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------- LOGIN ROUTE ----------
app.get("/login", (req, res) => {
    res.render("login");   // login.ejs render
});

// ---------- SERVER START ----------
app.listen(3000, () => {
    console.log("server started at 3000")})
