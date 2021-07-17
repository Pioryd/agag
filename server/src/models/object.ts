import mongoose, { Schema, Document } from "mongoose";

export interface Object extends Document {
  floors: number[][];
  objects: number[][];
}

const ObjectSchema: Schema<Object> = new Schema({
  floors: { type: [[Number]], required: true },
  objects: { type: [[Number]], required: true }
});

export default mongoose.model<Object>("Object", ObjectSchema);
