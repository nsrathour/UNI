const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userModel = require("./models/userModel");
const bcrypt = require("bcrypt");

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ejs setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// -------- REGISTER ----------
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, role, department } = req.body;

    const exist = await userModel.findOne({ email });
    if (exist) return res.send("User already exists!");

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        department
    });

    res.send("Registration successful!");
});

// -------- LOGIN ----------
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.send("User not found!");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("Wrong password!");

    res.send(`Welcome ${user.firstName}`);
});

// -------- START SERVER + DB ----------
mongoose.connect("mongodb://127.0.0.1:27017/uaa")
.then(() => {
    console.log("MongoDB Connected");
    app.listen(3000, () => console.log("Server running at http://localhost:3000"));
})
.catch(err => console.log(err));
