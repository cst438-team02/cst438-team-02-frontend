import React, { useState, useEffect } from 'react';

const ScheduleView = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/enrollments?year=2025&semester=Spring&studentId=3", { headers: { "Accept": "application/json" } })
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
  }, []);

  const handleDrop = (enrollmentId) => {
    fetch(`/enrollments/${enrollmentId}`, { method: 'DELETE' })
      .then(response => {
         if (!response.ok) {
            throw new Error("Unable to drop course");
         }
         // Update schedule without a prompt confirmation.
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
      {schedule.length === 0 ? (
        <p>No courses enrolled presently.</p>
      ) : (
        <table border="1" cellPadding="5" cellSpacing="0">
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