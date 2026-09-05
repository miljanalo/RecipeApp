const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        
        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        bio: {
            type: String,
            default: ''
        },

        profilePicture: {
            type: String,
            default: ''
        },

        savedRecipes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Recipe'
            }
        ],

        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],

        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);