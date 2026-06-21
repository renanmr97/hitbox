const express = require("express");
const router = express.Router();
const { listGames, getGameById, createGame } = require("../controllers/gamesController");

router.get("/", listGames);
router.get("/:id", getGameById);
router.post("/", createGame);

module.exports = router;