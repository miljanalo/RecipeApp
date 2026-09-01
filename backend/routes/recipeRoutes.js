const express = require('express');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// recipe APIs

router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('author');

        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// objavljivanje recepta - ulogovani korisnik

router.post('/', authMiddleware, async (req, res) => {
    try {
        const recipe = new Recipe({
            ...req.body,
            author: req.userId
        });

        const savedRecipe = await recipe.save();

        res.status(201).json(savedRecipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// izmena recepta - ulogovani korisnik ciji je recept

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                message: 'Recept nije pronađen.'
            });
        }
        // samo autor može da izmeni recept
        if (recipe.author.toString() !== req.userId) {
            return res.status(403).json({
                message: 'Nemate dozvolu da izmenite ovaj recept.'
            });
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('author');

        res.status(200).json(updatedRecipe);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// brisanje recepta - ulogovani korisnik ciji je recept

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                message: 'Recept nije pronađen.'
            });
        }

        // samo autor može da obrise recept
        if (recipe.author.toString() !== req.userId) {
            return res.status(403).json({
                message: 'Nemate dozvolu da obrišete ovaj recept.'
            });
        }

        await Recipe.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: 'Recept je uspešno obrisan.'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// get za jedan recept
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('author');

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

module.exports = router;