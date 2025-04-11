import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  mailId: { type: String, required: true, unique: true },
  password: { type: String, require: true },
});

const User = mongoose.model("User", userSchema);

export default User;
