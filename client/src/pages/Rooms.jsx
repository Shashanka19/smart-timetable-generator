import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function Rooms() {
    const [rooms, setRooms] = useState([]);

    const [form, setForm] = useState({
        name: "",
        roomNumber: "",
        type: "CLASSROOM",
        capacity: 60,
        building: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`${API_URL}/rooms`);
            setRooms(response.data.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load rooms.");
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
            await axios.post(`${API_URL}/rooms`, {
                name: form.name,
                roomNumber: form.roomNumber,
                type: form.type,
                capacity: Number(form.capacity),
                building: form.building
            });

            setMessage("Room added successfully.");

            setForm({
                name: "",
                roomNumber: "",
                type: "CLASSROOM",
                capacity: 60,
                building: ""
            });

            await fetchRooms();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to add room."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">

            {/* PAGE HEADER */}

            <div className="page-header">

                <h1>Room Management</h1>

                <p>
                    Add classrooms and laboratories used for timetable generation.
                </p>

            </div>


            {/* ADD ROOM */}

            <div className="content-card">

                <h2>Add Room</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">

                            <label>Room Name</label>

                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Room 204"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Room Number</label>

                            <input
                                type="text"
                                name="roomNumber"
                                placeholder="e.g. 204"
                                value={form.roomNumber}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Room Type</label>

                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                            >
                                <option value="CLASSROOM">
                                    Classroom
                                </option>

                                <option value="LAB">
                                    Laboratory
                                </option>
                            </select>

                        </div>


                        <div className="form-group">

                            <label>Capacity</label>

                            <input
                                type="number"
                                name="capacity"
                                min="1"
                                value={form.capacity}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>Building</label>

                            <input
                                type="text"
                                name="building"
                                placeholder="e.g. Main Block"
                                value={form.building}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    <div className="form-actions">

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add Room"}
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


            {/* ROOM LIST */}

            <div className="content-card">

                <div className="section-header">

                    <div>

                        <h2>Rooms</h2>

                        <p>
                            {rooms.length} room
                            {rooms.length !== 1 ? "s" : ""} configured
                        </p>

                    </div>

                </div>


                {rooms.length === 0 ? (

                    <div className="empty-state">

                        <h3>No rooms configured</h3>

                        <p>
                            Add a classroom or laboratory using the form above.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="data-table">

                            <thead>

                                <tr>
                                    <th>Name</th>
                                    <th>Room Number</th>
                                    <th>Type</th>
                                    <th>Capacity</th>
                                    <th>Building</th>
                                </tr>

                            </thead>

                            <tbody>

                                {rooms.map((room) => (

                                    <tr key={room._id}>

                                        <td>
                                            <strong>
                                                {room.name}
                                            </strong>
                                        </td>

                                        <td>
                                            {room.roomNumber}
                                        </td>

                                        <td>
                                            <span className="status-badge">
                                                {room.type}
                                            </span>
                                        </td>

                                        <td>
                                            {room.capacity}
                                        </td>

                                        <td>
                                            {room.building || "—"}
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

export default Rooms;