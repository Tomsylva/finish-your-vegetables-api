const { Schema, model } = require("mongoose");

const mealSchema = new Schema({
  mealName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    // default: SOMETHING
  },
  otherInfo: {
    type: String,
  },
  mealType: {
    type: String,
    default: "meat",
    enum: ["meat", "vegetarian", "vegan"],
  },
  reserved: {
    type: Boolean,
    default: false,
  },
  reservedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  price: {
    type: Number,
  },
  orderCompleted: {
    type: Boolean,
    default: false,
  },
});

const Meal = model("Meal", mealSchema);

module.exports = Meal;
