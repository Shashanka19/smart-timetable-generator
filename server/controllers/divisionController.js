const Division = require("../models/Division");

const createDivision = async (req, res) => {
    try {
        const division = await Division.create(req.body);

        res.status(201).json({
            success: true,
            message: "Division created successfully",
            data: division
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getDivisions = async (req, res) => {
    try {
        const divisions = await Division.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: divisions.length,
            data: divisions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createDivision,
    getDivisions
};