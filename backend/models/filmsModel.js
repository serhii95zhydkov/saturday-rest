const { Schema, model } = require("mongoose");

const filmsSchema = Schema({
  title: {
    type: String,
    required: [true, "db: title is required"],
  },
  director: {
    type: String,
    default: "Martin Scorsese",
  },
  year: {
    type: Number,
    default: 2006,
  },
  rating: {
    type: Number,
    required: [true, "db: rating is required"],
  },
});

module.exports = model("films", filmsSchema);
