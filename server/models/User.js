import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  displayName: { type: String },
  email: { type: String },
});

export default mongoose.model("User", UserSchema);
