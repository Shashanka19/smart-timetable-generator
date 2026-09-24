const express = require("express");

const {
    createSubject,
    getSubjects,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");

const router = express.Router();

router.post("/", createSubject);

router.get("/", getSubjects);

router.patch("/:id", updateSubject);

router.delete("/:id", deleteSubject);

module.exports = router;