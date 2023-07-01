import React, {useEffect, useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import { addProject } from '../controllers/ProjectController'
import CustomNavbar from "./CustomNavbar";
import SideMenu from "./SideMenu";
import { useNavigate } from 'react-router-dom';
import {getAllUsers} from "../controllers/UserController";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ProjectForm.css";

// todo make it not make my eyes bleed, eventually; Idea, remove the tabs and make it a menu that shows up in front
// of the projects and makes a shadow.
function CreateProjectForm({closeForm, onProjectCreated}) {
    const [name, setName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectManager, setProjectManager] = useState('');
    const [priority, setPriority] = useState('medium');
    const [currentStatus, setCurrentStatus] = useState('Planning'); // new
    const [username, setUsername] = useState(null);
    const [projectManagers, setProjectManagers] = useState([]);
    const [deadline, setDeadline] = useState(null);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const project =
                {
                    name,
                    projectDescription,
                    projectManager,
                    priority,
                    currentStatus,
                    deadline: deadline ? deadline.toISOString() : null
                };
            const data = await addProject(project, token);
            setName('');
            setProjectDescription('');
            setProjectManager('');
            setPriority('medium');
            setCurrentStatus('Planning');
            setDeadline(null);
        } catch (error) {
            console.error("Failed to create project:", error);
        }
    };

    const fetchAndSetProjectManagers = async () => {
        try {
            const data = await getAllUsers(token);

            // filter the data for project managers only
            const projectManagers = data.filter(user => user.role === 'projectmanager');

            if (projectManagers.length > 0) {
                setProjectManagers(projectManagers[0]._id);
            }
            setProjectManagers(projectManagers);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    }




    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        else{
        fetchAndSetProjectManagers().then();
        }

    }, [navigate, token]);


    return (
        <Form onSubmit={handleSubmit}>
            <div className="main-content">
                <div className="project-page-content">
                    <Form.Group>
                        <Form.Label>Project Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
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
                            as="select"
                            value={projectManager || 'none'}
                            onChange={e => setProjectManager(e.target.value === 'none' ? null : e.target.value)}
                        >
                            <option value='none'>No Assignment</option>
                            {projectManagers.length > 0 ? (
                                projectManagers.map((user) => (
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
                        <Form.Label className="form-label">Priority</Form.Label>
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
                    <Form.Group style={{marginTop: '1rem'}}>
                        <Form.Label>Deadline</Form.Label>
                        <div>
                            {/*<ReactDatePicker selected={deadline} onChange={(date) => setDeadline(date)} />*/}
                            <ReactDatePicker
                                className="date-picker"
                                selected={deadline}
                                onChange={(date) => setDeadline(date)}
                                wrapperClassName='date-picker-wrapper'
                            />
                        </div>
                    </Form.Group>
                    <Button variant="primary" type="submit" className='submit-button'>Submit</Button>
                </div>
            </div>
        </Form>
    );
}

export default CreateProjectForm;
