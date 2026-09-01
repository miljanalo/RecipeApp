const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('./models/Recipe');
const User = require('./models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authMiddleware = require('./middleware/authMiddleware');

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

// recipe apis

app.get('/', (req, res) => {
    res.send('Backend radi!');
});

app.get('/api/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('author');

        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// objavljivanje recepta - ulogovani korisnik

app.post('/api/recipes', authMiddleware, async (req, res) => {
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

app.put('/api/recipes/:id', authMiddleware, async (req, res) => {
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

app.delete('/api/recipes/:id', authMiddleware, async (req, res) => {
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

{/* get za jedan recept */}
app.get('/api/recipes/:id', async (req, res) => {
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


{/* user apis */}

app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);

        const savedUser = await user.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

{/* registracija i login */}

app.post('/api/auth/register', async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            username,
            email,
            password
        } = req.body;

        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Korisnik sa tim emailom ili username-om već postoji.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await user.save();

        res.status(201).json({
            message: 'Uspešna registracija',
            user: {
                id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                username: savedUser.username,
                email: savedUser.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // pronadji korisnika
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: 'Pogrešan email ili lozinka.'
            });
        }

        // proveri lozinku
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Pogrešan email ili lozinka.'
            });
        }

        // napravi JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Uspešna prijava',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'Korisnik nije pronađen.'
            });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.put('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        const { firstName, lastName, bio, profilePicture } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            {
                firstName,
                lastName,
                bio,
                profilePicture
            },
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                message: 'Korisnik nije pronađen.'
            });
        }

        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//recepti korisnika
app.get('/api/users/me/recipes', authMiddleware, async (req, res) => {
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

// sacuvani recepti korisnika

// GET - dobavljanje sacuvanih recepata
app.get('/api/users/me/saved-recipes', authMiddleware, async (req, res) => {
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
app.post('/api/users/me/saved-recipes/:recipeId', authMiddleware, async (req, res) => {
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

        await user.save();

        res.status(200).json({
            message: 'Recept je uspešno sačuvan.',
            savedRecipes: user.savedRecipes
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// DELETE - uklanjanje recepta iz sacuvanih
app.delete('/api/users/me/saved-recipes/:recipeId', authMiddleware, async (req, res) => {
    try {
        const { recipeId } = req.params;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Korisnik nije pronađen.'
            });
        }

        user.savedRecipes = user.savedRecipes.filter(
            id => id.toString() !== recipeId
        );

        await user.save();

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

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server radi na portu ${PORT}`);
});