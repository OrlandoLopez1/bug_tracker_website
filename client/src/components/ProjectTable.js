import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {Table, Pagination} from "react-bootstrap";
import "./ProjectTable.css";

function getPriorityColor(priority) {
    switch(priority) {
        case 'high':
            return '#FFD6C9';
        case 'medium':
            return '#FEFFD6';
        case 'low':
            return '#CAF2C2';
        default:
            return 'white';
    }
}

function ProjectTable({ projects, viewType }) {
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 5;
    const totalPages = Math.ceil(projects.length / projectsPerPage);
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    const emptyRows = Array(projectsPerPage - currentProjects.length).fill(null);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const columnsConfig = {
        default: ['Name', 'Description', 'Manager', 'Start Date', 'Status', 'Priority'],
        user: ['Name', 'Status', 'Priority']
    };

    const columns = columnsConfig[viewType] || columnsConfig.default;

    return (
        <div>
            <Table className="table">
                <thead>
                <tr>
                    {columns.map((column) => <th scope="col" key={column}>{column}</th>)}
                </tr>
                </thead>
                <tbody>
                {currentProjects.map((project) => (
                    <tr key={project._id}>
                        {columns.includes('Name') &&
                            <td><Link className="project-link" to={`/projectview/${project._id}`}>{project.name}</Link></td>
                        }
                        {columns.includes('Description') &&
                            <td>{project.projectDescription}</td>
                        }
                        {columns.includes('Manager') &&
                            <td>{project.projectManager}</td>
                        }
                        {columns.includes('Start Date') &&
                            <td>{new Date(project.startDate).toLocaleDateString()}</td>
                        }
                        {columns.includes('Status') &&
                            <td>{project.currentStatus}</td>
                        }
                        {columns.includes('Priority') &&
                            <td>
                                <span
                                    style={{
                                        backgroundColor: getPriorityColor(project.priority),
                                        padding: "5px",
                                        borderRadius: "5px"
                                    }}>
                                    {project.priority}
                                </span>
                            </td>
                        }
                    </tr>
                ))}
                {emptyRows.map((_, index) => (
                    <tr key={`empty-${index}`}>
                        <td colSpan={columns.length}>&nbsp;</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <Pagination>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <Pagination.Item
                        key={pageNumber}
                        active={pageNumber === currentPage}
                        onClick={() => handlePageChange(pageNumber)}
                    >
                        {pageNumber}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    );
}

export default ProjectTable;
