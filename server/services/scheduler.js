const Faculty = require("../models/Faculty");
const Subject = require("../models/Subject");
const Room = require("../models/Room");
const Division = require("../models/Division");

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = [1, 2, 3, 4, 5, 6];

const generateTimetable = async () => {
    const [faculty, subjects, rooms, divisions] = await Promise.all([
        Faculty.find(),
        Subject.find().populate("facultyId"),
        Room.find(),
        Division.find()
    ]);

    const timetable = [];
    const conflicts = [];

    // Track occupied resources
    const facultyBusy = new Set();
    const divisionBusy = new Set();
    const roomBusy = new Set();

    // Create all subject sessions
    const sessions = [];

    for (const division of divisions) {
        const divisionSubjects = subjects.filter(
            (subject) => subject.department === division.department
        );

        for (const subject of divisionSubjects) {
            for (let i = 0; i < subject.hoursPerWeek; i++) {
                sessions.push({
                    division,
                    subject,
                    sessionNumber: i + 1
                });
            }
        }
    }

    // Schedule each session
    for (const session of sessions) {
        const { division, subject } = session;

        if (!subject.facultyId) {
            conflicts.push({
                subject: subject.code,
                division: division.name,
                reason: "No faculty assigned"
            });
            continue;
        }

        const assignedFaculty = subject.facultyId;

        let scheduled = false;

        for (const day of DAYS) {
            if (scheduled) break;

            for (const period of PERIODS) {
                if (scheduled) break;

                const slotKey = `${day}-${period}`;

                const facultyKey = `${assignedFaculty._id}-${slotKey}`;
                const divisionKey = `${division._id}-${slotKey}`;

                // Faculty availability
                const isAvailable = assignedFaculty.availableSlots.some(
                    (slot) =>
                        slot.day === day &&
                        slot.period === period
                );

                if (!isAvailable) {
                    continue;
                }

                // Faculty clash
                if (facultyBusy.has(facultyKey)) {
                    continue;
                }

                // Division clash
                if (divisionBusy.has(divisionKey)) {
                    continue;
                }

                // Find suitable room
                const suitableRoom = rooms.find((room) => {
                    const roomKey = `${room._id}-${slotKey}`;

                    if (roomBusy.has(roomKey)) {
                        return false;
                    }

                    // Capacity constraint
                    if (room.capacity < division.studentCount) {
                        return false;
                    }

                    // Lab constraint
                    if (
                        subject.requiresLab &&
                        room.type !== "LAB"
                    ) {
                        return false;
                    }

                    // Theory classes should preferably use classrooms
                    if (
                        !subject.requiresLab &&
                        room.type !== "CLASSROOM"
                    ) {
                        return false;
                    }

                    return true;
                });

                if (!suitableRoom) {
                    continue;
                }

                // Assign slot
                timetable.push({
                    day,
                    period,
                    division: {
                        id: division._id,
                        name: division.name
                    },
                    subject: {
                        id: subject._id,
                        code: subject.code,
                        name: subject.name,
                        type: subject.type
                    },
                    faculty: {
                        id: assignedFaculty._id,
                        name: assignedFaculty.name,
                        employeeId: assignedFaculty.employeeId
                    },
                    room: {
                        id: suitableRoom._id,
                        name: suitableRoom.name,
                        roomNumber: suitableRoom.roomNumber,
                        type: suitableRoom.type
                    }
                });

                // Mark resources as busy
                facultyBusy.add(facultyKey);
                divisionBusy.add(divisionKey);
                roomBusy.add(`${suitableRoom._id}-${slotKey}`);

                scheduled = true;
            }
        }

        if (!scheduled) {
            conflicts.push({
                subject: subject.code,
                division: division.name,
                reason: "No valid time slot available"
            });
        }
    }

    return {
        success: conflicts.length === 0,
        scheduledCount: timetable.length,
        conflictCount: conflicts.length,
        timetable,
        conflicts
    };
};

module.exports = {
    generateTimetable
};