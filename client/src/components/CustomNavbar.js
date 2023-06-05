import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Nav, Navbar, Dropdown} from 'react-bootstrap';
import "./CustomNavbar.css";
import jwtDecode from "jwt-decode";

function CustomNavbar() {
    const [userName, setUserName] = useState(null);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            const username = decodedToken.UserInfo.username;
            setUserName(username);
        }
    }, [token]);

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
                                <Dropdown.Item href="#action/3" className="no-hover">Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    );


}

export default CustomNavbar;
