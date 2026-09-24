const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        roomNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        type: {
            type: String,
            enum: ["CLASSROOM", "LAB"],
            required: true
        },
        capacity: {
            type: Number,
            required: true,
            min: 1
        },
        building: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Room", roomSchema);