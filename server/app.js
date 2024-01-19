const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRouter = require('./routes/users');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

app.use('/users', usersRouter);

// MongoDB connection
mongoose.connect('mongodb+srv://bhandab:khudakabanda@cluster0.a9ghzid.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Image Guessing Game Server!');
});

// Define port and start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



