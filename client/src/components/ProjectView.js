import './ProjectView.css'
import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import {useNavigate, useParams} from 'react-router-dom';
import Modal from 'react-modal';
import React, {useCallback, useEffect, useState} from "react";
import {
    deleteProject,
    fetchProject,
    fetchTicketsForProject,
    fetchUsersForProject,
    updateProject
} from "../controllers/ProjectController";
import {fetchUser, getAllUsers} from "../controllers/UserController";
import TicketTable from "./TicketTable";
import UserTable from "./UserTable";
import ProjectEditForm from "./ProjectEditForm";
import {FormLabel} from "react-bootstrap";
Modal.setAppElement('#root');

function ProjectView() {
    const {projectId} = useParams();
    const [project, setProject] = useState({});
    const [users, setUsers] = useState(null);
    const [tickets, setTickets] = useState(null);
    const [isEditing, setIsEditing] = useState(null);
    const [isEditingUsers, setIsEditingUsers] = useState(false);
    const [isAddingUsers, setIsAddingUsers] = useState(false);
    const [isEditingTickets, setIsEditingTickets] = useState(false);
    const EDIT_MODES = { PROJECT: 'PROJECT', USER: 'USER', TICKET: 'TICKET' };
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userTableViewMode, setUserTableViewMode] = useState('view');

    const [name, setName] = useState('');
    const [projectManager, setProjectManager] = useState(null);
    const [projectDescription, setProjectDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [deadline, setDeadline] = useState(null);
    const [priority, setPriority] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [projectManagers, setProjectManagers] = useState([]);
    const [assignableUsers, setAssignableUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);




    // updated click handlers to set correct mode
    const handleEditProjectClick = () => {
        setIsEditing(EDIT_MODES.PROJECT);
    };
    const handleEditUsersClick = async () => {
        if (isAddingUsers) {
            setIsAddingUsers(false);
        }
        setIsEditingUsers(!isEditingUsers);
    };

    const handleAddUsersClick = async () => {
        if (isEditingUsers) {
            setIsEditingUsers(false);
        }
        setIsAddingUsers(!isAddingUsers);
    };


    const handleEditTicketsClick = () => {
        setIsEditingTickets(!isEditingTickets);
    };

    const fetchAndSetUsers = useCallback(async () => {
        try {
            const fetchedUsers = await fetchUsersForProject(projectId, token);
            setUsers(fetchedUsers);
            setSelectedUsers(fetchedUsers.map(user => user._id));
            //todo check this, was 'users' now 'allUsers'
            const allUsers= await getAllUsers(token);
            const assignableUsers = allUsers.filter(user => user.role === 'submitter' || user.role === 'developer');
            setAssignableUsers(assignableUsers);

            if (fetchedUsers.length > 0) {
                const projectManagers = fetchedUsers.filter(user => user.role === 'projectmanager');
                setProjectManagers(projectManagers);
                if (projectManagers.length > 0) {
                    setProjectManager(projectManagers[0]._id);
                }
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    }, [token]);



    const handleEditClick = () => {
        setIsEditing(project._id);
    };

        const handleDeleteProject = (project) => {
        const confirmation = window.confirm(`Are you sure you want to delete project: ${project.name}?`);

        if (!confirmation) {
            return;
        }

        try {
            deleteProject(project._id, token);
            navigate("/projectpage");
        } catch (err) {
            console.error("Failed to delete project:", err);
            alert("Failed to delete project");
        }
    }

    const handleSave = async (updatedProject) => {
        if(updatedProject.deadline && updatedProject.deadline < updatedProject.startDate){
            alert("Deadline should not be before start date");
            return;
        }
        try {
            const updatedProjectData = await updateProject(updatedProject, token);
            setProject(updatedProjectData);
            setName(updatedProjectData.name);
            setProjectDescription(updatedProjectData.projectDescription);
            setStartDate(updatedProjectData.startDate ? new Date(updatedProjectData.startDate) : new Date());
            setDeadline(updatedProjectData.deadline ? new Date(updatedProjectData.deadline) : null);
            setPriority(updatedProjectData.priority);
            setCurrentStatus(updatedProjectData.currentStatus);



            if (updatedProjectData.projectManager) {
                const managerData = await fetchUser(updatedProjectData.projectManager, token);
                setProjectManager(managerData);
            }

            if (updatedProjectData.users && Array.isArray(updatedProjectData.users)) {
                const usersData = updatedProjectData.users;
                setUsers(usersData);
                setProject(currentProject => ({ ...currentProject, users: usersData }));
            }

            setIsEditing(null);

        } catch (error) {
            console.error('Failed to update project:', error);
        }
    };

    useEffect(() => {
        // console.log("useEffect pv 1")
        if (!token) {
            navigate('/login');
        }
        const fetchData = async () => {
            try {
                const projectData = await fetchProject(projectId, token);
                const ticketData = await fetchTicketsForProject(projectId, token);
                setProject(projectData);
                setTickets(ticketData)
                setName(projectData.name);
                setProjectDescription(projectData.projectDescription);
                setStartDate(projectData.startDate ? new Date(projectData.startDate) : new Date());
                setDeadline(projectData.deadline ? new Date(projectData.deadline) : null);
                setPriority(projectData.priority);
                setCurrentStatus(projectData.currentStatus);

                await fetchAndSetUsers();

                if (projectData.projectManager) {
                    const managerData = await fetchUser(projectData.projectManager, token);
                    setProjectManager(managerData);
                }

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch project or manager:', error);
            }
        };

        fetchData();
    }, [navigate, token, fetchAndSetUsers]);

    useEffect(() => {
        // console.log("useEffect pv 2")
        if (isAddingUsers) {
            setUserTableViewMode('add');
        } else if (isEditingUsers) {
            setUserTableViewMode('edit');
        } else {
            setUserTableViewMode('view');
        }
    }, [isAddingUsers, isEditingUsers]);


    if (loading) {
        return <p>Loading...</p>
    } else {
        return (
            <div>
                <CustomNavbar/>
                <div className="main-content">
                    <SideMenu/>
                    <div className="outside-container">
                        <div className="overlapping-title-view">
                            <div className="title-text">
                                {project.name}
                            </div>
                            <div className="title-desc-text">
                                Back | <button className="button-pv" onClick={handleEditProjectClick}>Edit</button>
                        </div>
                        </div>
                        <div className="project-details-top-container">
                            <div className='project-details-section'>
                                <div className="project-details-left">
                                    <div>
                                        Project Manager: {projectManager ?
                                        `${projectManager.firstName} ${projectManager.lastName}`  : 'N/A'}
                                    </div>
                                    <div>
                                        Status: {project.currentStatus}
                                    </div>
                                    <div>
                                        Priority: {project.priority}
                                    </div>
                                    <div>
                                        Start: {new Date(project.startDate).toLocaleDateString("en-US")}
                                    </div>
                                    <div>
                                        Deadline: {new Date(project.deadline).toLocaleDateString("en-US")}
                                    </div>
                                </div>
                                <div className="project-details-right">
                                    <div>
                                        <p>{project.projectDescription}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="horizontal-container-pv">
                            <div className="common-parent1">
                                <div className="overlapping-title-view">
                                    <div className="title-text">
                                        {"Users"}
                                    </div>
                                    <div className="title-desc-text">
                                        <button className="button-pv" onClick={handleAddUsersClick}>Add |</button> <button className="button-pv" onClick={handleEditUsersClick}>Edit</button>
                                    </div>
                                </div>
                                <div className="content">
                                    <UserTable
                                        users={users}
                                        setUsers={setUsers}
                                        token={token}
                                        isEditing={isEditingUsers}
                                        isAdding={isAddingUsers}
                                        viewMode={userTableViewMode}
                                        setViewMode={setUserTableViewMode}
                                        projectId={projectId}
                                        fetchAndSetUsers={fetchAndSetUsers}
                                    />
                                </div>
                            </div>
                            <div className="common-parent2">
                                <div className="overlapping-title-view">
                                    <div className="title-text">
                                        {"Tickets"}
                                    </div>
                                    <div className="title-desc-text">
                                        Add | <button className="button-pv" onClick={handleEditTicketsClick}>Edit</button>

                                    </div>
                                </div>
                                <div className="content">
                                    <TicketTable tickets={tickets} viewType={"default"} token={token} isEditing={isEditingTickets} projectId={projectId}></TicketTable>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={isEditing === EDIT_MODES.PROJECT}
                    onRequestClose={() => setIsEditing(null)}
                    contentLabel="Edit Project"
                >
                    <ProjectEditForm
                        projectId={projectId}
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
                </Modal>
            </div>
        )
    }
}
export default ProjectView;

