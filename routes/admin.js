const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Department = require("../models/Department");
const bcrypt = require("bcrypt");
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


// ===========================================================
// ================== EDIT DEPARTMENT ROUTES =================
// ===========================================================

// ------------------ EDIT FORM ------------------
router.get("/departments/:id/edit", adminAuth, async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.send("Department not found!");
        }

        res.render("edit-department", {
            department,
            message: null
        });

    } catch (err) {
        console.log(err);
        res.send("Error loading edit form");
    }
});


// ------------------ UPDATE DEPARTMENT POST ------------------
router.post("/departments/:id/update", adminAuth, async (req, res) => {
    const { name, type, address } = req.body;

    try {
        await Department.findByIdAndUpdate(req.params.id, {
            name,
            type,
            address
        });

        const updatedDept = await Department.findById(req.params.id);

        res.render("edit-department", {
            department: updatedDept,
            message: "Department updated successfully!"
        });

    } catch (err) {
        console.log(err);
        res.render("edit-department", {
            department: { _id: req.params.id, name, type, address },
            message: "Error updating department!"
        });
    }
});


// ===========================================================
// =================== UPDATED DEPARTMENTS LIST ==============
// ===========================================================
router.get("/departments", adminAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalDepartments = await Department.countDocuments();

        const departments = await Department.find()
            .skip(skip)
            .limit(limit);

        const deptWithUserCount = await Promise.all(
            departments.map(async (d) => {
                const count = await User.countDocuments({ department: d._id });
                return { ...d.toObject(), userCount: count };
            })
        );

        res.render("departments-list", {
            departments: deptWithUserCount,
            currentPage: page,
            totalPages: Math.ceil(totalDepartments / limit)
        });

    } catch (err) {
        console.log(err);
        res.send("Error loading departments");
    }
});


// ===========================================================
// ====================== CREATE USER =========================
// ===========================================================

// GET Create User Form
router.get("/create-user", adminAuth, async (req, res) => {
    const departments = await Department.find();
    res.render("create-user", { departments });
});

// POST Create User
router.post("/create-user", adminAuth, async (req, res) => {
    try {
        const { name, email, phone, role, department } = req.body;

        // Email unique check
        const exists = await User.findOne({ email });
        if (exists) return res.send("Email already exists");

        ;
        // Default password generate
        const defaultPassword = Math.random().toString(36).slice(-8);

        const hashed = await bcrypt.hash(defaultPassword, 10);

        await User.create({
            name,
            email,
            phone,
            role,
            department,
            password: hashed
        });

        res.redirect("/admin/dashboard");

    } catch (err) {
        console.log(err);
        res.send("Error creating user");
    }
});

module.exports = router;
