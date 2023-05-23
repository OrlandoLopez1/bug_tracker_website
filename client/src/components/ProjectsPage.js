import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import ProjectCard from './ProjectCard';
import ExpandedProjectCard from './ExpandedCard';
import { fetchProjects } from '../controllers/ProjectController.js' //Assuming you have a function to fetch projects.
import './ProjectPage.css';

function ProjectsPage() {
    const [username, setUsername] = useState(null);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const usernameFromStorage = localStorage.getItem('username');

        if (usernameFromStorage) {
            setUsername(usernameFromStorage);
        }

        fetchProjects().then((projectsData) => {
            setProjects(projectsData);
        })
    }, []);

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    return (
        <div>
            <CustomNavbar username={username} />
            <div className="content-container">
                <SideMenu />
                <div className="project-cards-container">
                    {projects.map((project) => (
                        <ProjectCard key={project._id} project={project} onClick={handleProjectClick} />
                    ))}
                </div>
                {selectedProject && <ExpandedProjectCard project={selectedProject} />}
            </div>
        </div>
    );
}

export default ProjectsPage;
