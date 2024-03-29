    import React, { useState, useEffect } from 'react';
    import SideMenu from './SideMenu';
    import CustomNavbar from './CustomNavbar';
    import { Accordion, Button } from 'react-bootstrap';
    import './ProjectPage.css';
    import AccordionBody from './AccordionBody';
    import {fetchProjects, deleteProject, updateProject} from "../controllers/ProjectController";
    import {fetchUserProjects} from "../controllers/UserController"
    import { useNavigate } from 'react-router-dom';
    import Modal from 'react-modal';
    import ProjectForm from "./ProjectForm";
    import jwtDecode from "jwt-decode";
    import button from "bootstrap/js/src/button";
    Modal.setAppElement('#root');
    //todo fix modal its hideous
    //todo block projects off by planning, finished, etc
    //todo make clicking the edit button also cancel
    function ProjectPage() {
        const [projects, setProjects] = useState([]);
        const [editingProjectId, setEditingProjectId] = useState(null);  // new state variable
        const token = localStorage.getItem('accessToken');
        const navigate = useNavigate();
        const [modalIsOpen, setModalIsOpen] = useState(false);
        const decodedToken = jwtDecode(token);
        const role = decodedToken.UserInfo.role;
        const userId = decodedToken.UserInfo.id
        useEffect(() => {
            const fetchData = async () => {
                if (!token) {
                    navigate('/login')
                }
                try {
                    if (role === 'admin'){
                        const projectData = await fetchProjects(token);
                        setProjects(projectData);
                    }
                    else {
                        const projectData = await fetchUserProjects(userId ,token);
                        setProjects(projectData);
                    }
                } catch (error) {
                    console.error('Failed to fetch projects:', error);
                }
            };

            fetchData();
            if (!token) {
                navigate('/login');
            }
        }, [navigate, token]);

        const handleEditProject = (project) => {
            if(editingProjectId === project._id) {
                // If the project is already being edited, set editingProjectId to null (cancel editing)
                setEditingProjectId(null);
            } else {
                // Otherwise, set this project as being edited
                setEditingProjectId(project._id);
            }
        };


        const handleDeleteProject = (project) => {
            console.log("delete clicked", project);
            const confirmation = window.confirm(`Are you sure you want to delete project: ${project.name}?`);

            if (!confirmation) {
                return;  // If the user cancels deletion, exit the function.
            }

            try {
                deleteProject(project._id, token);

                setProjects(prevProjects => prevProjects.filter(p => p._id !== project._id));
            } catch (err) {
                console.error("Failed to delete project:", err);
                alert("Failed to delete project");
            }
        }

        const handleUpdateProject = async (updatedProject) => {
            try {
                const response = await updateProject(updatedProject, token);
                setProjects(prevProjects =>
                    prevProjects.map(p => p._id === updatedProject._id ? updatedProject : p)
                );
                setEditingProjectId(null); // Turn off edit mode when the update is successful
            } catch (error) {
                console.error('Failed to update project:', error);
            }
        };

        const handleCreateProject = (newProject) => {
            // Add the new project to the state so that it appears immediately in the UI
            setProjects(prevProjects => [newProject, ...prevProjects]);
            setModalIsOpen(false);

        };

        return (
            <div className="root">
                <CustomNavbar/>
                <div className="main-content">
                    <SideMenu />
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={() => setModalIsOpen(false)}
                        contentLabel="Create Project Form"
                        className="custom-modal"
                    >
                        <div className="modal-content">
                            <ProjectForm
                                onProjectCreated={handleCreateProject}
                                closeForm={() => setModalIsOpen(false)}
                            />
                        </div>
                    </Modal>
                    <div className="outside-container">
                    <div className="overlapping-title-project-page">
                            <div className="title-text">
                                Projects
                            </div>
                            <div className="title-desc-text">
                                {role === 'projectmanager' || role === 'admin' ?
                                    (
                                        <button className="add-button" variant="primary" onClick={() => setModalIsOpen(true)}>Add</button>
                                    ) : (
                                        "All assigned projects"
                                    )
                                }
                            </div>

                        </div>
                        <div className="accordion-container">
                            <Accordion>
                                <div className="top-item"></div>
                                {projects.map((project, index) => (
                                    <Accordion.Item
                                        eventKey={index.toString()}
                                        key={project._id}
                                        className="accordion-item"
                                        style={index === 0 ? { border: "1px solid #dee2e6", borderRadius: "calc(0.375rem - 1px)" } : {}}
                                    >
                                        <Accordion.Header>
                                            {project.name}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className="accordion-content">
                                                    {role === "projectmanager" || role === "admin" ?
                                                        (
                                                            <div className="accordion-buttons">
                                                                <button onClick={() => navigate(`/projectview/${project._id}`)}>View</button>
                                                                <button onClick={() => handleEditProject(project)}>Edit</button>
                                                                <button onClick={() => handleDeleteProject(project)}>Delete</button>
                                                            </div>
                                                        ) : (
                                                            <div className="accordion-buttons">
                                                                <button onClick={() => navigate(`/projectview/${project._id}`)}>View</button>
                                                            </div>
                                                        )

                                                    }
                                                <AccordionBody
                                                    project={project}
                                                    isEditing={editingProjectId === project._id}
                                                    setIsEditing={setEditingProjectId}
                                                    onUpdateProject={handleUpdateProject}
                                                />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        );

    }

    export default ProjectPage;

