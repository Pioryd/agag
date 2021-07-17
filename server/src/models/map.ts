import mongoose, { Schema, Document } from "mongoose";

export interface Map extends Document {
  floors: number[][];
  objects: number[][];
}

const MapSchema: Schema<Map> = new Schema({
  floors: { type: [[Number]], required: true },
  objects: { type: [[Number]], required: true }
});

export default mongoose.model<Map>("Map", MapSchema);
