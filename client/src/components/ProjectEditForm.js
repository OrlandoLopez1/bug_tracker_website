import {Form} from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import React from "react";

function ProjectEditForm({name, setName, projectDescription, setProjectDescription, projectManager, setProjectManager,
                             projectManagers, priority, setPriority, currentStatus, setCurrentStatus, assignableUsers,
                             setSelectedUsers, selectedUsers, startDate, setStartDate, deadline, setDeadline,
                             setIsEditing, handleSave}) {
    return (
        <Form>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Project Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={projectDescription} onChange={e => setProjectDescription(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Project Manager</Form.Label>
                <Form.Control
                    as="select"
                    value={projectManager || 'none'}
                    onChange={e => setProjectManager(e.target.value === 'none' ? null : e.target.value)}
                >
                    {projectManagers.length > 0 ? (
                        projectManagers.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.firstName} {user.lastName}
                            </option>
                        ))
                    ) : (
                        <option value='none'>No Assignment</option>

                    )}
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Control
                    as="select"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Current Status</Form.Label>
                <Form.Control
                    as="select"
                    value={currentStatus}
                    onChange={e => setCurrentStatus(e.target.value)}
                >
                    <option value="Planning">Planning</option>
                    <option value="In progress">In progress</option>
                    <option value="Testing">Testing</option>
                    <option value="Stalled">Stalled</option>
                    <option value="Completed">Completed</option>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Users</Form.Label>
                {assignableUsers.map(user => (
                    <Form.Check
                        type='checkbox'
                        id={`checkbox-${user._id}`}
                        label={user.username}
                        value={user._id}
                        checked={selectedUsers.includes(user._id)}
                        onChange={e => {
                            if (e.target.checked) {
                                setSelectedUsers(prevUsers => [...prevUsers, user._id]);  // Add the user's ID if it's checked
                            } else {
                                setSelectedUsers(prevUsers => prevUsers.filter(id => id !== user._id));  // Remove the user's ID if it's unchecked
                            }
                        }}
                    />
                ))}
            </Form.Group>
            <div className="date-row">
                <Form.Group style={{ marginRight: '2rem',  }}>
                    <Form.Label>Start Date</Form.Label>
                    <ReactDatePicker value = {startDate} selected={startDate} onChange={(date) => setStartDate(date)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Deadline</Form.Label>
                    <ReactDatePicker value = {deadline} selected={deadline} onChange={(date) => setDeadline(date)} />
                </Form.Group>
            </div>
            <div className="accordion-buttons">
                <button variant="secondary" type="button" onClick={() => setIsEditing(null)}>Cancel</button>
                <button variant="primary" type="button" onClick={handleSave}>Save</button>
            </div>
        </Form>
    );
}

export default ProjectEditForm;
