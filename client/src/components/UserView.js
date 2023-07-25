import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import './UserView.css'
import {useNavigate, useParams} from 'react-router-dom';
import Modal from 'react-modal';
import React, {useEffect, useState} from "react";
import jwtDecode from "jwt-decode";
import {fetchUser} from "../controllers/UserController";
Modal.setAppElement('#root');


function UserView() {
    const {userId} = useParams();
    const [user, setUser] = useState([]);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }

        const fetchData = async () => {
            try {
                console.log("reached")
                console.log("userId: ", userId)
                const userData = await fetchUser(userId, token);
                setUser(userData);
                console.log("UD: ", userData);
                const decodedToken = jwtDecode(token);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
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
                <div className="main-content-uv">
                    <SideMenu/>
                    <div className="outside-container-uv">
                        <div className="overlapping-title-view">
                            <div className="title-text">
                                {user.title}
                            </div>
                            <div className="title-desc-text">
                                Back | Edit
                            </div>
                        </div>
                        <div className='user-details-top-container'>
                            <div className='user-details-section'>
                                <div className="user-details-left">
                                    <div>
                                        <div>Email: {user.email}</div>
                                        <div>Joined: {user.createdAt}</div>
                                    </div>
                                </div>
                                <div className="user-details-right">
                                    <div>
                                        <p>List of Projects here</p>
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
