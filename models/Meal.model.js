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
    default: "With Meat",
    enum: ["With Meat", "Vegetarian", "Vegan"],
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
});

const Meal = model("Meal", mealSchema);

module.exports = Meal;