import React, {useEffect, useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import { createTicket } from '../controllers/TicketController'
import CustomNavbar from "./CustomNavbar";
import SideMenu from "./SideMenu";
import {fetchProjects} from "../controllers/ProjectController";

function CreateTicketPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedBy, setAssignedBy] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [type, setType] = useState('');
    const [project, setProject] = useState('');
    const [status, setStatus] = useState('open');
    const [priority, setPriority] = useState('medium');
    const [username, setUsername] = useState(null);
    const [projects, setProjects] = useState([]);
    const token = localStorage.getItem('accessToken');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const ticket = { title, description, type, assignedBy, assignedTo, status, priority, project };
            const data = await createTicket(ticket);
            setTitle('');
            setDescription('');
            setAssignedBy('');
            setAssignedTo('');
            setType('');
            setStatus('open');
            setPriority('medium');
        } catch (error) {
            console.error("Failed to create ticket:", error);
        }
    };

    useEffect(() => {
        const usernameFromStorage = localStorage.getItem('username');
        if (usernameFromStorage) {
            setUsername(usernameFromStorage);
        }

        const fetchAndSetProjects = async () => {
            try {
                const data = await fetchProjects(token);
                setProjects(data);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        }

        fetchAndSetProjects().then();
    }, []);


    return (
        <Form onSubmit={handleSubmit}>
            <CustomNavbar username={username} />
            <div className="main-content">
                <SideMenu />
                <div className="ticket-page-content">

                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Type</Form.Label>
                        <Form.Control
                            type="text"
                            value={type}
                            onChange={e => setType(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Project</Form.Label>
                        <Form.Control
                            as="select"
                            value={project}     // Change this to project instead of _project
                            onChange={e => setProject(e.target.value)}   // Change this to project instead of _project
                        >
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <option key={project._id} value={project._id}>
                                        {project.name}
                                    </option>
                                ))
                            ) : (
                                <option>No projects available</option>
                            )}

                        </Form.Control>
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
                    </div>
            </div>
        </Form>
    );
}

export default CreateTicketPage;
