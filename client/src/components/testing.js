import React, {useEffect, useState} from "react";
import ProjectViewUserTable from "./UserTable";
import {useNavigate, useParams} from "react-router-dom";
import {fetchProject, fetchUsersForProject} from "../controllers/ProjectController";
import {fetchUser} from "../controllers/UserController";
import './testing.css'
import CustomNavbar from "./CustomNavbar";
import SideMenu from "./SideMenu";

function Testing() {
    const [project, setProject] = useState([]);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const {id} = useParams();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        const fetchData = async () => {
            try {
                const projectData = await fetchProject(id, token);
                setProject(projectData);
                if (projectData.users && Array.isArray(projectData.users)) {
                    const usersData = await fetchUsersForProject(id, token);
                    setProject(curProject => ({...curProject, users: usersData}));
                }
                setLoading(false);

            } catch (error) {
                console.error('Failed to fetch project or manager:', error);
            }
        };
        fetchData();
    }, [navigate, token]);

    if (loading) {
        return <p>Loading...</p>
    } else {
        return (
            <div>
                <CustomNavbar/>

                <div className="main-content">
                    <SideMenu/>
                    <div className="common-parent">
                        <div className="overlapping-title">
                            <div className="title-text">
                                {"The Name"}
                            </div>
                            <div className="title-desc-text">
                                Back | Edit
                            </div>
                        </div>
                        <div className="outside-container">
                            <div className="content">
                                <ProjectViewUserTable users={project.users} className="my-table"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Testing;