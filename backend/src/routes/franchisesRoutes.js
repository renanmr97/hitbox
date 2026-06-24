const express = require("express");
const router = express.Router();
const {
  listFranchises,
  getFranchiseById,
  createFranchise,
  updateFranchise,
  deleteFranchise,
} = require("../controllers/franchisesController");

router.get("/", listFranchises);
router.get("/:id", getFranchiseById);
router.post("/", createFranchise);
router.put("/:id", updateFranchise);
router.delete("/:id", deleteFranchise);

module.exports = router;