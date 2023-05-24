const bcrypt = require("bcrypt");
const User = require("../models/User");
exports.register = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role
        });

        await user.save();

        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};


exports.login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user == null) {
        return res.status(400).json({ status: "error", message: "Cannot find user" });
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.json({ status: "ok", message: "Success", username: user.username });
        } else {
            res.json({ status: "error", message: "Not Allowed" });
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};