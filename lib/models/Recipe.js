const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  measurement: {
    type: String,
    required: true,
    enum: ['teaspoon', 'tablespoon', 'cup', 'ounce', 'grams']
  },
  name: {
    type: String,
    required: true
  }
});

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ingredients: [ingredientSchema],
  directions: [String],
}, {
  id: false,
  toJSON: {
    virtuals: true
  },
  // toObject: {
  //   virtuals: true
  // }
});

schema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'recipeId'
});


module.exports = mongoose.model('Recipe', schema);
