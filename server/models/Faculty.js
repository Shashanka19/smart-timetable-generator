const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        department: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        availableSlots: [
            {
                day: {
                    type: String,
                    required: true
                },
                period: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Faculty", facultySchema);