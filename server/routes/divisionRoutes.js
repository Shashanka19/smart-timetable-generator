const express = require("express");

const {
    createDivision,
    getDivisions
} = require("../controllers/divisionController");

const router = express.Router();

router.post("/", createDivision);
router.get("/", getDivisions);

module.exports = router;