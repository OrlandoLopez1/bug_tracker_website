import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar } from 'react-bootstrap';
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
            <Navbar.Brand href="#home">
                Placeholder
            </Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Signed in as: <a href="#login">{userName}</a>
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default CustomNavbar;
