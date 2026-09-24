import { useState } from "react";
import axios from "axios";

import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useLocation
} from "react-router-dom";

import Faculty from "./pages/Faculty";
import Subjects from "./pages/Subjects";
import Rooms from "./pages/Rooms";
import Divisions from "./pages/Divisions";

import "./App.css";

const API_URL = "http://localhost:5000/api";

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

const periods = [1, 2, 3, 4, 5, 6];


/* =====================================================
   NAVIGATION
===================================================== */

function Navigation() {

    const location = useLocation();

    const navItems = [
        {
            path: "/",
            label: "Dashboard"
        },
        {
            path: "/faculty",
            label: "Faculty"
        },
        {
            path: "/subjects",
            label: "Subjects"
        },
        {
            path: "/rooms",
            label: "Rooms"
        },
        {
            path: "/divisions",
            label: "Divisions"
        }
    ];

    return (
        <nav className="navbar">

            <div className="navbar-brand">

                <div className="brand-icon">
                    ST
                </div>

                <div>

                    <div className="brand-title">
                        Smart Timetable
                    </div>

                    <div className="brand-subtitle">
                        Generator
                    </div>

                </div>

            </div>


            <div className="nav-links">

                {navItems.map((item) => (

                    <Link
                        key={item.path}
                        to={item.path}
                        className={
                            location.pathname === item.path
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        {item.label}
                    </Link>

                ))}

            </div>

        </nav>
    );
}


/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard() {

    const [timetable, setTimetable] = useState([]);

    const [stats, setStats] = useState({
        scheduled: 0,
        conflicts: 0,
        subjects: 0,
        rooms: 0
    });

    const [conflicts, setConflicts] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    /* =================================================
       GENERATE TIMETABLE
    ================================================= */

    const generateTimetable = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await axios.post(
                `${API_URL}/timetable/generate`
            );

            const result = response.data;

            /*
             * Backend returns:
             *
             * {
             *   success: true,
             *   scheduledCount: 6,
             *   conflictCount: 0,
             *   timetable: [...]
             * }
             */

            const generatedTimetable =
                result.timetable || [];

            setTimetable(generatedTimetable);

            setConflicts(result.conflicts || []);


            /* -----------------------------------------
               Calculate unique subjects
            ----------------------------------------- */

            const uniqueSubjects = new Set(
                generatedTimetable
                    .map((entry) => entry.subject?.id)
                    .filter(Boolean)
            );


            /* -----------------------------------------
               Calculate unique rooms
            ----------------------------------------- */

            const uniqueRooms = new Set(
                generatedTimetable
                    .map((entry) => entry.room?.id)
                    .filter(Boolean)
            );


            setStats({
                scheduled: result.scheduledCount || 0,
                conflicts: result.conflictCount || 0,
                subjects: uniqueSubjects.size,
                rooms: uniqueRooms.size
            });

        } catch (err) {

            console.error(
                "Timetable generation error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to generate timetable."
            );

        } finally {

            setLoading(false);

        }
    };


    /* =================================================
       FIND CLASS FOR SLOT
    ================================================= */

    const getEntry = (day, period) => {

        return timetable.find(
            (item) =>
                item.day === day &&
                Number(item.period) === Number(period)
        );

    };


    return (
        <div className="dashboard-container">

            {/* =========================================
                HERO
            ========================================= */}

            <section className="hero-section">

                <div className="hero-badge">
                    Constraint-Based Scheduling
                </div>

                <h1>
                    Smart Timetable Generator
                </h1>

                <p>
                    Automatically generate conflict-free academic
                    timetables using faculty availability, rooms,
                    divisions and subject constraints.
                </p>

                <button
                    className="primary-button"
                    onClick={generateTimetable}
                    disabled={loading}
                >

                    {loading
                        ? "Generating..."
                        : "Generate Timetable"}

                </button>

            </section>


            {/* =========================================
                ERROR
            ========================================= */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* =========================================
                STATISTICS
            ========================================= */}

            <section className="stats-grid">

                <div className="stat-card">

                    <div className="stat-label">
                        Scheduled Classes
                    </div>

                    <div className="stat-value">
                        {stats.scheduled}
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        Conflicts
                    </div>

                    <div className="stat-value">
                        {stats.conflicts}
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        Subjects
                    </div>

                    <div className="stat-value">
                        {stats.subjects}
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-label">
                        Rooms
                    </div>

                    <div className="stat-value">
                        {stats.rooms}
                    </div>

                </div>

            </section>


            {/* =========================================
                WEEKLY TIMETABLE
            ========================================= */}

            <section className="content-card">

                <div className="section-header">

                    <div>

                        <h2>
                            Weekly Timetable
                        </h2>

                        <p>
                            Monday to Friday academic schedule
                        </p>

                    </div>

                </div>


                {timetable.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-state-icon">
                            📅
                        </div>

                        <h3>
                            No timetable generated yet
                        </h3>

                        <p>
                            Click "Generate Timetable" to create
                            a conflict-free schedule.
                        </p>

                    </div>

                ) : (

                    <div className="timetable-wrapper">

                        <table className="timetable-table">

                            <thead>

                                <tr>

                                    <th>
                                        Day
                                    </th>

                                    {periods.map((period) => (

                                        <th key={period}>
                                            Period {period}
                                        </th>

                                    ))}

                                </tr>

                            </thead>


                            <tbody>

                                {days.map((day) => (

                                    <tr key={day}>

                                        <td className="day-cell">
                                            {day}
                                        </td>


                                        {periods.map((period) => {

                                            const entry =
                                                getEntry(
                                                    day,
                                                    period
                                                );


                                            return (

                                                <td
                                                    key={`${day}-${period}`}
                                                    className="timetable-cell"
                                                >

                                                    {entry ? (

                                                        <div className="schedule-item">

                                                            {/* SUBJECT */}

                                                            <strong>
                                                                {entry.subject?.code ||
                                                                    "Subject"}
                                                            </strong>


                                                            <span>
                                                                {entry.subject?.name ||
                                                                    ""}
                                                            </span>


                                                            {/* DIVISION */}

                                                            <span>
                                                                Division:{" "}
                                                                {entry.division?.name ||
                                                                    "—"}
                                                            </span>


                                                            {/* FACULTY */}

                                                            <span>
                                                                Faculty:{" "}
                                                                {entry.faculty?.name ||
                                                                    "—"}
                                                            </span>


                                                            {/* ROOM */}

                                                            <span>
                                                                Room:{" "}
                                                                {entry.room?.name ||
                                                                    "—"}
                                                            </span>

                                                        </div>

                                                    ) : (

                                                        <span className="free-slot">
                                                            Free
                                                        </span>

                                                    )}

                                                </td>

                                            );

                                        })}

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* =========================================
                CONFLICTS
            ========================================= */}

            {conflicts.length > 0 && (

                <section className="content-card">

                    <div className="section-header">

                        <div>

                            <h2>
                                Scheduling Conflicts
                            </h2>

                            <p>
                                Issues detected during timetable generation
                            </p>

                        </div>

                    </div>


                    <div className="error-message">

                        {conflicts.map(
                            (conflict, index) => (

                                <div key={index}>
                                    {typeof conflict === "string"
                                        ? conflict
                                        : JSON.stringify(conflict)}
                                </div>

                            )
                        )}

                    </div>

                </section>

            )}


            {/* =========================================
                CONSTRAINT INFORMATION
            ========================================= */}

            <section className="info-grid">

                <div className="info-card">

                    <h3>
                        Faculty Constraints
                    </h3>

                    <p>
                        Prevents faculty from being assigned
                        to multiple classes at the same time
                        and respects their availability.
                    </p>

                </div>


                <div className="info-card">

                    <h3>
                        Room Constraints
                    </h3>

                    <p>
                        Checks room capacity, availability
                        and laboratory requirements.
                    </p>

                </div>


                <div className="info-card">

                    <h3>
                        Division Constraints
                    </h3>

                    <p>
                        Ensures each division has at most one
                        class in a particular time slot.
                    </p>

                </div>

            </section>

        </div>
    );
}


/* =====================================================
   APP
===================================================== */

function App() {

    return (
        <BrowserRouter>

            <div className="app">

                <Navigation />


                <main className="main-content">

                    <Routes>

                        <Route
                            path="/"
                            element={<Dashboard />}
                        />


                        <Route
                            path="/faculty"
                            element={<Faculty />}
                        />


                        <Route
                            path="/subjects"
                            element={<Subjects />}
                        />


                        <Route
                            path="/rooms"
                            element={<Rooms />}
                        />


                        <Route
                            path="/divisions"
                            element={<Divisions />}
                        />

                    </Routes>

                </main>


                <footer className="footer">

                    Smart Timetable Generator
                    {" • "}
                    Constraint-Based Scheduling

                </footer>

            </div>

        </BrowserRouter>
    );
}

export default App;