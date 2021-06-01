const { Schema, model } = require("mongoose");

const restaurantSchema = new Schema({
  restaurantName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    // default: SOMETHING
  },
  meals: [{ type: Schema.Types.ObjectId, ref: "Meal" }],
  contact: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otherInfo: {
    type: String,
  },
  location: {
    type: String, //MAPBOX - MODIFY LATER
    required: true,
  },
});

const Restaurant = model("Restaurant", restaurantSchema);

module.exports = Restaurant;
