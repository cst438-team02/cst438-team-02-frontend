import React, { useState, useEffect } from 'react';

const ScheduleView = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [year, setYear] = useState("2025");
  const [semester, setSemester] = useState("Spring");

  const years = ["2023", "2024", "2025"];
  const semesters = ["Spring", "Fall"];

  const fetchSchedule = () => {
    setLoading(true);
    setError("");
    fetch(`/enrollments?year=${year}&semester=${semester}&studentId=3`, { headers: { "Accept": "application/json" } })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch schedule");
        }
        return response.json();
      })
      .then(data => {
        setSchedule(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Automatically fetch schedule on initial render
    fetchSchedule();
  }, []);

  const handleDrop = (enrollmentId) => {
    fetch(`/enrollments/${enrollmentId}`, { method: 'DELETE' })
      .then(response => {
         if (!response.ok) {
            throw new Error("Unable to drop course");
         }
         // Update local schedule
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

        <button style={{ marginLeft: "1rem" }} onClick={fetchSchedule}>
          Load Schedule
        </button>
      </div>

      {schedule.length === 0 ? (
        <p>No courses enrolled presently.</p>
      ) : (
        <table className="Center" border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Title</th>
              <th>Section</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map(item => (
              <tr key={item.enrollmentId}>
                <td>{item.courseId}</td>
                <td>{item.title}</td>
                <td>{item.sectionNo}</td>
                <td>{item.times}</td>
                <td>
                  <button onClick={() => handleDrop(item.enrollmentId)}>Drop</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScheduleView;