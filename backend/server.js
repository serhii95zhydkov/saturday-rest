const path = require("path");
const express = require("express");
require("colors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/authMiddleware");

const rolesModel = require("./models/rolesModel");

const asyncHandler = require("express-async-handler");

const errorHandler = require("./middlewares/errorHandler");

const usersModel = require("./models/usersModel");

const connectDB = require("../config/connectDB");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dotenv = require("dotenv");
const envPath = path.join(__dirname, "..", "config", ".env");

dotenv.config({ path: envPath });

app.use("/api/v1", require("./routes/filmsRoutes"));

// Реєстрація - це створення користувача в базі

// Аутентифікація - перевірка даних, які надав користувач із даними, які зберігаються у базі

// Авторизація - перевірка прав доступу до даних сайту або виконання певних дій на сайті

// Логаут - вихід із системи

app.post(
  "/register",
  asyncHandler(async (req, res) => {
    // 1. Перевірка даних, які ввів користувач
    const { email, password } = req.body;
    // console.log(email)
    // console.log(password)

    if (!email || !password) {
      res.status(400);
      throw new Error("Controller: provide all required filds");
    }

    // 2. Пошук користувача у базі даних по пошті

    const candidate = await usersModel.findOne({ email });

    // 3. Якщо знайшли то повідомляємо, що користувач вже є

    if (candidate) {
      res.status(400);
      throw new Error("Email in use");
    }

    // 4. Якщо не знайшли то хешуємо пароль

    const hashPassword = bcrypt.hashSync(password, 5);

    // 5. Зберігаємо користувача в базі
    const userRole = await rolesModel.findOne({ value: "ADMIN" });
    // console.log(userRole)
    const result = await usersModel.create({
      ...req.body,
      password: hashPassword,
      roles: [userRole.value],
    });

    if (!result) {
      res.status(400);
      throw new Error("Unable to save in db");
    }

    return res.status(201).json({ code: 201, data: result.email });
  })
);

app.post(
  "/login",
  asyncHandler(async (req, res) => {
    // 1. Перевірка даних, які ввів користувач
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Controller: provide all required fields");
    }
    // 2. Шукаємо користувача в базі даних і розшифровуємо пароль
    const user = await usersModel.findOne({ email });

    const isValidPassword = bcrypt.compareSync(password, user.password);

    // 3. Якщо не знайшли користувача або не розшифрували пароль видаємо помилку "Невірний логін або пароль"
    if (!isValidPassword || !user) {
      res.status(400);
      throw new Error("Invalid login or password");
    }

    // 4. Якщо все ок, то генеруємо токен
    const data = {
      friends: ["Andrii", "Serhii", "Maryna"],
      city: "Kharkiv",
      id: user._id,
      roles: user.roles,
    };
    const token = generateToken(data);
    // console.log(token)

    // 5. Зберігаємо токен користувача у базі
    user.token = token;
    const userWithToken = await user.save();
    if (!userWithToken) {
      res.status(400);
      throw new Error("Unable to save token");
    }

    return res
      .status(200)
      .json({ code: 200, data: { email: user.email, token: user.token } });
  })
);

function generateToken(payload) {
  return jwt.sign(payload, "pizza", { expiresIn: "3h" });
}

app.get(
  "/logout",
  authMiddleware,
  asyncHandler(async (req, res) => {
    // console.log(req.user)
    const { id } = req.user;
    const updatedUser = await usersModel.findByIdAndUpdate(id, { token: null });
    if (!updatedUser) {
      res.status(400);
      throw new Error("Unable to remove token");
    }

    return res.status(200).json({ code: 200, message: "success" });
  })
);

app.use(errorHandler);

const fs = require("fs/promises");
// const path = require("path");

const avatarsPath = path.join(__dirname, "avatars");

const tempPath = path.join(__dirname, "temp");

async function moveFile() {
  await fs.rename(tempPath, avatarsPath);
}

moveFile();

connectDB();

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`.green.italic.bold);
});
