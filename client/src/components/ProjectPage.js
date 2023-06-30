import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import { Accordion } from 'react-bootstrap';
import './ProjectPage.css';
import AccordionBody from './AccordionBody';
import {fetchProjects, deleteProject, updateProject} from "../controllers/ProjectController";
import { useNavigate } from 'react-router-dom';

function ProjectPage() {
    const [username, setUsername] = useState(null);
    const [projects, setProjects] = useState([]);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectData =  await fetchProjects(token);
                setProjects(projectData);

            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        };

        fetchData().then();
        setProjects(projects);
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);

    const handleEditProject = (project) => {
        console.log("EDIT CLICKED", project);
    }

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
    return (
        <div>
            <CustomNavbar/>

            <div className="main-content">
                <SideMenu />
                <div className="accordion-container">
                    <h1>Projects</h1>
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
                                        <AccordionBody project={project} />
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
