import React from 'react';
import { Card, Button } from 'react-bootstrap';
import SideMenu from "./SideMenu";

const ProjectCard = ({ project, onClick }) => {
    return (
        <Card style={{ width: '18rem' }} onClick={() => onClick(project)}>
            <Card.Body>
                <Card.Title>{project.projectName}</Card.Title>
                <Card.Text>
                    Tickets: {project.associatedBugs.length}
                </Card.Text>
                <Card.Text>
                    Project Manager: {project.projectManager}
                </Card.Text>
                </Card.Body>
        </Card>
                )};

export default ProjectCard;
