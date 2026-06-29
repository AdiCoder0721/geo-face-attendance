import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "student"
  },
  faceDescriptor: {
  type: [Number],
  default: []
}
});

export default mongoose.model("User", userSchema);