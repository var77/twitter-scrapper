import mongoose, { Schema } from 'mongoose';

const TweetSchema = new Schema({
  topic: String,
  text: String,
  id: String,
});

export const Tweet = mongoose.model('Tweet', TweetSchema);
