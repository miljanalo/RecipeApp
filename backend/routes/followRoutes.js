const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// APIs za pratioce ---------------------------------------------------------------------------------------------------

// POST - pracenje korisnika
router.post('/:id/follow', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;      // korisnik koji prati
        const targetUserId = req.params.id; // korisnik kojeg pratimo

        // ne mozes pratiti samog sebe
        if (userId.toString() === targetUserId) {
            return res.status(400).json({
                message: 'Ne možete pratiti sami sebe.'
            });
        }

        // pronadji oba korisnika
        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({
                message: 'Korisnik nije pronađen.'
            });
        }

        // proveri da li vec prati korisnika
        if (user.following.includes(targetUserId)) {
            return res.status(400).json({
                message: 'Već pratite ovog korisnika.'
            });
        }

        // dodaj korisnika u following
        user.following.push(targetUserId);

        // dodaj trenutnog korisnika u followers target korisnika
        targetUser.followers.push(userId);

        await user.save();
        await targetUser.save();

        res.status(200).json({
            message: 'Korisnik je uspešno zapraćen.',
            following: user.following,
            followers: targetUser.followers
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// DELETE - otpracivanje korisnika
router.delete('/:id/follow', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const targetUserId = req.params.id;

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return res.status(404).json({
                message: 'Korisnik nije pronađen.'
            });
        }

        user.following = user.following.filter(
            id => id.toString() !== targetUserId
        );

        targetUser.followers = targetUser.followers.filter(
            id => id.toString() !== userId.toString()
        );

        await user.save();
        await targetUser.save();

        res.status(200).json({
            message: 'Korisnik je uspešno otpraćen.',
            following: user.following,
            followers: targetUser.followers
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET - pratioci korisnika
router.get('/:id/followers', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('followers', 'firstName lastName username profilePicture');

        if (!user) {
            return res.status(404).json({
                message: 'Korisnik nije pronađen.'
            });
        }

        res.status(200).json(user.followers);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET - korisnici koje korisnik prati
router.get('/:id/following', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('following', 'firstName lastName username profilePicture');

        if (!user) {
            return res.status(404).json({
                message: 'Korisnik nije pronađen.'
            });
        }

        res.status(200).json(user.following);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET - provera da li trenutni korisnik prati korisnika
router.get('/:id/follow-status', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const targetUserId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'Korisnik nije pronađen.'
            });
        }

        const isFollowing = user.following.some(
            id => id.toString() === targetUserId
        );

        res.status(200).json({
            isFollowing
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;