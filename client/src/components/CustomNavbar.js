import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navbar } from 'react-bootstrap';
import "./CustomNavbar.css";

function CustomNavbar() {
    const username = localStorage.getItem('username');

    return (
        <Navbar bg="dark" variant="dark" className="custom-navbar">
            <Navbar.Brand href="#home">
                Placeholder
            </Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    Signed in as: <a href="#login">{username}</a>
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default CustomNavbar;
