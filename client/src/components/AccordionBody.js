import React, {useState, useEffect, useCallback} from 'react';
import './AccordionBody.css';
import {fetchProject, fetchTicketsForProject, fetchUsersForProject} from '../controllers/ProjectController';
import "react-datepicker/dist/react-datepicker.css";
import TicketTable from "./TicketTable";
import UserTable from "./UserTable";
import {updateProject} from "../controllers/ProjectController";
import {fetchUser, getAllUsers} from "../controllers/UserController";
import ProjectEditForm from "./ProjectEditForm";
import CoolUserTable from "./CoolUserTable";
import CoolTicketTable from "./CoolTicketTable";
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
            setTickets(fetchedTickets)
            // if no tickets were found for this project, fetchedTickets would be an empty array
            if (fetchedTickets.length === 0) {
                setTickets([]);
            }

        };

        fetchAndSetTickets();
    }, [project]);

    useEffect(() => {
        const fetchAndSetUsers = async () => {
            const token = localStorage.getItem('accessToken');
            const curProject = await fetchProject(project._id, token)
            const fetchedUsers = await fetchUsersForProject(project._id, token);
            const projectManager = await fetchUser(curProject.projectManager, token);
            setUsers(fetchedUsers);
            setSelectedUsers(fetchedUsers.map(user => user._id));
            setProjectManager(projectManager);

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
        if (JSON.stringify(updatedProject) === JSON.stringify(project)) {
            // If no updates were made, don't attempt to update the project
            setIsEditing(null);
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
            <ProjectEditForm
                name={name}
                setName={setName}
                projectDescription={projectDescription}
                setProjectDescription={setProjectDescription}
                projectManager={projectManager}
                setProjectManager={setProjectManager}
                projectManagers={projectManagers}
                priority={priority}
                setPriority={setPriority}
                currentStatus={currentStatus}
                setCurrentStatus={setCurrentStatus}
                assignableUsers={assignableUsers}
                setSelectedUsers={setSelectedUsers}
                selectedUsers={selectedUsers}
                startDate={startDate}
                setStartDate={setStartDate}
                deadline={deadline}
                setDeadline={setDeadline}
                setIsEditing={setIsEditing}
                handleSave={handleSave}
            />
        );
    }
    return (
        <div>
            <p className="description-item">{project.projectDescription}</p>
            <div className="horizontal-container">
                <div className="item">
                    <p className="header">Manager:</p>
                    <p>{projectManager ? `${projectManager.firstName} ${projectManager.lastName}` : 'N/A'}</p>
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
        </div>
    );
}

export default AccordionBody;

