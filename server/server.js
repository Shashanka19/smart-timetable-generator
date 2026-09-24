const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const facultyRoutes = require("./routes/facultyRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const roomRoutes = require("./routes/roomRoutes");
const divisionRoutes = require("./routes/divisionRoutes");
const timetableRoutes = require("./routes/timetableRoutes");

const app = express();


app.use(cors());
app.use(express.json());

connectDB();

app.use(express.json());
app.use("/api/faculty", facultyRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/divisions", divisionRoutes);
app.use("/api/timetable", timetableRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Smart Timetable Generator API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});