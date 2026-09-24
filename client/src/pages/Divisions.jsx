import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function Divisions() {
    const [divisions, setDivisions] = useState([]);

    const [form, setForm] = useState({
        name: "",
        department: "",
        semester: 1,
        studentCount: 1
    });

    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDivisions();
    }, []);

    const fetchDivisions = async () => {
        try {
            const response = await axios.get(`${API_URL}/divisions`);
            setDivisions(response.data.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load divisions.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            await axios.post(`${API_URL}/divisions`, {
                name: form.name,
                department: form.department,
                semester: Number(form.semester),
                studentCount: Number(form.studentCount)
            });

            setMessage("Division added successfully.");

            setForm({
                name: "",
                department: "",
                semester: 1,
                studentCount: 1
            });

            await fetchDivisions();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to add division."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (division) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${division.name}?`
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(division._id);
        setMessage("");
        setError("");

        try {
            await axios.delete(
                `${API_URL}/divisions/${division._id}`
            );

            setMessage(
                `${division.name} has been deleted successfully.`
            );

            await fetchDivisions();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete division."
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="page-container">

            {/* PAGE HEADER */}

            <div className="page-header">

                <h1>
                    Division Management
                </h1>

                <p>
                    Add academic divisions and define their student strength.
                </p>

            </div>


            {/* ADD DIVISION */}

            <div className="content-card">

                <h2>
                    Add Division
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                Division Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. CSE-A"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />

                        </div>


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


                        <div className="form-group">

                            <label>
                                Semester
                            </label>

                            <select
                                name="semester"
                                value={form.semester}
                                onChange={handleChange}
                            >

                                {Array.from(
                                    { length: 8 },
                                    (_, index) => index + 1
                                ).map((semester) => (

                                    <option
                                        key={semester}
                                        value={semester}
                                    >
                                        Semester {semester}
                                    </option>

                                ))}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Student Count
                            </label>

                            <input
                                type="number"
                                name="studentCount"
                                min="1"
                                value={form.studentCount}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    <div className="form-actions">

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Adding..."
                                : "Add Division"}
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


            {/* DIVISION LIST */}

            <div className="content-card">

                <div className="section-header">

                    <div>

                        <h2>
                            Divisions
                        </h2>

                        <p>
                            {divisions.length} division
                            {divisions.length !== 1 ? "s" : ""} configured
                        </p>

                    </div>

                </div>


                {divisions.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No divisions configured
                        </h3>

                        <p>
                            Add a division using the form above.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="data-table">

                            <thead>

                                <tr>

                                    <th>
                                        Division
                                    </th>

                                    <th>
                                        Department
                                    </th>

                                    <th>
                                        Semester
                                    </th>

                                    <th>
                                        Students
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {divisions.map((division) => (

                                    <tr key={division._id}>

                                        <td>
                                            <strong>
                                                {division.name}
                                            </strong>
                                        </td>

                                        <td>
                                            {division.department}
                                        </td>

                                        <td>
                                            Semester {division.semester}
                                        </td>

                                        <td>
                                            {division.studentCount}
                                        </td>

                                        <td>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(division)
                                                }
                                                disabled={
                                                    deletingId === division._id
                                                }
                                                style={{
                                                    background: "#dc2626",
                                                    color: "#ffffff",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    padding: "8px 14px",
                                                    cursor:
                                                        deletingId === division._id
                                                            ? "not-allowed"
                                                            : "pointer",
                                                    opacity:
                                                        deletingId === division._id
                                                            ? 0.6
                                                            : 1,
                                                    fontWeight: "600"
                                                }}
                                            >
                                                {deletingId === division._id
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

export default Divisions;