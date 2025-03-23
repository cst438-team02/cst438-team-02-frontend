import React, { useState, useEffect } from 'react';

const AssignmentsStudentView = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/assignments?studentId=3&year=2025&semester=Spring", { headers: { "Accept": "application/json" } })
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
    }, []);

    if (loading) return <div>Loading assignments...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h3>My Assignments &amp; Grades</h3>
            <table>
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