const express = require('express');

const User = require('../models/User');
const Recipe = require('../models/Recipe');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();


//test

router.get('/test', authMiddleware, adminMiddleware, (req, res) => {
    res.json({
        message: 'Uspešan pristup admin delu!',
        userId: req.userId
    });
});


// pregled korisnika

router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(users);

    } catch (error) {
        console.error('Greška pri učitavanju korisnika:', error);

        res.status(500).json({
            message: 'Greška pri učitavanju korisnika.'
        });
    }
});


// pregled recepata

router.get('/recipes', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('author', 'firstName lastName username profilePicture')
            .sort({ createdAt: -1 });

        res.json(recipes);

    } catch (error) {
        console.error('Greška pri učitavanju recepata:', error);

        res.status(500).json({
            message: 'Greška pri učitavanju recepata.'
        });
    }
});

// brisanje recepata

router.delete(
    '/recipes/:id',
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const recipe = await Recipe.findById(req.params.id);

            if (!recipe) {
                return res.status(404).json({
                    message: 'Recept nije pronađen.'
                });
            }

            await Recipe.findByIdAndDelete(req.params.id);

            // ako je recept bio sacuvan kod nekih korisnika,
            // uklanjamo ga iz njihovog savedRecipes niza
            await User.updateMany(
                { savedRecipes: req.params.id },
                { $pull: { savedRecipes: req.params.id } }
            );

            res.json({
                message: 'Recept je uspešno obrisan.'
            });

        } catch (error) {
            console.error('Greška pri brisanju recepta:', error);

            res.status(500).json({
                message: 'Greška pri brisanju recepta.'
            });
        }
    }
);


// brisanje korisnika

router.delete(
    '/users/:id',
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            // admin ne moze da obrise samog sebe
            if (req.params.id === req.userId) {
                return res.status(400).json({
                    message: 'Ne možete obrisati sopstveni admin nalog.'
                });
            }

            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({
                    message: 'Korisnik nije pronađen.'
                });
            }

            // brisu se recepti korisnika
            await Recipe.deleteMany({
                author: req.params.id
            });

            // brisanje samog korisnika
            await User.findByIdAndDelete(req.params.id);

            // uklanjamo ga iz pratilaca
            await User.updateMany(
                {},
                {
                    $pull: {
                        followers: req.params.id,
                        following: req.params.id
                    }
                }
            );

            res.json({
                message: 'Korisnik je uspešno obrisan.'
            });

        } catch (error) {
            console.error('Greška pri brisanju korisnika:', error);

            res.status(500).json({
                message: 'Greška pri brisanju korisnika.'
            });
        }
    }
);


// statistika

router.get(
    '/stats',
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const users = await User.countDocuments();
            const recipes = await Recipe.countDocuments();

            const comments = await Recipe.aggregate([
                {
                    $project: {
                        numberOfComments: {
                            $size: { $ifNull: ['$comments', []] }
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$numberOfComments' }
                    }
                }
            ]);

            const totalComments = comments.length > 0
                ? comments[0].total
                : 0;

            res.json({
                users,
                recipes,
                comments: totalComments
            });

        } catch (error) {
            console.error('Greška pri učitavanju statistike:', error);

            res.status(500).json({
                message: 'Greška pri učitavanju statistike.'
            });
        }
    }
);


module.exports = router;