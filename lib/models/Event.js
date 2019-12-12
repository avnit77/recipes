const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  dateOfEvent: {
    type: Date,
    required: true
  },
  notes: String,
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  }
});

schema.virtual('day')
  .get(function() {
    return (this.dateOfEvent).toLocaleString('default', { weekday: 'long' });
  })
  .set(function() {
    let day = this.dateOfEvent.getDay();
    this.dateOfEvent.setDate(day);
  });

schema.virtual('month')
  .get(function() {
    return (this.dateOfEvent).toLocaleString('default', { month: 'long' });
  })
  .set(function() {
    let newMonth = this.dateOfEvent.getMonth();
    this.dateOfEvent.setMonth(newMonth - 1);
  });

schema.virtual('year')
  .get(function() {
    return this.dateOfEvent.getFullYear();
  })
  .set(function() {
    let year = this.dateOfEvent.getFullYear();
    this.dateOfEvent.setYear(year - 1);
  });



module.exports = mongoose.model('Event', schema);
