import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import { Accordion, Button } from 'react-bootstrap';
import './ProjectPage.css';
import AccordionBody from './AccordionBody';
import {fetchProjects, deleteProject, updateProject} from "../controllers/ProjectController";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import projectForm from "./ProjectForm";
import ProjectForm from "./ProjectForm";
Modal.setAppElement('#root');

function ProjectPage() {
    const [username, setUsername] = useState(null);
    const [projects, setProjects] = useState([]);
    const [editingProjectId, setEditingProjectId] = useState(null);  // new state variable
    const [editedProjectId, setEditedProjectId] = useState(null);  // new state variable
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectData = await fetchProjects(token);
                setProjects(projectData);
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
        setEditingProjectId(project._id);  // when Edit button is clicked, set this project as being edited
    };

    const handleDeleteProject = (project) => {
        console.log("delete clicked", project);
        const confirmation = window.confirm(`Are you sure you want to delete project: ${project.name}?`);

        if (!confirmation) {
            return;  // If the user cancels deletion, exit the function.
        }

        try {
            deleteProject(project._id, token);

            // After deletion, you should remove the project from your local state
            // so the UI updates immediately. You could filter out the deleted project:
            setProjects(prevProjects => prevProjects.filter(p => p._id !== project._id));
        } catch (err) {
            console.error("Failed to delete project:", err);
            // You could show an error message to the user here.
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
    };

    return (
        <div>
            <CustomNavbar/>

            <div className="main-content">
                <SideMenu />
                <div className="accordion-container">
                    <h1>Projects</h1>
                    <Button variant="primary" onClick={() => setModalIsOpen(true)}>Create New Project</Button>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={() => setModalIsOpen(false)}
                        contentLabel="Create Project Form"
                        className="custom-modal"
                    >
                        <ProjectForm
                            onProjectCreated={handleCreateProject}
                            closeForm={() => setModalIsOpen(false)}
                        />
                    </Modal>
                    <Accordion>
                        {projects.map((project, index) => (
                            <Accordion.Item eventKey={index.toString()} key={project._id} className="accordion-item">
                                <Accordion.Header>
                                    {project.name}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="accordion-content">
                                        <div className="accordion-buttons">
                                            <button onClick={() => handleEditProject(project)}>Edit</button>
                                            <button onClick={() => handleDeleteProject(project)}>Delete</button>
                                        </div>
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
    );

}

export default ProjectPage;
