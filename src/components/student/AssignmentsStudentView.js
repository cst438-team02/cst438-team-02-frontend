import React, { useState, useEffect } from 'react';

const AssignmentsStudentView = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [year, setYear] = useState("2025");
    const [semester, setSemester] = useState("Spring");

    const years = ["2023", "2024", "2025"];
    const semesters = ["Spring", "Fall"];

    const fetchAssignments = () => {
        setLoading(true);
        setError("");
        fetch(`/assignments?studentId=3&year=${year}&semester=${semester}`, { headers: { "Accept": "application/json" } })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch assignments");
                }
                return response.json();
            })
            .then(data => {
                setAssignments(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        // Automatically fetch on initial load
        fetchAssignments();
    }, []);

    if (loading) return <div>Loading assignments...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h3>My Assignments &amp; Grades</h3>

            <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="yearSelect">Select Year: </label>
                <select
                    id="yearSelect"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                >
                    {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                <label htmlFor="semesterSelect" style={{ marginLeft: "1rem" }}>
                    Select Semester:
                </label>
                <select
                    id="semesterSelect"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                >
                    {semesters.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>

                <button style={{ marginLeft: "1rem" }} onClick={fetchAssignments}>
                    Load Assignments
                </button>
            </div>

            <table border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Assignment Title</th>
                        <th>Due Date</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment, index) => (
                        <tr key={index}>
                            <td>{assignment.courseId}</td>
                            <td>{assignment.title}</td>
                            <td>{assignment.dueDate}</td>
                            <td>{assignment.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignmentsStudentView;