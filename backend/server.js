const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const followRoutes = require('./routes/followRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected!');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

app.get('/', (req, res) => {
    res.send('Backend radi!');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', followRoutes);
app.use('/api/admin', adminRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server radi na portu ${PORT}`);
});