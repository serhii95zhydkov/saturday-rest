const FilmsModel = require("../models/filmsModel");
const asyncHandler = require("express-async-handler");

class FilmsController {
  add = asyncHandler(async (req, res) => {
    const { title, rating } = req.body;
    if (!title || !rating) {
      res.status(400);
      throw new Error("Controller: provide all required filds");
    }

    const film = await FilmsModel.create({ ...req.body });
    if (!film) {
      res.status(400);
      throw new Error("Controller: unable to save film");
    }

    res.status(201).json({ code: 201, message: "succes", data: film });
  });

  getAll = asyncHandler(async (req, res) => {
    const films = await FilmsModel.find({});
    if (!films) {
      res.status(400);
      throw new Error("Controller: unable to save film");
    }
    res
      .status(201)
      .json({ code: 201, message: "succes", data: films, qty: films.length });
  });

  getFilmById = (req, res) => {
    console.log("getFilmById");
  };
  update = (req, res) => {
    console.log("update");
  };
  remove = (req, res) => {
    console.log("remove");
  };
}

module.exports = new FilmsController();
