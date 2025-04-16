// instructor views a list of sections they are teaching 
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:  
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const InstructorSectionsView = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [year, setYear] = useState("2025");
    const [semester, setSemester] = useState("Spring");

    const location = useLocation();
    const [sections, setSections] = useState([]);
    const [message, setMessage] = useState('');

    const fetchSections = () => {
        setLoading(true);
        setError("");
        const jwt = sessionStorage.getItem('jwt');
        // fetch(`/sections?email=dwisneski@csumb.edu&year=${year}&semester=${semester}`,
        fetch(`/sections?year=${year}&semester=${semester}`,
            { 
                headers: {
                    "Accept": "application/json",
                    "Authorization": jwt,
                    }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch assignments");
                }
                return response.json();
            })
            .then(data => {
                setSections(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        // Automatically fetch on initial load
        fetchSections();
    }, []);

    return (
        <>
            <h3>Instructor Sections for {semester} {year}</h3>
            <h4>{message}</h4>
            <table className="Center" border="1" cellPadding="5" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Section No</th>
                        <th>Course ID</th>
                        <th>Section ID</th>
                        <th>Building</th>
                        <th>Room</th>
                        <th>Times</th>
                        <th>Assignments</th>
                        <th>Enrollments</th>
                    </tr>
                </thead>
                <tbody>
                    {sections.map((section, index) => (
                        <tr key={index}>
                            <td>{section.secNo}</td>
                            <td>{section.courseId}</td>
                            <td>{section.secId}</td>
                            <td>{section.building}</td>
                            <td>{section.room}</td>
                            <td>{section.times}</td>
                            <td>
                                <Link to="/assignments" state={section}>View Assignments</Link>
                            </td>
                            <td>
                                <Link to="/enrollments" state={section}>View Enrollments</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default InstructorSectionsView;


