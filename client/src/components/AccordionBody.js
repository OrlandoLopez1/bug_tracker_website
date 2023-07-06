import React, {useState, useEffect, useCallback} from 'react';
import './AccordionBody.css';
import { fetchTicketsForProject } from '../controllers/TicketController';
import { fetchUsersForProject } from '../controllers/ProjectController';
import { Form, Button } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import TicketTable from "./TicketTable";
import UserTable from "./UserTable";
import {updateProject} from "../controllers/ProjectController";
import {getAllUsers} from "../controllers/UserController";
//todo update edit mode to include addition and removal of users
function AccordionBody({ project, isEditing, setIsEditing, onUpdateProject}) {
    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);
    const [name, setName] = useState(project.name);
    const [projectDescription, setProjectDescription] = useState(project.projectDescription);
    const [projectManager, setProjectManager] = useState(project.projectManager);
    const [startDate, setStartDate] = useState(project.startDate ? new Date(project.startDate) : new Date());
    const [deadline, setDeadline] = useState(project.deadline ? new Date(project.deadline) : null);
    const [priority, setPriority] = useState(project.priority);
    const [currentStatus, setCurrentStatus] = useState(project.currentStatus);
    const [projectManagers, setProjectManagers] = useState([]);
    const [assignableUsers, setAssignableUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const token = localStorage.getItem('accessToken');




    useEffect(() => {
        const fetchAndSetTickets = async () => {
            const token = localStorage.getItem('accessToken');
            const fetchedTickets = await fetchTicketsForProject(project._id, token);
            console.log("Fetched tickets: ", fetchedTickets);
            setTickets(fetchedTickets);
        };
        fetchAndSetTickets();
    }, [project]);

    useEffect(() => {
        const fetchAndSetUsers = async () => {
            const token = localStorage.getItem('accessToken');
            const fetchedUsers = await fetchUsersForProject(project._id, token);
            setUsers(fetchedUsers);
            setSelectedUsers(fetchedUsers.map(user => user._id));
        };
        fetchAndSetUsers();
    }, [project]);



    const handleSave = async () => {
        const updatedProject = {
            _id: project._id,
            name,
            projectDescription,
            projectManager,
            priority,
            currentStatus,
            startDate: startDate.toISOString(),
            users: selectedUsers,
            deadline: deadline ? deadline.toISOString() : null
        };
        if(deadline && deadline < startDate){
            alert("Deadline should not be before start date");
            return;
        }
        try {
            const response = await updateProject(updatedProject, token);
            setIsEditing(null);
            onUpdateProject(updatedProject);
        } catch (error) {
            console.error('Failed to update project:', error);
            }
    };


    const fetchAndSetProjectManagers = useCallback(async () => {
        try {
            const data = await getAllUsers(token);
            const projectManagers = data.filter(user => user.role === 'projectmanager');
            setProjectManagers(projectManagers); // setProjectManagers once
            if (projectManagers.length > 0) {
                setProjectManager(projectManagers[0]._id); // use setProjectManager instead
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    }, [token]);


    const fetchAndSetAssignalbleUsers = useCallback(async () => {
        try {
            const data = await getAllUsers(token);

            // filter the data for project managers only
            const assignableUsers = data.filter(user => user.role === 'submitter' || user.role === 'developer');

            if (assignableUsers.length > 0) {
                setAssignableUsers(assignableUsers[0]._id);
            }
            setAssignableUsers(assignableUsers);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    }, [token]);

    useEffect(() => {
        fetchAndSetProjectManagers().then();
        fetchAndSetAssignalbleUsers().then();
    }, [fetchAndSetProjectManagers, fetchAndSetAssignalbleUsers, token]);



    if (isEditing) {
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
    return (
        <div>
            <p>{project.projectDescription}</p>
            <div className="horizontal-container">
                <div className="item">
                    <p className="header">Manager:</p>
                    <p>{project.projectManager}</p>
                </div>

                <div className="item">
                    <p className="header">Start Date:</p>
                    <p>{new Date(project.startDate).toLocaleDateString()}</p>
                </div>

                <div className="item">
                    <p className="header">Deadline:</p>
                    <p>{project.deadline ? new Date(project.deadline).toLocaleDateString() : "None"}</p>
                </div>

                <div className="item">
                    <p className="header">Priority:</p>
                    <p>{project.priority}</p>
                </div>

                <div className="item">
                    <p className="header">Status:</p>
                    <p>{project.currentStatus}</p>
                </div>

            </div>
            <div>
                <h3>Tickets:</h3>
                {console.log(project)}
                <TicketTable tickets={tickets} projectID={project._id} />
            </div>
            <div>
                <h3>Users:</h3>
                <UserTable  users={users} projectID={project._id} />
            </div>
        </div>
    );
}

export default AccordionBody;
