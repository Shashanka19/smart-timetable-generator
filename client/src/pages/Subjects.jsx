import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://smart-timetable-generator-72ly.onrender.com/api";

function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [facultyList, setFacultyList] = useState([]);

    const [form, setForm] = useState({
        code: "",
        name: "",
        department: "",
        type: "THEORY",
        hoursPerWeek: 1,
        facultyId: ""
    });

    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSubjects();
        fetchFaculty();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(`${API_URL}/subjects`);
            setSubjects(response.data.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load subjects.");
        }
    };

    const fetchFaculty = async () => {
        try {
            const response = await axios.get(`${API_URL}/faculty`);
            setFacultyList(response.data.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load faculty.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            await axios.post(`${API_URL}/subjects`, {
                code: form.code,
                name: form.name,
                department: form.department,
                type: form.type,
                hoursPerWeek: Number(form.hoursPerWeek),
                requiresLab: form.type === "LAB",
                facultyId: form.facultyId || undefined
            });

            setMessage("Subject added successfully.");

            setForm({
                code: "",
                name: "",
                department: "",
                type: "THEORY",
                hoursPerWeek: 1,
                facultyId: ""
            });

            await fetchSubjects();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to add subject."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (subject) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${subject.code} - ${subject.name}?`
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(subject._id);
        setMessage("");
        setError("");

        try {
            await axios.delete(`${API_URL}/subjects/${subject._id}`);

            setMessage(
                `${subject.code} has been deleted successfully.`
            );

            await fetchSubjects();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete subject."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const getFacultyName = (facultyId) => {
        if (!facultyId) return "Not assigned";

        const faculty = facultyList.find(
            (item) => item._id === facultyId
        );

        if (!faculty) return "Not assigned";

        return `${faculty.name} (${faculty.employeeId})`;
    };

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <h1>Subject Management</h1>

                    <p>
                        Add and manage subjects used by the timetable generator.
                    </p>
                </div>
            </div>


            {/* Add Subject */}

            <div className="content-card">

                <h2>Add Subject</h2>

                <form onSubmit={handleSubmit} className="form-grid">

                    <div className="form-group">

                        <label>Subject Code</label>

                        <input
                            type="text"
                            name="code"
                            placeholder="e.g. CS301"
                            value={form.code}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>Subject Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Database Management Systems"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>Department</label>

                        <input
                            type="text"
                            name="department"
                            placeholder="e.g. CSE"
                            value={form.department}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>Type</label>

                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                        >
                            <option value="THEORY">Theory</option>
                            <option value="LAB">Lab</option>
                        </select>

                    </div>


                    <div className="form-group">

                        <label>Hours Per Week</label>

                        <input
                            type="number"
                            name="hoursPerWeek"
                            min="1"
                            max="20"
                            value={form.hoursPerWeek}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>Faculty</label>

                        <select
                            name="facultyId"
                            value={form.facultyId}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select Faculty
                            </option>

                            {facultyList.map((faculty) => (
                                <option
                                    key={faculty._id}
                                    value={faculty._id}
                                >
                                    {faculty.name} - {faculty.employeeId} -{" "}
                                    {faculty.department}
                                </option>
                            ))}

                        </select>

                    </div>


                    <div className="form-actions">

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add Subject"}
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


            {/* Subject List */}

            <div className="content-card">

                <div className="section-header">

                    <div>

                        <h2>Subjects</h2>

                        <p>
                            {subjects.length} subject
                            {subjects.length !== 1 ? "s" : ""} configured
                        </p>

                    </div>

                </div>


                {subjects.length === 0 ? (

                    <div className="empty-state">
                        No subjects added yet.
                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="data-table">

                            <thead>

                                <tr>

                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Type</th>
                                    <th>Hours / Week</th>
                                    <th>Faculty</th>
                                    <th>Action</th>

                                </tr>

                            </thead>


                            <tbody>

                                {subjects.map((subject) => (

                                    <tr key={subject._id}>

                                        <td>
                                            <strong>
                                                {subject.code}
                                            </strong>
                                        </td>

                                        <td>
                                            {subject.name}
                                        </td>

                                        <td>
                                            {subject.department}
                                        </td>

                                        <td>

                                            <span className="status-badge">
                                                {subject.type}
                                            </span>

                                        </td>

                                        <td>
                                            {subject.hoursPerWeek}
                                        </td>

                                        <td>
                                            {getFacultyName(
                                                subject.facultyId
                                            )}
                                        </td>

                                        <td>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(subject)
                                                }
                                                disabled={
                                                    deletingId === subject._id
                                                }
                                                style={{
                                                    background: "#dc2626",
                                                    color: "#ffffff",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    padding: "8px 14px",
                                                    cursor:
                                                        deletingId === subject._id
                                                            ? "not-allowed"
                                                            : "pointer",
                                                    opacity:
                                                        deletingId === subject._id
                                                            ? 0.6
                                                            : 1,
                                                    fontWeight: "600"
                                                }}
                                            >
                                                {deletingId === subject._id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>

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

export default Subjects;