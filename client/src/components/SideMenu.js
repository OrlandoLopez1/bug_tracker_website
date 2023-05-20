import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import './SideMenu.css';
import { useNavigate } from 'react-router-dom';

async function getUserData(username) {
    const response = await fetch(`http://localhost:5000/user?username=${username}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

function SideMenu() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const username = localStorage.getItem('username');
            if (username) {
                try {
                    const data = await getUserData(username);
                    setUserData(data);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div className="sidenav">
            {userData && (
                <div className="profile-info">
                    <img src="/defaultpfp.jpg" alt="Profile1" className="profile-picture"/>
                    <h2>{userData.username}</h2>
                </div>
            )}
            <Button className="w-100 text-start">Dashboard</Button>
            <Button className="w-100 text-start">My Projects</Button>
            <Button className="w-100 text-start" onClick={() => navigate('/ticketPage')}>My Tickets</Button>
        </div>
    );
}

export default SideMenu;
