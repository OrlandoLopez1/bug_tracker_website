import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Dropdown } from 'react-bootstrap';
import "./CustomNavbar.css";
import jwtDecode from "jwt-decode";
import { logoutUser } from "../controllers/AuthController";
import { useNavigate } from 'react-router-dom';

function CustomNavbar() {
    const [userName, setUserName] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();

    useEffect(() => {
        // console.log("Custom Navbar useEffect 1")

        if (token) {
            const decodedToken = jwtDecode(token);
            const username = decodedToken.UserInfo.username;
            const role = decodedToken.UserInfo.role;
            setUserName(username);
            setUserRole(role);
        }
    }, [token]);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            logoutUser();
            localStorage.removeItem('accessToken');
            navigate("/login"); // Replace "/logout" with  actual logout page path
        } catch (error) {
            console.error('Error:', error);
        }
    };

    let roleDisplay;
    switch(userRole) {
        case 'admin':
            roleDisplay = <div className="admin-brand">Admin</div>;
            break;
        case 'projectmanager':
            roleDisplay = <div className="project-manager-brand">Manager</div>;
            break;
        case 'developer':
            roleDisplay = <div className="dev-brand">Developer</div>;
            break;
        case 'submitter':
            roleDisplay = <div className="sub-brand">Submitter</div>;
            break;
        default:
            roleDisplay = null;
    }

    return (
        <Navbar bg="dark" variant="dark" className="custom-navbar">
            <Navbar.Brand href="#home" style={{ fontFamily: 'sans-serif' }}>Pro-Man</Navbar.Brand>
            {roleDisplay}
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Dropdown className="custom-dropdown">
                            <Dropdown.Toggle variant="transparent" id="dropdown-basic" className="custom-dropdown-toggle">
                                <img src={"/defaultpfp.jpg"} alt="user" className="profile-pic" />
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
