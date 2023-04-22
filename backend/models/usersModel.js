const { Schema, model } = require("mongoose");

const usersSchema = Schema({
  name: {
    type: String,
    default: "Володимир Зеленський",
  },
  email: {
    type: String,
    required: [true, "db: email is required"],
  },
  password: {
    type: String,
    required: [true, "db: password is required"],
  },
  token: {
    type: String,
    default: null,
  },
  roles: [{ type: String, ref: "Role" }],
});

module.exports = model("users", usersSchema);
