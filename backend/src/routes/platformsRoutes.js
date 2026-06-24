const express = require("express");
const router = express.Router();
const {
  listPlatforms,
  getPlatformById,
  createPlatform,
  updatePlatform,
  deletePlatform,
} = require("../controllers/platformsController");

router.get("/", listPlatforms);
router.get("/:id", getPlatformById);
router.post("/", createPlatform);
router.put("/:id", updatePlatform);
router.delete("/:id", deletePlatform);

module.exports = router;