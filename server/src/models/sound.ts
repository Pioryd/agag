import mongoose, { Schema, Document } from "mongoose";

export interface Sound extends Document {
  path: string;
  url: string;
}

const SoundSchema: Schema<Sound> = new Schema({
  path: { type: String, required: true, unique: true },
  url: { type: String, required: true }
});

export default mongoose.model<Sound>("Sound", SoundSchema);
