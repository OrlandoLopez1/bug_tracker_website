const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

require('dotenv').config();
const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((error) => console.error('Failed to connect to MongoDB:', error));


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});


app.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user == null) {
        return res.status(400).json({ status: "error", message: "Cannot find user" });
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            // Send back username as part of response
            res.json({ status: "ok", message: "Success", username: user.username });
        } else {
            res.json({ status: "error", message: "Not Allowed" });
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
