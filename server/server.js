const express = require('express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('<your_connection_string>', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const app = express();

// Use the built-in JSON middleware to automatically parse JSON
app.use(express.json());

// TODO: Add your routes here
const bugsRoutes = require('./routes/bugs');

app.use('/api/bugs', bugsRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
