const express = require("express");

const {
    createDivision,
    getDivisions,
    deleteDivision
} = require("../controllers/divisionController");

const router = express.Router();

router.post("/", createDivision);

router.get("/", getDivisions);

router.delete("/:id", deleteDivision);

module.exports = router;