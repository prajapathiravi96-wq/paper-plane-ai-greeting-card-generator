import mongoose from 'mongoose';

const greetingCardSchema = new mongoose.Schema(
  {
    occasion: {
      type: String,
      required: [true, 'Occasion is required'],
      trim: true,
    },
    tone: {
      type: String,
      required: [true, 'Tone is required'],
      trim: true,
    },
    recipient: {
      type: String,
      required: [true, 'Recipient name is required'],
      trim: true,
    },
    sender: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
    },
    length: {
      type: String,
      enum: ['Short', 'Medium', 'Long'],
      default: 'Medium',
    },
    language: {
      type: String,
      enum: ['English', 'Hindi'],
      default: 'English',
    },
    title: {
      type: String,
      required: [true, 'AI-generated title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'AI-generated message is required'],
      trim: true,
    },
    caption: {
      type: String,
      required: [true, 'AI-generated caption is required'],
      trim: true,
    },
    giftTag: {
      type: String,
      required: [true, 'AI-generated gift tag is required'],
      trim: true,
    },
    template: {
      type: String,
      default: 'minimalist',
    },
  },
  {
    timestamps: true,
  }
);

const GreetingCard = mongoose.model('GreetingCard', greetingCardSchema);

export default GreetingCard;
