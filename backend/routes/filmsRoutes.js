// http://localhost:5000/api/v1/films

const filmsController = require("../controllers/FilmsController");
// /api/v1/films

const rolesMiddleware = require("../middlewares/rolesMiddleware")

const express = require("express");

const filmsRouter = express.Router();

// Додати фільм у базу
filmsRouter.post(
  "/films",
  (req, res, next) => {
    console.log("Joi works!");
    next();
  },
  filmsController.add
);

// Отримати всі фільми
filmsRouter.get("/films", rolesMiddleware(["ADMIN", "EDITOR"]), filmsController.getAll);

// Отримати один фільм
filmsRouter.get("/films/:id", filmsController.getFilmById);

// Оновити фільм
filmsRouter.put("/films/:id", filmsController.update);

// Видалити фільм
filmsRouter.delete("/films/:id", filmsController.remove);


// "USER", "CUSTOMER", "EDITOR", "MODERATOR", "ACCOUNTER"
// ["USER", "EDITOR", "ADMIN"]

// console.log("Router test");
module.exports = filmsRouter;
