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
    profilePicture: { type: String, default: '/defaultpfp.png' },
});
const User = mongoose.model('User', userSchema);

/*todo make it so that the projects can be selected from a dropdown,
   also clean up data form so that it can take these new values
 */
const ticketSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    assignedBy: { type: String, required: true },
    assignedTo: { type: String, required: true },
    type: { type: String, required: true },
    project_name: { type: String, required: true },
    status: { type: String, required: true, default: 'open' },
    priority: { type: String, required: true, default: 'medium' }
}, { timestamps: true });
const Ticket = mongoose.model('Ticket', ticketSchema);


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

app.get('/user', async (req, res) => {
    const username = req.query.username;
    const user = await User.findOne({ username: username });

    if (user == null) {
        return res.status(404).json({ message: 'Cannot find user' });
    }

    const userWithoutPassword = {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture
    };
    res.json(userWithoutPassword);
});

app.post('/addTicket', async (req, res) => {
    try{
        const ticket =  new Ticket({
            title: req.body.title,
            description: req.body.description,
            assignedBy: req.body.assignedBy,
            assignedTo: req.body.assignedTo,
            project_name: req.body.project_name,
            type: req.body.type,
            status: req.body.status,
            priority: req.body.priority
        })
        await ticket.save();
        res.status(201).json({message: 'Ticket created'});
    } catch (error) {
        res.status(500).json({message: 'Error creating ticket', error: error.message});
    }

});
app.get('/ticket', async (req, res) =>{
    const title = req.query.title;
    const ticket = await Ticket.findOne({title:title})

    if (ticket == null) {
        return res.status(404).json({message: 'Cannot find ticket'})
    }

    const ticket_info = {
        title: ticket.title,
        description: ticket.description,
        assignedBy: ticket.assignedBy,
        assignedTo: ticket.assignedTo,
        status: ticket.status,
        priority: ticket.priority

    }
   res.json(ticket_info);
});


// Acquires all the tickets in the database
app.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find({});
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error getting tickets', error: error.message });
    }
});


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
