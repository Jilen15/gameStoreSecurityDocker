import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },

  gamesList: [
    {
      name: {
        type: String
      },
    },
  ],

  commentHistory: [
    {
      gameId: {
        type: Number,
        required: true,
        unique: true,
      },
      note: {
        type: Number,
        min: 0,
        max: 10,
      },
      content: {
        type: String,
      },
      type: {
        type: String,
        default: "review",
      },
    },
  ],
});

export default mongoose.model("Profile", profileSchema);
