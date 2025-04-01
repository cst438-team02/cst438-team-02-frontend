import React, { useState } from 'react';
import { Outlet, Link } from "react-router-dom";

export const StudentHome = () => {
  const [studentId, setStudentId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    const id = studentId || "3";
    localStorage.setItem("studentId", id);
    setLoggedIn(true);
  };

  return (
      <div>
          <h1>Student Home</h1>
          
          {loggedIn ? (
            <div>
              <p>Welcome, Student ID: {studentId}</p>
              <p>View class schedule. Drop course.</p>
              <p>Enroll in a course.</p>
              <p>View assignments and grades.</p>
              <p>View Transcript.</p>
            </div>
          ) : (
            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
              <h3>Student Login</h3>
              <a href="#" id="student" onClick={() => document.getElementById('studentId').focus()}>
                Student Portal
              </a>
              <div style={{ marginTop: '10px' }}>
                <label htmlFor="studentId">Student ID: </label>
                <input
                  type="text"
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
                <button
                  id="login"
                  style={{ marginLeft: '10px' }}
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </div>
          )}
      </div>
      
      );
};

export const StudentLayout = () => {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> &nbsp;|&nbsp;
        <Link to="/schedule" id="viewSchedule">View Class Schedule</Link> &nbsp;|&nbsp;
        <Link to="/addCourse" id="enrollSections">Enroll in a class</Link> &nbsp;|&nbsp;
        <Link to="/studentAssignments">View Assignments</Link> &nbsp;|&nbsp;
        <Link to="/transcript">View Transcript</Link>
      </nav>

      <Outlet />
    </>
  )
};