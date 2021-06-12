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
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA5Cf20HBBaTzJgCw3uNCXpFLc4ujI_tIghw&usqp=CAU",
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
