const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('./models/Recipe');

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

app.get('/api/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();

        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/recipes', async (req, res) => {
    try {
        const recipe = new Recipe(req.body);

        const savedRecipe = await recipe.save();

        res.status(201).json(savedRecipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/recipes/:id', async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedRecipe) {
            return res.status(404).json({
                message: 'Recept nije pronađen'
            });
        }

        res.status(200).json(updatedRecipe);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

{/* get za jedan recept */}
app.get('/api/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                message: 'Recept nije pronađen'
            });
        }

        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server radi na portu ${PORT}`);
});