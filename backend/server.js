const path = require("path");
const express = require("express");
require("colors");

const errorHandler = require("./middlewares/errorHandler");

const connectDB = require("../config/connectDB");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dotenv = require("dotenv");
const envPath = path.join(__dirname, "..", "config", ".env");

dotenv.config({ path: envPath });

app.use("/api/v1", require("./routes/filmsRoutes"));

app.use(errorHandler);

connectDB();

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`.green.italic.bold);
});
