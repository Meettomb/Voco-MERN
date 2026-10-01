import mongoose from "mongoose";

const profilePicSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProfilePic = mongoose.model("ProfilePic",profilePicSchema);

export default ProfilePic;