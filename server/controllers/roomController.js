const Room = require("../models/Room");

const createRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);

        res.status(201).json({
            success: true,
            message: "Room created successfully",
            data: room
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createRoom,
    getRooms
};