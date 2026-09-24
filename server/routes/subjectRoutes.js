const express = require("express");

const {
    createSubject,
    getSubjects,
    updateSubject
} = require("../controllers/subjectController");

const router = express.Router();

router.post("/", createSubject);
router.get("/", getSubjects);
router.patch("/:id", updateSubject);

module.exports = router;