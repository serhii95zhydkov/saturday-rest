const path = require("path");
const express = require("express");
require("colors");

const { engine } = require("express-handlebars");

const sendEmail = require("./services/sendEmail");

const errorHandler = require("./middlewares/errorHandler");

const connectDB = require("../config/connectDB");

const app = express();

app.use(express.static("public"));

// Set template engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "backend/views");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dotenv = require("dotenv");
const envPath = path.join(__dirname, "..", "config", ".env");

dotenv.config({ path: envPath });

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/andrii", async (req, res) => {
  // res.send(req.body);
  try {
    res.render("andrii", {
      message: "Contact form send success!",
      author: req.body.userName,
      email: req.body.userEmail,
    });
    await sendEmail(req.body);
  } catch (error) {
    res.send(error.message);
  }
});

app.use("/api/v1", require("./routes/filmsRoutes"));
app.use("/", require("./routes/authRoutes"));

app.use(errorHandler);

// const fs = require("fs/promises");
// const path = require("path");

// const avatarsPath = path.join(__dirname, "avatars");

// const tempPath = path.join(__dirname, "temp");

// async function moveFile() {
//   await fs.rename(tempPath, avatarsPath);
// }

// moveFile();

connectDB();

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`.green.italic.bold);
});
