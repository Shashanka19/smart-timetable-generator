const express = require("express");

const {
    createFaculty,
    getFaculty,
    deleteFaculty
} = require("../controllers/facultyController");

const router = express.Router();

router.post("/", createFaculty);

router.get("/", getFaculty);

router.delete("/:id", deleteFaculty);

module.exports = router;