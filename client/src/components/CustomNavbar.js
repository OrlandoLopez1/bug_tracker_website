import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar, Dropdown} from 'react-bootstrap';
import {logoutUser, getUserInfo} from "../controllers/AuthController";
import "./CustomNavbar.css";
import jwtDecode from "jwt-decode";

import { useNavigate } from 'react-router-dom';

function CustomNavbar() {
    const [userName, setUserName] = useState(null);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const userInfo = await getUserInfo();
                setUserName(userInfo.username);
            } catch (error) {
                console.error("Failed to fetch user info:", error);
            }
        }
        fetchUserInfo();
    }, []);


    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            // Call the logout API function
            logoutUser();
            // Clear the access token and navigate to the logout page
            localStorage.removeItem('accessToken');
            navigate("/login"); // Replace "/logout" with your actual logout page path
        } catch (error) {
            console.error('Error:', error);
        }
    };



    return (
        <Navbar bg="dark" variant="dark" className="custom-navbar">
            <Navbar.Brand href="#home">Placeholder</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Dropdown className="custom-dropdown">
                            <Dropdown.Toggle variant="transparent" id="dropdown-basic" className="custom-dropdown-toggle">
                                <img src={"/defaultpfp.jpg"} alt="user" className="profile-pic"/>
                                <span style={{ marginRight: '10px' }}>{userName}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="dropdown-menu-dark">
                                <Dropdown.Item href="#action/1" className="no-hover">Profile</Dropdown.Item>
                                <Dropdown.Item href="#action/2" className="no-hover">Settings</Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout} className="no-hover">Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default CustomNavbar;