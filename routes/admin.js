const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Department = require("../models/Department");
const adminAuth = require("../middleware/adminAuth");

// ------------------ DASHBOARD ------------------
router.get("/dashboard", adminAuth, async (req, res) => {
    try {
        const totalDepartments = await Department.countDocuments();

        const userCounts = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        let studentCount = 0, professorCount = 0, hodCount = 0;

        userCounts.forEach(u => {
            if (u._id === "student") studentCount = u.count;
            if (u._id === "professor") professorCount = u.count;
            if (u._id === "hod") hodCount = u.count;
        });

        res.render("admin-dashboard", {
            totalDepartments,
            studentCount,
            professorCount,
            hodCount
        });

    } catch (err) {
        console.log(err);
        res.send("Dashboard error");
    }
});


// ------------------ CREATE DEPARTMENT FORM ------------------
router.get("/departments/create", adminAuth, (req, res) => {
    res.render("create-department", { message: null });
});


// ------------------ CREATE DEPARTMENT POST ------------------
router.post("/departments/create", adminAuth, async (req, res) => {
    const { name, type, address } = req.body;

    if (!name || !type || !address) {
        return res.render("create-department", {
            message: "All fields are required!"
        });
    }

    try {
        await Department.create({ name, type, address });

        res.render("create-department", {
            message: "Department created successfully!"
        });

    } catch (err) {
        console.log(err);
        res.render("create-department", {
            message: "Error creating department!"
        });
    }
});


// ------------------ DEPARTMENTS LIST ------------------
router.get("/departments", adminAuth, async (req, res) => {
    try {
        const departments = await Department.find();
        res.render("departments-list", { departments });
    } catch (err) {
        console.log(err);
        res.send("Error loading departments");
    }
});


module.exports = router;
