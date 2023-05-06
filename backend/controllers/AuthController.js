const asyncHandler = require("express-async-handler");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usersModel = require("../models/usersModel");
const rolesModel = require("../models/rolesModel");

class AuthController {
  register = asyncHandler(async (req, res) => {
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
  });

  login = asyncHandler(async (req, res) => {
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
  });

  logout = asyncHandler(async (req, res) => {
    // console.log(req.user)
    const { id } = req.user;
    const updatedUser = await usersModel.findByIdAndUpdate(id, { token: null });
    if (!updatedUser) {
      res.status(400);
      throw new Error("Unable to remove token");
    }

    return res.status(200).json({ code: 200, message: "success" });
  });
}

function generateToken(payload) {
  return jwt.sign(payload, "pizza", { expiresIn: "3h" });
}

module.exports = new AuthController();
