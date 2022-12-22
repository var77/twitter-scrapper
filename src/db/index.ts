import mongoose from 'mongoose';
import { Topic } from './models/topic';

export const connect = async (dbUri: string) => {
  mongoose.set('strictQuery', false)
  return mongoose.connect(dbUri);
};

export const seedDatabase = async () => {
  const topics = await Topic.count();
  if (topics) return;
  await Topic.insertMany([
    { name: 'Led Zeppelin' },
    { name: 'Lady Gaga' },
    { name: 'Esports' },
    { name: 'Docker' },
  ])
};
