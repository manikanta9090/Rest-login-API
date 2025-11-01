const express = require("express");
const mongoose = require("mongoose");
const User = require("./userModel");

const app = express();
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect("mongodb+srv://juttumanikanta52:TrkLsHSgqa%216xcw@dt.eexll2a.mongodb.net/studentdb?retryWrites=true&w=majority&appName=dt")
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ Connection error:", err));

/**
 * 📝 User Registration
 */
app.post("/register", async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ error: "User already exists" });

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * 🔐 User Login
 */
app.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user)
            return res.status(404).json({ error: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(401).json({ error: "Invalid password" });

        res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));