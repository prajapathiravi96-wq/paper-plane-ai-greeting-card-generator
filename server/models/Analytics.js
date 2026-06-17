import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GreetingCard',
    required: true,
  },
  occasion: {
    type: String,
    required: true,
    trim: true,
  },
  tone: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
