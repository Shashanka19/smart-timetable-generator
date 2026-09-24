const express = require("express");

const {
    createFaculty,
    getFaculty
} = require("../controllers/facultyController");

const router = express.Router();

router.post("/", createFaculty);
router.get("/", getFaculty);

module.exports = router;