const Photo = require('../../models/Photo');
const User = require('../../models/User');
const Rating = require('../../models/Rating');
const multer = require('multer');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage }).single('photo');

// Upload photo
exports.uploadPhoto = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed: ' + err.message });
    }
    try {
      const photo = new Photo({
        userId: req.user.userId,
        url: req.file.path,
      });
      await photo.save();
      res.status(201).json({ photo });
    } catch (error) {
      res.status(500).json({ error: 'Photo upload failed: ' + error.message });
    }
  });
};

// Toggle photo active status for rating
exports.togglePhotoActive = async (req, res) => {
  try {
    const { photoId } = req.params;
    const user = await User.findById(req.user.userId);
    if (user.points <= 0) {
      return res.status(400).json({ error: 'Not enough points to enable photo for rating' });
    }
    const photo = await Photo.findOne({ _id: photoId, userId: req.user.userId });
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    photo.isActive = !photo.isActive;
    await photo.save();
    res.json({ photo });
  } catch (error) {
    res.status(500).json({ error: 'Toggle photo active status failed: ' + error.message });
  }
};

// Set filters for photo
exports.setPhotoFilters = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { genderFilter, ageFilter } = req.body;
    const photo = await Photo.findOne({ _id: photoId, userId: req.user.userId });
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    photo.genderFilter = genderFilter || photo.genderFilter;
    photo.ageFilter = ageFilter || photo.ageFilter;
    await photo.save();
    res.json({ photo });
  } catch (error) {
    res.status(500).json({ error: 'Set photo filters failed: ' + error.message });
  }
};

// Get photos for rating (filtered)
exports.getPhotosForRating = async (req, res) => {
  try {
    const { gender, age } = req.query;
    const filter = {
      isActive: true,
      userId: { $ne: req.user.userId },
    };
    if (gender) filter.genderFilter = { $in: ['all', gender] };
    if (age) {
      let ageRange;
      if (age >= 18 && age <= 25) ageRange = '18-25';
      else if (age >= 26 && age <= 35) ageRange = '26-35';
      else if (age > 35) ageRange = '36+';
      if (ageRange) filter.ageFilter = { $in: ['all', ageRange] };
    }
    const photos = await Photo.find(filter);
    res.json({ photos });
  } catch (error) {
    res.status(500).json({ error: 'Get photos for rating failed: ' + error.message });
  }
};

// Rate a photo
exports.ratePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { rating, raterGender, raterAge } = req.body;
    const photo = await Photo.findOne({ _id: photoId, isActive: true });
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found or not active' });
    }
    if (photo.userId.toString() === req.user.userId.toString()) {
      return res.status(400).json({ error: 'Cannot rate your own photo' });
    }
    const existingRating = await Rating.findOne({ photoId, userId: req.user.userId });
    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this photo' });
    }
    const newRating = new Rating({
      photoId,
      userId: req.user.userId,
      rating,
      raterGender,
      raterAge,
    });
    await newRating.save();

    // Update photo stats
    photo.totalRatings += 1;
    photo.averageRating = (photo.averageRating * (photo.totalRatings - 1) + rating) / photo.totalRatings;
    await photo.save();

    // Update points: rater gains 1 point, photo owner loses 1 point
    await User.findByIdAndUpdate(req.user.userId, { $inc: { points: 1 } });
    await User.findByIdAndUpdate(photo.userId, { $inc: { points: -1 } });

    res.status(201).json({ rating: newRating, photo });
  } catch (error) {
    res.status(500).json({ error: 'Rate photo failed: ' + error.message });
  }
};
