const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler')
const { logger, logEvents } = require('./middleware/logger')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const userController = require('./controllers/UsersController');
const ticketController = require('./controllers/TicketController');
const projectController = require('./controllers/ProjectController'); // import ProjectController

const app = express();

console.log(process.env.NODE_ENV)

app.use(logger);
app.use(cors({
    origin: 'http://localhost:3000', // replace with your client app's origin
    credentials: true, // this allows cookies to be sent
}));

app.use(express.json());
app.use(cookieParser());


app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/tickets', require('./routes/ticketRoutes'))
app.use('/projects', require('./routes/projectRoutes'))

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

require('dotenv').config();
const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((error) => console.error('Failed to connect to MongoDB:', error));