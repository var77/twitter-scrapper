import mongoose, { Schema, HydratedDocument } from 'mongoose';

export interface ITopic {
  name: string,
  lastId: string
}

const TopicSchema = new Schema<ITopic>({
  name: String,
  lastId: String,
});

export type TopicDocument = HydratedDocument<ITopic>;
export const Topic = mongoose.model<ITopic>('Topic', TopicSchema);
