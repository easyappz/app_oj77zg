const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  genderFilter: { type: String, enum: ['all', 'male', 'female'], default: 'all' },
  ageFilter: { type: String, enum: ['all', '18-25', '26-35', '36+'], default: 'all' },
  totalRatings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Photo', PhotoSchema);
