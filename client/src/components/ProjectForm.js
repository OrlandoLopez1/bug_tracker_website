import React, {useEffect, useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import { addProject } from '../controllers/ProjectController'
import CustomNavbar from "./CustomNavbar";
import SideMenu from "./SideMenu";

function CreateProjectPage() {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectManager, setProjectManager] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [priority, setPriority] = useState('medium');
    const [currentStatus, setCurrentStatus] = useState('Planning'); // new
    const [username, setUsername] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const project = { projectName, projectDescription, projectManager, startDate, endDate, priority, currentStatus };
            const data = await addProject(project);
            setProjectName('');
            setProjectDescription('');
            setProjectManager('');
            setStartDate('');
            setEndDate('');
            setPriority('medium');
            setCurrentStatus('Planning');
        } catch (error) {
            console.error("Failed to create project:", error);
        }
    };

    useEffect(() => {
        const usernameFromStorage = localStorage.getItem('username');

        if (usernameFromStorage) {
            setUsername(usernameFromStorage);
        }
    }, []);

    return (
        <Form onSubmit={handleSubmit}>
            <CustomNavbar username={username} />
            <div className="content-container">
                <SideMenu />
                <div className="project-page-content">

                    <Form.Group>
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={projectName}
                            onChange={e => setProjectName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Project Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={projectDescription}
                            onChange={e => setProjectDescription(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Project Manager</Form.Label>
                        <Form.Control
                            type="text"
                            value={projectManager}
                            onChange={e => setProjectManager(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
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
                    <Button variant="primary" type="submit">Submit</Button>
                </div>
            </div>
        </Form>
    );
}

export default CreateProjectPage;
