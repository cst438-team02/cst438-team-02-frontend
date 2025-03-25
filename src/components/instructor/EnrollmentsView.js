// instructor view list of students enrolled in a section 
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const EnrollmentsView = () => {
  const location = useLocation();
  const { secNo } = location.state;

  const [enrollments, setEnrollments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/sections/${secNo}/enrollments`)
      .then((res) => res.json())
      .then((data) => setEnrollments(data))
      .catch((err) => setMessage("Failed to fetch enrollments: " + err));
  }, [secNo]);

  const onGradeChange = (event, index) => {
    const updated = [...enrollments];
    updated[index].grade = event.target.value;
    setEnrollments(updated);
  };

  const onSave = () => {
    fetch(`/enrollments/${secNo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrollments),
    })
      .then((res) => {
        if (res.ok) {
          setMessage('Grades saved successfully.');
        } else {
          res.text().then((msg) => setMessage("Save error: " + msg));
        }
      })
      .catch((err) => setMessage("Network error: " + err));
  };

  return (
    <>
      <h3>Enrollments</h3>
      <h4>{message}</h4>
      <table className="Center">
        <thead>
          <tr>
            <th>Enrollment ID</th>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e, idx) => (
            <tr key={e.enrollmentId}>
              <td>{e.enrollmentId}</td>
              <td>{e.studentId}</td>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>
                <input
                  type="text"
                  name="grade"
                  value={e.grade || ''}
                  onChange={(event) => onGradeChange(event, idx)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onSave}>Save Grades</button>
    </>
  );
};

export default EnrollmentsView;

