const express = require("express");
const router = express.Router();
const { 
    listGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame
} = require("../controllers/gamesController");

router.get("/", listGames);
router.get("/:id", getGameById);
router.post("/", createGame);
router.put("/:id", updateGame);
router.delete("/:id", deleteGame);

module.exports = router;