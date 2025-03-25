import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
//  instructor updates assignment title, dueDate 
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

const AssignmentUpdate = (props)  => {

    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [assignment, setAssignment] = useState({title:'', dueDate:''});
  
    /*
    *  dialog for edit assignment
    */
    const editOpen = (event) => {
        setOpen(true);
        setEditMessage('');
        setAssignment(props.assignment);
    };

    const editClose = () => {
        setOpen(false);
        setAssignment({id:'', title:'', dueDate:''});
        
    };

    const editChange = (event) => {
        setAssignment({...assignment,  [event.target.name]:event.target.value})
    }

    const onSave = () => {
        if (assignment.id==='') {
            setEditMessage("id can not be blank");
        } else if (assignment.title==='') {
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
            <Button onClick={editOpen}>Edit</Button>
            <Dialog open={open} >
                <DialogTitle>Edit Assignment</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    <h4>{editMessage}</h4>
                    <TextField style={{padding:10}} autoFocus fullWidth label="id" name="id" value={assignment.id}  InputProps={{readOnly: true, }}  /> 
                    <TextField style={{padding:10}} fullWidth label="title" name="title" value={assignment.title} onChange={editChange}  /> 
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

export default AssignmentUpdate;
