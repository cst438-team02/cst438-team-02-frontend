// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignments/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score' 
// score column is an input field 
//  <input type="text" name="score" value={g.score} onChange={onChange} />
 
import {GRADEBOOK_URL} from '../../Constants';
import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const AssignmentGrade = ({ assignment }) => {
    const [open, setOpen] = useState(false);
    const [grades, setGrades] = useState([]);
    const [message, setMessage] = useState("");

    const fetchGrades = () => {
        fetch(`http://localhost:8081/assignments/${assignment.id}/grades`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch grades");
                return res.json();
            })
            .then(data => setGrades(data))
            .catch(err => setMessage(err.message));
    };

    const handleOpen = () => {
        setOpen(true);
        fetchGrades();
    };

    const handleClose = () => {
        setOpen(false);
        setGrades([]);
        setMessage("");
    };

    const onChange = (event, index) => {
        const updated = [...grades];
        updated[index].score = event.target.value;
        setGrades(updated);
    };

    const onSave = () => {
        // Validate scores
        const invalid = grades.find(g => isNaN(g.score) || g.score === '');
        if (invalid) {
            setMessage("All scores must be numeric.");
            return;
        }

        const payload = grades.map(g => ({
            gradeId: g.gradeId,
            score: parseInt(g.score)
        }));

        fetch(`${GRADEBOOK_URL}/grades`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (!res.ok) return res.json().then(err => { throw new Error(err.message); });
        
            if (res.status === 204) return {};
            
            return res.text().then(text => text ? JSON.parse(text) : {});
        })
        .then(() => setMessage("Grades updated successfully"))
        .catch(err => setMessage(`Failed to update grades: ${err.message}`));
    };

    return (
        <>
            <Button onClick={handleOpen}>Grade</Button>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Grade Assignment: {assignment.title}</DialogTitle>
                <DialogContent>
                    <h4>{message}</h4>
                    <table className="Center" border="1" cellPadding="5" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>Grade ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map((g, index) => (
                                <tr key={g.gradeId}>
                                    <td>{g.gradeId}</td>
                                    <td>{g.studentName}</td>
                                    <td>{g.studentEmail}</td>
                                    <td>
                                        <input
                                            type="number"
                                            name="score"
                                            value={g.score || ''}
                                            onChange={(e) => onChange(e, index)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={onSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AssignmentGrade;


