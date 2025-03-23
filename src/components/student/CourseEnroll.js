import React, { useState, useEffect } from 'react';

const CourseEnroll = () => {
    const [openSections, setOpenSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/sections/open", { headers: { "Accept": "application/json" } })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error("Failed to fetch open sections: " + text); });
                }
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error("Unexpected content type in open sections: " + text); });
                }
            })
            .then(data => {
                setOpenSections(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleEnroll = (secNo) => {
        fetch(`/enrollments/sections/${secNo}?studentId=3`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ enrollmentAction: "enroll" })
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error("Enrollment failed: " + text); });
                }
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json();
                } else {
                    return response.text().then(text => { throw new Error("Unexpected content type in enrollment: " + text); });
                }
            })
            .then(data => {
                setMessage("Enrolled successfully");
                setOpenSections(openSections.filter(section => section.secNo !== secNo));
            })
            .catch(err => {
                if (err.message.toLowerCase().includes("student already enrolled")) {
                    setMessage("You are already enrolled in this course");
                    setOpenSections(openSections.filter(section => section.secNo !== secNo));
                } else {
                    setError(err.message);
                }
            });
    };

    if (loading) {
        return <div>Loading open sections...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h3>Course Enrollment</h3>
            {message && <div>{message}</div>}
            <table className="Center" border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Section ID</th>
                        <th>Course ID</th>
                        <th>Title</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {openSections.map((section, index) => (
                        <tr key={index}>
                            <td>{section.secNo}</td>
                            <td>{section.courseId}</td>
                            <td>{section.title}</td>
                            <td>
                                <button onClick={() => handleEnroll(section.secNo)}>Add</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseEnroll;
