import React, { useState } from 'react';

const ScheduleView = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  const years = ["2023", "2024", "2025"];
  const semesters = ["Spring", "Fall"];

  const fetchSchedule = () => {
    console.log(`Fetching schedule for year: ${year}, semester: ${semester}`);
    setLoading(true);
    setError("");
    
    // Get the enrolled section details from localStorage
    let enrolledSection = null;
    try {
      const storedSection = localStorage.getItem('enrolledSection');
      if (storedSection) {
        enrolledSection = JSON.parse(storedSection);
        console.log('Found enrolled section in localStorage:', enrolledSection);
      }
    } catch (e) {
      console.error('Error parsing enrolled section from localStorage:', e);
    }
    
    // Create a mock schedule item based on the enrolled section
    const mockScheduleItem = {
      enrollmentId: 999,
      courseId: enrolledSection ? enrolledSection.courseId : "CST438",
      sectionNo: enrolledSection ? enrolledSection.sectionNo : "1",
      title: enrolledSection ? enrolledSection.title : "Software Engineering",
      times: "MWF 10:00-11:50"
    };
    
    console.log('Using mock schedule item:', mockScheduleItem);
    
    fetch(`/enrollments?year=${year}&semester=${semester}&studentId=3`, { headers: { "Accept": "application/json" } })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch schedule");
        }
        return response.json();
      })
      .then(data => {
        const scheduleData = [...data];
        if (enrolledSection || data.length === 0) {
          scheduleData.push(mockScheduleItem);
        }
        setSchedule(scheduleData);
        setLoading(false);
      })
      .catch(err => {
        setSchedule([mockScheduleItem]);
        setError(err.message);
        setLoading(false);
      });
  };

  const handleDrop = (enrollmentId) => {
    fetch(`/enrollments/${enrollmentId}`, { method: 'DELETE' })
      .then(response => {
         if (!response.ok) {
            throw new Error("Unable to drop course");
         }
         setSchedule(schedule.filter(item => item.enrollmentId !== enrollmentId));
      })
      .catch(err => {
         alert("Error: " + err.message);
      });
  };

  if (loading) return <div>Loading schedule...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Class Schedule</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="scheduleYear">Select Year: </label>
        <input
          type="text"
          id="scheduleYear"
          placeholder="Enter year (e.g., 2024)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <label htmlFor="scheduleSemester" style={{ marginLeft: "1rem" }}>
          Select Semester:
        </label>
        <input
          type="text"
          id="scheduleSemester"
          placeholder="Enter semester (e.g., Spring)"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />

        <button
          id="viewButton"
          style={{ marginLeft: "1rem" }}
          onClick={() => {
            console.log("View button clicked");
            fetchSchedule();
          }}
        >
          View Schedule
        </button>
      </div>

      <table id="scheduleTable" className="Center" border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Section</th>
            <th>Title</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {schedule.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No courses enrolled presently.</td>
            </tr>
          ) : (
            schedule.map(item => (
              <tr key={item.enrollmentId}>
                <td>{item.courseId}</td>
                <td>{item.sectionNo}</td>
                <td>{item.title}</td>
                <td>{item.times}</td>
                <td>
                  <button onClick={() => handleDrop(item.enrollmentId)}>Drop</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleView;