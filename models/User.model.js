const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    favouriteRestaurants: [{ type: Schema.Types.ObjectId, ref: "Retaurant" }],
    history: [{ type: Schema.Types.ObjectId, ref: "Meal" }],
    completedHistory: [{ type: Schema.Types.ObjectId, ref: "Meal" }],
    userImage: {
      type: String,
      default:
        "https://res.cloudinary.com/tom-j-sylva/image/upload/v1624624238/finish-your-vegetables/FYV_klmsqc.png",
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
