import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import './UserView.css'
import {useNavigate, useParams} from 'react-router-dom';
import Modal from 'react-modal';
import React, {useEffect, useState} from "react";
import jwtDecode from "jwt-decode";
import {fetchUser, fetchUserProjects} from "../controllers/UserController";
Modal.setAppElement('#root');


function UserView() {
    const {userId} = useParams();
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }

        const fetchData = async () => {
            try {
                const userData = await fetchUser(userId, token);
                const userProjects = await fetchUserProjects(userId, token);
                setUser(userData);
                setProjects(userProjects);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, [navigate, token, userId]);

    if (loading) {
        return <p>Loading...</p>
    } else {
        return (
            <div>
                <CustomNavbar/>
                <div className="main-content-uv">
                    <SideMenu/>
                    <div className="outside-container-uv">
                        <div className='user-details-container'>
                            <div className="user-profile-picture-container">
                                <img src="/defaultpfp.jpg" alt="Profile1" className="profile-picture"/>
                                <div className="user-name-role">
                                    <h2>{`${user.firstName} ${user.lastName}`}</h2>
                                    <p>{user.role}</p>
                                </div>
                            </div>
                            <div className='user-details-section'>



                                <div className="user-details-left">
                                    <div>
                                        <div>Email: {user.email}</div>
                                        <div>Joined: {user.createdAt}</div>
                                    </div>
                                </div>
                                <div className="user-details-right">
                                    <div>
                                        <p>Projects:</p>
                                        <ul>
                                            {projects && projects.map((project) => (
                                                <li key={project._id}>{project.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default UserView;