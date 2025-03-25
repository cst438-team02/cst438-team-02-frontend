import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// complete the code.  
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

const AssignmentAdd = (props)  => {

    // state for controlling dialog visibility
    const [open, setOpen] = useState(false);

    // state for displaying validation messages
    const [editMessage, setEditMessage] = useState('');

    // state to store assignment details 
    const [assignment, setAssignment] = useState({ title: '', dueDate: '', secNo: props.secNo});

    // function to open the dialog
    const editOpen = () => {
        setOpen(true);
        setEditMessage('');
    };

    // function to handle input changes and update state
    const editChange = (event) => {
        setAssignment({...assignment,  [event.target.name]:event.target.value})
    }

    // function to close the dialog and reset input fields
    const editClose = () => {
        setOpen(false);
        setAssignment({title:'', dueDate:''});
        setEditMessage('');
    };

    // function to validate input and save assignment
    const onSave = () => {
        if (assignment.title==='') {
            setEditMessage("Title can not be blank");
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(assignment.dueDate)) {  // check if dueDate is in YYYY-MM-DD format
            setEditMessage("Due date must be in YYYY-MM-DD format");
        } else {
            props.save(assignment);
            editClose();
        }
    }

    return (
        <>
            <Button onClick={editOpen}>Add Assignment</Button>
            <Dialog open={open} >
                <DialogTitle>Add Assignment</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    <h4>{editMessage}</h4>
                    <TextField style={{padding:10}} autoFocus fullWidth label="title" name="title" value={assignment.title} onChange={editChange}  /> 
                    <TextField style={{padding:10}} fullWidth label="dueDate" name="dueDate" value={assignment.dueDate} onChange={editChange}  /> 
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog> 
        </>                       
    )
}

export default AssignmentAdd;
