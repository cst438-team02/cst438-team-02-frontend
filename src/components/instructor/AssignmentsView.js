import React, {useState, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert';
import {useLocation} from 'react-router-dom'
import {SERVER_URL} from '../../Constants';
import Button from '@mui/material/Button';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';
import AssignmentAdd from './AssignmentAdd';
// instructor views assignments for their section
// use location to get the section value 
// 
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns 
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const AssignmentsView = (props) => {

    const location = useLocation();
    const {secNo, courseId, secId} = location.state;

    // headers for displaying section data
    const headers = ['AssignmentId', 'Title', 'DueDate', '', '', ''];

    // state to store assignments
    const [assignments, setAssignments] = useState([]);

    // state to store messages (error or success messages)
    const [message, setMessage] = useState('');

    // save assignment
    const saveAssignment = async (assignment) => {
        try {
            const jwt = sessionStorage.getItem('jwt');
            const response = await fetch(`${SERVER_URL}/assignments`,
                {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                }, 
                body: JSON.stringify(assignment),
                });
            if (response.ok) {
                setMessage("assignment saved")
                fetchAssignments();
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }   
    }

    // adds Assignment
    const addAssignment = async (assignment) => {
        try {
        const response = await  fetch(`${SERVER_URL}/assignments`,
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(assignment),
            });
        if (response.ok) {
            const newassignment = await response.json();
            setMessage("assignment added id="+newassignment.id);
            fetchAssignments();
        } else {
            const rc = await response.json();
            setMessage(rc.message);
        }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    // function to fetch assignments
    const  fetchAssignments = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`);
            if (response.ok) {
                const assignments = await response.json();
                setAssignments(assignments);
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }
     
    useEffect( () => {
        fetchAssignments();
    }, []);

    // runs when delete button is pressed
    const onDelete = (e) => {
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        const id = assignments[row_idx].id;
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Do you really want to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteAssignment(id)
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    // runs from onDelete function, deletes assignment
    const deleteAssignment = async (id) => {
        try {
        const response = await fetch(`${SERVER_URL}/assignments/${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }, 
        });
        if (response.ok) {
            setMessage("Assignment deleted");
            fetchAssignments();
        } else {
            const rc = await response.json();
            setMessage(rc.message);
        } 
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    return(
        <>
           <h3>Assignments</h3>

           <h4>{message}</h4>

           <table className="Center">
                <thead>
                    <tr>
                        {headers.map((s, idx) => (<th key={idx}>{s}</th>))} {/* Render table headers */}
                    </tr>
                </thead>
                <tbody>
                    {/* Loop through the sections and display each section's details */}
                    {assignments.map((assignment) => (
                        <tr key={assignment.id}>
                            <td>{assignment.id}</td>
                            <td>{assignment.title}</td>
                            <td>{assignment.dueDate}</td>
                            <td><AssignmentGrade assignment={assignment} /></td>
                            <td><AssignmentUpdate assignment={assignment} save={saveAssignment} /></td>
                            <td><Button onClick={onDelete}>Delete</Button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AssignmentAdd save={addAssignment} secNo={secNo}/>
        </>
    );
}

export default AssignmentsView;
