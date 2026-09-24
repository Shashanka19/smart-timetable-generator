const { generateTimetable } = require("../services/scheduler");

const generate = async (req, res) => {
    try {
        const result = await generateTimetable();

        res.status(200).json(result);
    } catch (error) {
        console.error("Timetable generation error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    generate
};