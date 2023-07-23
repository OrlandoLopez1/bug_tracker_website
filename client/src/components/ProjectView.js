import './ProjectView.css'
import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import {useNavigate, useParams} from 'react-router-dom';
import Modal from 'react-modal';
import ProjectForm from "./ProjectForm";
import React, {useEffect, useState} from "react";
import {deleteProject, fetchProject, fetchUsersForProject, updateProject} from "../controllers/ProjectController";
import {fetchUser} from "../controllers/UserController";
import ProjectViewUserTable from "./UserTable";
import TicketTable from "./TicketTable";
import {fetchTicketsForProject} from "../controllers/TicketController";
Modal.setAppElement('#root');

//todo make it so that something appears in the place of an empty table
//todo issue with container resizing
//todo outside container is not extending with the accordions opening
//todo add pagination

function ProjectView() {
    const {id} = useParams();
    const [project, setProject] = useState([]);
    const [projectManager, setProjectManager] = useState(null);
    const [users, setUsers] = useState(null);
    const [editingProjectId, setEditingProjectId] = useState(null);  // new state variable
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        const fetchData = async () => {
            try {
                const projectData = await fetchProject(id, token);
                setProject(projectData);
                if (projectData.projectManager) {
                    const managerData = await fetchUser(projectData.projectManager, token);
                    setProjectManager(managerData);
                }
                if (projectData.users && Array.isArray(projectData.users)) {
                    const usersData = await fetchUsersForProject(id, token);
                    let ticketData = await fetchTicketsForProject(id, token);

                    if (ticketData.length === 0) {
                        setProject(curProject => ({ ...curProject, users: usersData, tickets: [] }));
                    }

                    const ticketsPromises = ticketData.map(async (ticket) => {
                        if (ticket.assignedTo) {
                            const assignedUserData = await fetchUser(ticket.assignedTo, token);
                            // Add assigned user data to the ticket
                            return {...ticket, assignedTo: assignedUserData};
                        }
                        return ticket;
                    });

                    ticketData = await Promise.all(ticketsPromises);

                    setProject(curProject => ({ ...curProject, users: usersData, tickets: ticketData }));
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch project or manager:', error);
            }
        };
        fetchData();
    }, [navigate, token]);



    const handleEditProject = (project) => {
        setEditingProjectId(project._id);  // when Edit button is clicked, set this project as being edited
    };

    const handleDeleteProject = (project) => {
        console.log("delete clicked", project);
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

    const handleUpdateProject = async (updatedProject) => {
        try {
            const response = await updateProject(updatedProject, token);
            setEditingProjectId(null); // Turn off edit mode when the update is successful
        } catch (error) {
            console.error('Failed to update project:', error);
        }
    };

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
                                Back | Edit
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
                                        <div>

                                        </div>
                                    </div>
                                    <div className="project-details-right">
                                        <div>
                                            <p>{project.projectDescription}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="horizontal-container">
                                <div className="common-parent1">
                                    <div className="overlapping-title-view">
                                        <div className="title-text">
                                            {"Users"}
                                        </div>
                                        <div className="title-desc-text">
                                            Add | Edit
                                        </div>
                                    </div>
                                        <div className="content">
                                            <ProjectViewUserTable users={project.users} className="my-table"/>
                                        </div>
                                </div>
                                <div className="common-parent2">
                                    <div className="overlapping-title-view">
                                        <div className="title-text">
                                            {"Tickets"}
                                        </div>
                                        <div className="title-desc-text">
                                            Add | Edit
                                        </div>
                                    </div>
                                        <div className="content">
                                            {/*todo adjust css for tickettable*/}
                                            {console.log(project.tickets)}
                                            <TicketTable tickets={project.tickets} projectID={project._id}></TicketTable>
                                        </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ProjectView;
