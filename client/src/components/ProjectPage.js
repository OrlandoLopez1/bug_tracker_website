import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import { Accordion } from 'react-bootstrap';
import './ProjectPage.css';
import AccordionBody from './AccordionBody';
import {fetchTickets} from "../controllers/TicketController";
import {fetchProjects} from "../controllers/ProjectController";

function ProjectPage() {
    const [username, setUsername] = useState(null);
    const [projects, setProjects] = useState([]);
    const placeholders = [
        {
            _id: "1",
            projectName: "Project 1",
            projectDescription: "Description for project 1",
            projectManager: "Manager 1",
            startDate: "01/01/2023",
            endDate: "01/12/2023",
            priority: "low",
            currentStatus: "Planning"
        },
        {
            _id: "2",
            projectName: "Project 2",
            projectDescription: "Description for project 2",
            projectManager: "Manager 2",
            startDate: "01/02/2023",
            endDate: "01/02/2024",
            priority: "high",
            currentStatus: "In progress"
        },
    ];

    useEffect(() => {
        const usernameFromStorage = localStorage.getItem('username');

        if (usernameFromStorage) {
            setUsername(usernameFromStorage);
        }
        const fetchData = async () => {
            try {
                const projectData =  await fetchProjects();
                setProjects(projectData);
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
            }
        };

        fetchData();
        setProjects(projects);
    }, []);

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
                                    {project.projectName}
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
