import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { createTicket } from '../controllers/TicketController'
import CustomNavbar from "./CustomNavbar";
import SideMenu from "./SideMenu";

function CreateTicketPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedBy, setAssignedBy] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [status, setStatus] = useState('open');
    const [priority, setPriority] = useState('medium');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const ticket = { title, description, assignedBy, assignedTo, status, priority };
            const data = await createTicket(ticket);
            console.log(data);
            // Redirect to another page or clear the form
            setTitle('');
            setDescription('');
            setAssignedBy('');
            setAssignedTo('');
            setStatus('open');
            setPriority('medium');
        } catch (error) {
            console.error("Failed to create ticket:", error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Assigned By</Form.Label>
                <Form.Control
                    type="text"
                    value={assignedBy}
                    onChange={e => setAssignedBy(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Assigned To</Form.Label>
                <Form.Control
                    type="text"
                    value={assignedTo}
                    onChange={e => setAssignedTo(e.target.value)}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Control
                    as="select"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="closed">Closed</option>
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
            <Button variant="primary" type="submit">Submit</Button>
        </Form>
    );
}

export default CreateTicketPage;
