// http://localhost:5000/

const authController = require("../controllers/AuthController");

const authMiddleware = require("../middlewares/authMiddleware");

const express = require("express");

const authRouter = express.Router();

// Реєстрація - це створення користувача в базі

// Аутентифікація - перевірка даних, які надав користувач із даними, які зберігаються у базі

// Авторизація - перевірка прав доступу до даних сайту або виконання певних дій на сайті

// Логаут - вихід із системи

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.login);

authRouter.get("/logout", authMiddleware, authController.logout);

module.exports = authRouter;
