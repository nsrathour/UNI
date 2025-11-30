const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Department = require("../models/Department");
const adminAuth = require("../middleware/adminAuth");

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

module.exports = router;
