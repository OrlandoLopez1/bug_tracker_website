import './ProjectPage.css'
import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import {useNavigate, useParams} from 'react-router-dom';
import Modal from 'react-modal';
import ProjectForm from "./ProjectForm";
import React, {useEffect, useState} from "react";
import {deleteProject, fetchProject, updateProject} from "../controllers/ProjectController";
import ProjectPage from "./ProjectPage";
Modal.setAppElement('#root');


function ProjectView() {
    const { id } = useParams();
    const [project, setProject] = useState([]);
    const [editingProjectId, setEditingProjectId] = useState(null);  // new state variable
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectData = await fetchProject(id, token);
                setProject(projectData);
            } catch (error) {
                console.error('Failed to fetch project:', error);
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


    return (
        <div>
            <CustomNavbar/>

            <div className="main-content">
                <SideMenu />
                <div className="outside-container">
                    <div className="accordion-container">
                        <div className="overlapping-title">
                            <div className="title-text">
                                {project.name}
                            </div>
                            <div className="title-desc-text">
                                Back | Edit
                            </div>
                        </div>
                        <div className="project-details-row1">
                            <div>
                                <h1>Description:</h1>
                                <p>{project.projectDescription}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )}
export default ProjectView;
