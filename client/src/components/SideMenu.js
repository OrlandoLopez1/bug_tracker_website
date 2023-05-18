import React from 'react';
import { Button } from 'react-bootstrap';
import './SideMenu.css';

function SideMenu() {
    return (
        <div className="sidenav">
            <Button className="w-100 text-start">Dashboard</Button>
            <Button className="w-100 text-start">My Projects</Button>
            <Button className="w-100 text-start">My Tickets</Button>
        </div>
    );
}

export default SideMenu;
