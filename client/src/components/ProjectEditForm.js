import {Form} from "react-bootstrap";
import ReactDatePicker from "react-datepicker";
import React, {useEffect, useState} from "react";

function ProjectEditForm({projectId, name, setName, projectDescription, setProjectDescription, projectManager, setProjectManager,
                             projectManagers, priority, setPriority, currentStatus, setCurrentStatus, assignableUsers,
                             setSelectedUsers, selectedUsers, startDate, setStartDate, deadline, setDeadline,
                             setIsEditing, handleSave}) {

    const [localName, setLocalName] = useState(name);
    const [localProjectDescription, setLocalProjectDescription] = useState(projectDescription);
    const [localProjectManager, setLocalProjectManager] = useState(projectManager);
    const [localPriority, setLocalPriority] = useState(priority);
    const [localCurrentStatus, setLocalCurrentStatus] = useState(currentStatus);
    const [localSelectedUsers, setLocalSelectedUsers] = useState(selectedUsers);
    const [localStartDate, setLocalStartDate] = useState(startDate);
    const [localDeadline, setLocalDeadline] = useState(deadline);

    const handleSaveChanges = () => {
        const updatedProject = {
            _id: projectId,
            name: localName,
            projectDescription: localProjectDescription,
            projectManager: localProjectManager,
            priority: localPriority,
            currentStatus: localCurrentStatus,
            startDate: localStartDate.toISOString(),
            users: localSelectedUsers,
            deadline: localDeadline ? localDeadline.toISOString() : null
        };
        handleSave(updatedProject);
    };
    useEffect(() => {
    }, [name]);


    return (
        <Form>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" value={localName} onChange={(e) => setLocalName(e.target.value)} />

            </Form.Group>
            <Form.Group>
                <Form.Label>Project Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={localProjectDescription} onChange={e => setLocalProjectDescription(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Project Manager</Form.Label>
                <Form.Control
                    as="select"
                    value={localProjectManager || 'none'}
                    onChange={e => setLocalProjectManager(e.target.value === 'none' ? null : e.target.value)}
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
                    value={localPriority}
                    onChange={e => setLocalPriority(e.target.value)}
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
                    value={localCurrentStatus}
                    onChange={e => setLocalCurrentStatus(e.target.value)}
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
                        checked={localSelectedUsers.includes(user._id)}
                        onChange={e => {
                            if (e.target.checked) {
                                setLocalSelectedUsers(prevUsers => [...prevUsers, user._id]);  // Add the user's ID if it's checked
                            } else {
                                setLocalSelectedUsers(prevUsers => prevUsers.filter(id => id !== user._id));  // Remove the user's ID if it's unchecked
                            }
                        }}
                    />
                ))}
            </Form.Group>

            <div className="date-row">
                <Form.Group style={{ marginRight: '2rem',  }}>
                    <Form.Label>Start Date</Form.Label>
                    <ReactDatePicker value = {localStartDate} selected={localStartDate} onChange={(date) => setLocalStartDate(date)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Deadline</Form.Label>
                    <ReactDatePicker value = {localDeadline} selected={localDeadline} onChange={(date) => setLocalDeadline(date)} />
                </Form.Group>
            </div>
            <div className="accordion-buttons">
                <button variant="secondary" type="button" onClick={() => setIsEditing(null)}>Cancel</button>
                <button variant="primary" type="button" onClick={handleSaveChanges}>Save</button>
            </div>
        </Form>
    );
}

export default ProjectEditForm;
