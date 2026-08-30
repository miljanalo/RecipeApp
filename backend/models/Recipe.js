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
        type: Number
    },

    difficulty: {
        type: String,
        required: true
    },

    mealType: {
        type: String
    },

    likes: {
        type: Number,
        default: 0
    },

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

    comments: {
        type: [
            {
                author: String,
                text: String,
                date: String,
                rating: Number
            }
        ],
        default: []
    }
});

module.exports = mongoose.model('Recipe', recipeSchema);