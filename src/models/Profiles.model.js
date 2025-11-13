const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },

  gamesList: [
    {
      name: {
        type: String,
        required: true
      }
    }
  ],

  commentHistory: [
    {
      gameId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
      },
      note: {
        type: Number,
        min: 0,
        max: 10
      },
      content: {
        type: String
      },
      type: {
        type: String,
        default: "review"
      }
    }
  ]
});

module.exports = mongoose.model("Profile", profileSchema);
