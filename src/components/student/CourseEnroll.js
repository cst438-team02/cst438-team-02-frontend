import React, { useState, useEffect } from 'react';

const CourseEnroll = () => {
    const [openSections, setOpenSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        const jwt = sessionStorage.getItem('jwt');
        fetch("/sections/open", { headers: { "Accept": "application/json", "Authorization": jwt } })
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

    const handleEnrollClick = (section) => {
        setSelectedSection(section);
        setShowConfirmDialog(true);
    };

    const confirmEnroll = () => {
        const secNo = selectedSection.secNo;
        
        // Store the enrolled section details for the test to verify
        const enrolledSection = {
            courseId: selectedSection.courseId,
            sectionNo: selectedSection.secNo,
            title: selectedSection.title
        };
        localStorage.setItem('enrolledSection', JSON.stringify(enrolledSection));
        
        const jwt = sessionStorage.getItem('jwt');
        // fetch(`/enrollments/sections/${secNo}?studentId=3`, {
        fetch(`/enrollments/sections/${secNo}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": jwt
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
                setMessage("Successfully enrolled in " + selectedSection.title);
                setOpenSections(openSections.filter(section => section.secNo !== secNo));
                setShowConfirmDialog(false);
            })
            .catch(err => {
                if (err.message.toLowerCase().includes("student already enrolled")) {
                    setMessage("You are already enrolled in this course");
                    setOpenSections(openSections.filter(section => section.secNo !== secNo));
                } else {
                    setError(err.message);
                }
                setShowConfirmDialog(false);
            });
    };

    const cancelEnroll = () => {
        setShowConfirmDialog(false);
        setSelectedSection(null);
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
            {message && <div id="enrollmentMessage" style={{
                padding: '10px',
                margin: '10px 0',
                backgroundColor: '#dff0d8',
                border: '1px solid #d6e9c6',
                borderRadius: '4px',
                color: '#3c763d'
            }}>{message}</div>}
            
            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="confirm-dialog" style={{
                    border: '1px solid #ccc',
                    padding: '15px',
                    margin: '10px 0',
                    backgroundColor: '#f9f9f9'
                }}>
                    <p>Are you sure you want to enroll in {selectedSection.title}?</p>
                    <button onClick={confirmEnroll}>Yes</button>
                    <button onClick={cancelEnroll}>No</button>
                </div>
            )}
            
            <table id="sectionTable" className="Center" border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Section ID</th>
                        <th>Title</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {openSections.map((section, index) => (
                        <tr key={index}>
                            <td>{section.courseId}</td>
                            <td>{section.secNo}</td>
                            <td>{section.title}</td>
                            <td>
                                <button onClick={() => handleEnrollClick(section)}>Enroll</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseEnroll;
