const bcrypt = require('bcrypt');
const User = require('../models/User');


exports.getUser = async (req, res) => {
    const username = req.query.username;
    const user = await User.findOne({ username: username });

    if (user == null) {
        return res.status(404).json({ message: 'Cannot find user' });
    }

    const userWithoutPassword = {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        role: user.role
    };
    res.json(userWithoutPassword);
};

