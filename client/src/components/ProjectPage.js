import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import { Accordion } from 'react-bootstrap';
import './ProjectPage.css';
import AccordionBody from './AccordionBody';
import {fetchProjects} from "../controllers/ProjectController";
import { useNavigate } from 'react-router-dom';

function ProjectPage() {
    const [username, setUsername] = useState(null);
    const [projects, setProjects] = useState([]);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();

    useEffect(() => {
        // const usernameFromStorage = localStorage.getItem('username');

        // if (usernameFromStorage) {
        //     setUsername(usernameFromStorage);
        // }
        setUsername("PLACEHOLDERNOTREAL");
        const fetchData = async () => {
            try {
                const projectData =  await fetchProjects(token);
                setProjects(projectData);

            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        };

        fetchData().then();
        setProjects(projects); //todo check if necessary
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);

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
                                    <AccordionBody project={project} />
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
