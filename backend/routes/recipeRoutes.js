const express = require('express');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
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
        const recipe = await Recipe.findById(req.params.id)
            .populate('author')
            .populate(
                'comments.author',
                'firstName lastName username profilePicture'
            );

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

// lajkovanje recepta -----------------------------------------------------------------------

// POST - korisnik lajkuje recept
router.post('/:id/like', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                message: 'Recept nije pronađen.'
            });
        }

        // proveravamo da li je korisnik vec lajkovao recept
        if (recipe.likes.includes(req.userId)) {
            return res.status(400).json({
                message: 'Već ste lajkovali ovaj recept.'
            });
        }

        // dodaj korisnika u likes
        recipe.likes.push(req.userId);

        await recipe.save();

        res.status(200).json({
            message: 'Recept je uspešno lajkovan.',
            likesCount: recipe.likes.length,
            isLiked: true
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// DELETE - korisnik unlikeuje
router.delete('/:id/like', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                message: 'Recept nije pronađen.'
            });
        }

        recipe.likes = recipe.likes.filter(
            id => id.toString() !== req.userId.toString()
        );

        await recipe.save();

        res.status(200).json({
            message: 'Lajk je uspešno uklonjen.',
            likesCount: recipe.likes.length,
            isLiked: false
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// komentari ----------------------------------------------------------------------

//POST- objava komentara
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: 'Komentar ne može biti prazan.'
      });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        message: 'Recept nije pronađen.'
      });
    }

    recipe.comments.push({
      author: req.userId,
      text: text.trim()
    });

    await recipe.save();

    const updatedRecipe = await Recipe.findById(req.params.id)
      .populate('author')
      .populate(
        'comments.author',
        'firstName lastName username profilePicture'
      );

    res.status(201).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// DELTE - brisanje komentara
router.delete('/:recipeId/comments/:commentId', authMiddleware, async (req, res) => {
        try {
            const { recipeId, commentId } = req.params;

            const recipe = await Recipe.findById(recipeId);

            if (!recipe) {
                return res.status(404).json({
                    message: 'Recept nije pronađen.'
                });
            }

            const comment = recipe.comments.id(commentId);

            if (!comment) {
                return res.status(404).json({
                    message: 'Komentar nije pronađen.'
                });
            }

            // da li je trenutni korisnik admin
            const user = await User.findById(req.userId).select('role');

            const isAdmin = user?.role === 'admin';

            // da li je trenutni korisnik autor komentara
            const isAuthor =
                comment.author.toString() === req.userId.toString();

            // ako nije ni admin ni autor komentara -> nema dozvolu
            if (!isAdmin && !isAuthor) {
                return res.status(403).json({
                    message: 'Nemate dozvolu da obrišete ovaj komentar.'
                });
            }

            // brisanje komentara
            recipe.comments = recipe.comments.filter(
                comment => comment._id.toString() !== commentId
            );

            await recipe.save();

            res.status(200).json({
                message: 'Komentar je uspešno obrisan.'
            });

        } catch (error) {
            console.error('Greška pri brisanju komentara:', error);

            res.status(500).json({
                message: 'Greška pri brisanju komentara.'
            });
        }
    }
);

// ocenjivanje recepata -------------------------------------------------------------------------------------------------

router.post('/:id/rating', authMiddleware, async (req, res) => {
    try {
        const { rating } = req.body;

        // provera ocene
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: 'Ocena mora biti između 1 i 5.'
            });
        }

        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                message: 'Recept nije pronađen.'
            });
        }

        // proveravamo da li je korisnik vec ocenio recept
        const existingRating = recipe.ratings.find(
            r => r.user.toString() === req.userId.toString()
        );

        if (existingRating) {

            // korisnik menja svoju ocenu
            existingRating.value = rating;

        } else {

            // korisnik prvi put ocenjuje
            recipe.ratings.push({
                user: req.userId,
                value: rating
            });
        }

        // racunamo prosek
        const total = recipe.ratings.reduce(
            (sum, r) => sum + r.value,
            0
        );

        recipe.rating = Number(
            (total / recipe.ratings.length).toFixed(1)
        );

        await recipe.save();

        res.status(200).json({
            message: 'Ocena je uspešno sačuvana.',
            rating: recipe.rating,
            userRating: rating
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;