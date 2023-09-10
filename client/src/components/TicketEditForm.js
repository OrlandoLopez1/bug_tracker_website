import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';

function TicketEditForm({
                            ticketId, title, setTitle, description, setDescription,
                            type, setType, status, setStatus, priority, setPriority,
                            assignedBy, setAssignedBy, assignableUsers, setSelectedUsers, selectedUsers,
                            setIsEditing, handleSave
                        }) {

    const [localTitle, setLocalTitle] = useState(title);
    const [localDescription, setLocalDescription] = useState(description);
    const [localType, setLocalType] = useState(type);
    const [localStatus, setLocalStatus] = useState(status);
    const [localPriority, setLocalPriority] = useState(priority);
    const [localSelectedUsers, setLocalSelectedUsers] = useState(selectedUsers);

    const handleSaveChanges = () => {
        const updatedTicket = {
            title: localTitle,
            description: localDescription,
            type: localType,
            status: localStatus,
            priority: localPriority,
            assignedTo: localSelectedUsers,
        };
        handleSave(updatedTicket);
    };

    return (
        <Form>
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={localTitle} onChange={e => setLocalTitle(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={localDescription} onChange={e => setLocalDescription(e.target.value)} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Control
                    as="select"
                    value={localType}
                    onChange={e => setLocalType(e.target.value)}
                >
                    <option value="bug">Bug</option>
                    <option value="feature request">Feature Request</option>
                    <option value="improvement">Improvement</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="security">Security</option>
                    <option value="documentation">Documentation</option>
                    <option value="ui/ux">UI/UX</option>
                    <option value="performance">Performance</option>
                    <option value="compatibility">Compatibility</option>
                    <option value="other">Other</option>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Control
                    as="select"
                    value={localStatus}
                    onChange={e => setLocalStatus(e.target.value)}
                >
                    <option value="open">Open</option>
                    <option value="inprogress">In progress</option>
                    <option value="closed">Closed</option>
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
                <Form.Label>Users</Form.Label>
                {assignableUsers && assignableUsers.map(user => (
                    <Form.Check
                        type='checkbox'
                        id={`checkbox-${user._id}`}
                        label={user.username}
                        value={user._id}
                        checked={localSelectedUsers.includes(user._id)}
                        onChange={e => {
                            if (e.target.checked) {
                                setLocalSelectedUsers(prevUsers => [...prevUsers, user._id]);
                            } else {
                                setLocalSelectedUsers(prevUsers => prevUsers.filter(id => id !== user._id));
                            }
                        }}
                    />
                ))}
            </Form.Group>
            <div className="accordion-buttons">
                <button variant="secondary" type="button" onClick={() => setIsEditing(null)}>Cancel</button>
                <button variant="primary" type="button" onClick={handleSaveChanges}>Save</button>
            </div>
        </Form>
    );
}

export default TicketEditForm;
