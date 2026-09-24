const Faculty = require("../models/Faculty");

const createFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.create(req.body);

        res.status(201).json({
            success: true,
            message: "Faculty created successfully",
            data: faculty
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.find().sort({
            createdAt: -1
        });

        res.json({
            success: true,
            count: faculty.length,
            data: faculty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/* =====================================================
   DELETE FACULTY
===================================================== */

const deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;

        const faculty = await Faculty.findByIdAndDelete(id);

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty not found"
            });
        }

        res.json({
            success: true,
            message: "Faculty deleted successfully",
            data: faculty
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createFaculty,
    getFaculty,
    deleteFaculty
};