const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// APIs za login i registraciju

// registracija
router.post('/register', async (req, res) => {
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

// login
router.post('/login', async (req, res) => {
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

// trenutni korisnik
router.get('/me', authMiddleware, async (req, res) => {
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

// izmena profila
router.put('/me', authMiddleware, async (req, res) => {
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

module.exports = router;