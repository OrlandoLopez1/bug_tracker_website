import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ExpandedProjectCard = ({ project }) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{project.projectName}</Card.Title>
                <Card.Text>
                    Tickets: {project.associatedBugs.length}
                </Card.Text>
                <Card.Text>
                    Project Manager: {project.projectManager}
                </Card.Text>
                <Card.Text>
                    Team: {project.team.join(', ')}
                </Card.Text>
                <Card.Text>
                    Status: {project.status}
                </Card.Text>
                <Card.Text>
                    Description: {project.description}
                </Card.Text>
                {/* Add more fields as needed */}
            </Card.Body>
        </Card>
    );
}

export default ExpandedProjectCard;
