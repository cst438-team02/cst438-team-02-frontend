import React, { useState, useEffect } from 'react';

const Transcript = () => {
    const [transcript, setTranscript] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // fetch("/transcripts?studentId=3", { headers: { "Accept": "application/json" } })
        const jwt = sessionStorage.getItem('jwt');
        fetch("/transcripts", { headers: { "Accept": "application/json", "Authorization": jwt } })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error("Failed to fetch transcript: " + text); });
                }
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error("Unexpected content type in transcript: " + text); });
                }
            })
            .then(data => {
                setTranscript(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading transcript...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h3>Transcript</h3>
            <table className="Center">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Semester</th>
                        <th>Course ID</th>
                        <th>Section ID</th>
                        <th>Title</th>
                        <th>Credits</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {transcript.map((item, index) => (
                        <tr key={index}>
                            <td>{item.year}</td>
                            <td>{item.semester}</td>
                            <td>{item.courseId}</td>
                            <td>{item.sectionId}</td>
                            <td>{item.title}</td>
                            <td>{item.credits}</td>
                            <td>{item.grade}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Transcript;
