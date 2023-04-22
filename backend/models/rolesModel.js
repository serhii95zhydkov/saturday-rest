const { Schema, model } = require("mongoose");

const rolesSchema = Schema({
  value: {
    type: String,
    default: "USER",
  },
});

module.exports = model("roles", rolesSchema);
