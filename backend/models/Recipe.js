const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    image: {
        type: String
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    description: {
        type: String
    },

    rating: {
        type: Number,
        default: 0
    },   

    ratings: {
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                value: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5
                }
            }
        ], 
    },

    difficulty: {
        type: String,
        required: true
    },

    mealType: {
        type: String
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    saves: {
        type: Number,
        default: 0
    },

    cookTime: {
        type: Number,
        required: true
    },

    servings: {
        type: Number
    },

    ingredients: {
        type: [String],
        default: []
    },

    instructions: {
        type: [String],
        default: []
    },

    comments: [
        {
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            text: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = mongoose.model('Recipe', recipeSchema);