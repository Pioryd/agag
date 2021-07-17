import mongoose, { Schema, Document } from "mongoose";

export interface Sprite extends Document {
  path: string;
  url: string;
  animations: {
    [name: string]: number[][];
  };
  frame: {
    width: number;
    height: number;
    flip?: boolean;
    time?: number;
  };
}

const SpriteSchema: Schema<Sprite> = new Schema({
  path: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  animations: { type: Object, required: true },
  frame: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    flip: { type: Boolean },
    time: { type: Number }
  }
});

export default mongoose.model<Sprite>("Sprite", SpriteSchema);
