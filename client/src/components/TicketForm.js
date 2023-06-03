import React, {useEffect, useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import { createTicket } from '../controllers/TicketController'
import CustomNavbar from "./CustomNavbar";
import SideMenu from "./SideMenu";
import {fetchProjects} from "../controllers/ProjectController";
import {getAllUsers} from "../controllers/UserController";

function CreateTicketPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedBy, setAssignedBy] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [type, setType] = useState('');
    const [project, setProject] = useState('');
    const [status, setStatus] = useState('open');
    const [priority, setPriority] = useState('medium');
    const [projects, setProjects] = useState([]);
    const [user, setUser] = useState('');
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('accessToken');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const ticket = { title, description, type, assignedBy, assignedTo, status, priority, project };
            console.log("PROJECT: ", project)
            const data = await createTicket(ticket, token);
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

        const fetchAndSetProjects = async () => {
            try {
                const data = await fetchProjects(token);
                if (data.length > 0) {
                    setProject(data[0]._id);
                }
                setProjects(data);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        }
        const fetchAndSetUsers = async () => {
            try {
                const data = await getAllUsers(token);
                if (data.length > 0) {
                    setUser(data[0]._id);
                }
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        }

        fetchAndSetUsers().then();


    }, []);


    return (
        <Form onSubmit={handleSubmit}>
            <CustomNavbar />
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
                            value={project}
                            onChange={e => setProject(e.target.value)}
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
                        <Form.Label>Assigned To</Form.Label>
                        <Form.Control
                            as="select"
                            value={user}
                            onChange={e => setUser(e.target.value)}
                        >
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.firstName} {user.lastName}
                                    </option>
                                ))
                            ) : (
                                <option>No users available</option>
                            )}

                        </Form.Control>
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
