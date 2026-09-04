const express = require('express');

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// APIs za korisnika


//pronalazenje korisnika? mozda ne bude trebalo 
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//korisnikovi recepti 
router.get('/me/recipes', authMiddleware, async (req, res) => {
    try {
        const recipes = await Recipe.find({
            author: req.userId
        }).populate('author');

        res.status(200).json(recipes);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// korisnikovi sacuvani recepti ---------------------------------------------------------------------------------------------------

// GET - dobavljanje sacuvanih recepata
router.get('/me/saved-recipes', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .populate('savedRecipes');

        if (!user) {
            return res.status(404).json({
                message: 'Korisnik nije pronađen.'
            });
        }

        res.status(200).json(user.savedRecipes);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// POST - cuvanje recepta
router.post('/me/saved-recipes/:recipeId', authMiddleware, async (req, res) => {
    try {
        const { recipeId } = req.params;

        // proveravamo da li recept postoji
        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({
                message: 'Recept nije pronađen.'
            });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Korisnik nije pronađen.'
            });
        }

        // proveravamo da li je recept već sačuvan
        if (user.savedRecipes.includes(recipeId)) {
            return res.status(400).json({
                message: 'Recept je već sačuvan.'
            });
        }

        user.savedRecipes.push(recipeId);

        recipe.saves += 1;

        await user.save();
        await recipe.save();

        res.status(200).json({
            message: 'Recept je uspešno sačuvan.',
            savedRecipes: user.savedRecipes,
            saves: recipe.saves
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// DELETE - uklanjanje recepta iz sacuvanih
router.delete('/me/saved-recipes/:recipeId', authMiddleware, async (req, res) => {
    try {
        const { recipeId } = req.params;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Korisnik nije pronađen.'
            });
        }
        
        const recipe = await Recipe.findById(recipeId);

         if (!recipe) {
            return res.status(404).json({
                message: 'Recept nije pronađen.'
            });
        }

        const wasSaved = user.savedRecipes.some(
            savedId => savedId.toString() === recipeId
        );

        user.savedRecipes = user.savedRecipes.filter(
            savedId => savedId.toString() !== recipeId
        );

        if (wasSaved) {
            recipe.saves = Math.max(0, recipe.saves - 1);
        }

        await user.save();
        await recipe.save();

        res.status(200).json({
            message: 'Recept je uklonjen iz sačuvanih.',
            savedRecipes: user.savedRecipes,
            saves: recipe.saves
        });

        res.status(200).json({
            message: 'Recept je uklonjen iz sačuvanih.',
            savedRecipes: user.savedRecipes
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// profil drugog korisnika
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('followers', 'firstName lastName username profilePicture')
            .populate('following', 'firstName lastName username profilePicture');

        if (!user) {
            return res.status(404).json({
                message: 'Korisnik nije pronađen.'
            });
        }

        const recipes = await Recipe.find({
            author: req.params.id
        });

        res.status(200).json({
            user,
            recipes
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;