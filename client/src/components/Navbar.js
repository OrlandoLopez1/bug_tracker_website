import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar } from 'react-bootstrap';

function CustomNavbar() {
    return (
        <Navbar bg="light" variant="light">
            <Container>
                <Navbar.Brand href="#home">
                    Placeholder
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;
