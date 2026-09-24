import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
];

const periods = [1, 2, 3, 4, 5, 6];

function Faculty() {
    const [facultyList, setFacultyList] = useState([]);

    const [form, setForm] = useState({
        name: "",
        employeeId: "",
        department: "",
        email: ""
    });

    const [availableSlots, setAvailableSlots] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {
        try {
            const response = await axios.get(`${API_URL}/faculty`);

            setFacultyList(response.data.data || []);
        } catch (err) {
            console.error(err);

            setError("Failed to load faculty members.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const toggleSlot = (day, period) => {
        const slotExists = availableSlots.some(
            (slot) =>
                slot.day === day &&
                Number(slot.period) === Number(period)
        );

        if (slotExists) {
            setAvailableSlots((previous) =>
                previous.filter(
                    (slot) =>
                        !(
                            slot.day === day &&
                            Number(slot.period) === Number(period)
                        )
                )
            );
        } else {
            setAvailableSlots((previous) => [
                ...previous,
                {
                    day,
                    period: Number(period)
                }
            ]);
        }
    };

    const isSelected = (day, period) => {
        return availableSlots.some(
            (slot) =>
                slot.day === day &&
                Number(slot.period) === Number(period)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            await axios.post(`${API_URL}/faculty`, {
                name: form.name,
                employeeId: form.employeeId,
                department: form.department,
                email: form.email,
                availableSlots
            });

            setMessage("Faculty member added successfully.");

            setForm({
                name: "",
                employeeId: "",
                department: "",
                email: ""
            });

            setAvailableSlots([]);

            await fetchFaculty();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to add faculty member."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">

            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="page-header">

                <h1>
                    Faculty Management
                </h1>

                <p>
                    Add faculty members and define their teaching availability.
                </p>

            </div>


            {/* =====================================
                ADD FACULTY
            ===================================== */}

            <div className="content-card">

                <h2>
                    Add Faculty
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        {/* Faculty Name */}

                        <div className="form-group">

                            <label>
                                Faculty Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Dr. Priya Nair"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* Employee ID */}

                        <div className="form-group">

                            <label>
                                Employee ID
                            </label>

                            <input
                                type="text"
                                name="employeeId"
                                placeholder="e.g. FAC001"
                                value={form.employeeId}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* Department */}

                        <div className="form-group">

                            <label>
                                Department
                            </label>

                            <input
                                type="text"
                                name="department"
                                placeholder="e.g. CSE"
                                value={form.department}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* Email */}

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="faculty@college.edu"
                                value={form.email}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    {/* =====================================
                        AVAILABILITY
                    ===================================== */}

                    <div style={{ marginTop: "28px" }}>

                        <h3
                            style={{
                                margin: "0 0 8px",
                                color: "#0f172a"
                            }}
                        >
                            Available Teaching Slots
                        </h3>

                        <p
                            style={{
                                margin: "0 0 14px",
                                color: "#64748b",
                                fontSize: "14px"
                            }}
                        >
                            Click the slots when this faculty member
                            is available to teach.
                        </p>


                        <div className="availability-table-wrapper">

                            <table className="availability-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Day
                                        </th>

                                        {periods.map((period) => (
                                            <th key={period}>
                                                P{period}
                                            </th>
                                        ))}

                                    </tr>

                                </thead>


                                <tbody>

                                    {days.map((day) => (

                                        <tr key={day}>

                                            <td className="availability-day">
                                                {day}
                                            </td>

                                            {periods.map((period) => {

                                                const selected =
                                                    isSelected(
                                                        day,
                                                        period
                                                    );

                                                return (
                                                    <td
                                                        key={`${day}-${period}`}
                                                        className="availability-cell"
                                                    >

                                                        <button
                                                            type="button"
                                                            className={
                                                                selected
                                                                    ? "availability-button selected"
                                                                    : "availability-button"
                                                            }
                                                            onClick={() =>
                                                                toggleSlot(
                                                                    day,
                                                                    period
                                                                )
                                                            }
                                                            aria-label={`${day} Period ${period}`}
                                                        >
                                                            {selected
                                                                ? "✓"
                                                                : ""}
                                                        </button>

                                                    </td>
                                                );

                                            })}

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>


                        <div className="selected-slots-count">

                            {availableSlots.length} slot
                            {availableSlots.length !== 1 ? "s" : ""} selected

                        </div>

                    </div>


                    {/* =====================================
                        SUBMIT
                    ===================================== */}

                    <div className="form-actions">

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Adding..."
                                : "Add Faculty"}
                        </button>

                    </div>

                </form>


                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}


                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

            </div>


            {/* =====================================
                FACULTY LIST
            ===================================== */}

            <div className="content-card">

                <div className="section-header">

                    <div>

                        <h2>
                            Faculty Members
                        </h2>

                        <p>
                            {facultyList.length} faculty member
                            {facultyList.length !== 1 ? "s" : ""} configured
                        </p>

                    </div>

                </div>


                {facultyList.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No faculty members yet
                        </h3>

                        <p>
                            Add a faculty member using the form above.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="data-table">

                            <thead>

                                <tr>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Employee ID
                                    </th>

                                    <th>
                                        Department
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Available Slots
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {facultyList.map((faculty) => (

                                    <tr key={faculty._id}>

                                        <td>
                                            <strong>
                                                {faculty.name}
                                            </strong>
                                        </td>

                                        <td>
                                            {faculty.employeeId}
                                        </td>

                                        <td>
                                            {faculty.department}
                                        </td>

                                        <td>
                                            {faculty.email || "—"}
                                        </td>

                                        <td>

                                            <span className="status-badge">

                                                {faculty.availableSlots?.length || 0}
                                                {" "}
                                                slots

                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Faculty;