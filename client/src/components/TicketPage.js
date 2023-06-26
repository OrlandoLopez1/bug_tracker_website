import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import TicketTable from './TicketTable';
import {fetchTickets} from '../controllers/TicketController.js'
import './TicketPage.css';
import { useNavigate } from 'react-router-dom';

function TicketPage() {
    const [tickets, setTickets] = useState([]);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ticketsData =  await fetchTickets(token);
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
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);

    return (
        <div>
            <CustomNavbar username={username} />
            <div className="main-content">
                c<SideMenu />
                <div className="ticket-page-content">
                    <h1>Tickets</h1>
                    <TicketTable tickets={tickets} />
                </div>
            </div>
        </div>
    );

}

export default TicketPage;
