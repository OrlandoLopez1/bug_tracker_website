import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import TicketTable from './TicketTable';
import './TicketPage.css';

async function fetchTickets() {
    const response = await fetch('http://localhost:5000/tickets');

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tickets = await response.json();
    return tickets;
}

function TicketPage() {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ticketsData = await fetchTickets();
                setTickets(ticketsData);
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
            }
        };

        fetchData();
    }, []);

    const [username, setUsername] = useState(null);

    useEffect(() => {
        const usernameFromStorage = localStorage.getItem('username');

        if (usernameFromStorage) {
            setUsername(usernameFromStorage);
        }
    }, []);

    return (
        <div>
            <CustomNavbar username={username} />
            <div className="content-container">
                <SideMenu />
                <div className="ticket-page-content">
                    <h1>Tickets</h1>
                    <TicketTable tickets={tickets} />
                </div>
            </div>
        </div>
    );

}

export default TicketPage;
