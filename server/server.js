const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userController = require('./controllers/UserController');
const ticketController = require('./controllers/TicketController');

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

app.post('/register', userController.register);
app.post('/login', userController.login);
app.get('/user', userController.getUser);
app.post('/addTicket', ticketController.addTicket);
app.get('/ticket', ticketController.getTicket);
app.get('/tickets', ticketController.getTickets);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
