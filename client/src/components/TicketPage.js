import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import TicketTable from './TicketTable';
import {fetchTickets} from '../controllers/TicketController.js'
import './TicketPage.css';
import { useNavigate } from 'react-router-dom';
import CoolTicketTable from "./CoolTicketTable";
import jwtDecode from "jwt-decode";

function TicketPage() {
    const [tickets, setTickets] = useState([]);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [ticketTableViewMode, setTicketTableViewMode] = useState('view');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ticketsData =  await fetchTickets(token);
                setTickets(ticketsData);
            }
            catch (error) {
                console.error('Failed to fetch tickets:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.UserInfo.id)
        }
    }, [token]);

    return (
        <div>
            <CustomNavbar/>
            <div className="main-content">
                <SideMenu />
                <div className="ticket-page-contents">
                    <div className="ticket-display">
                        <CoolTicketTable
                            viewMode={ticketTableViewMode}
                            setViewMode={setTicketTableViewMode}
                            token={token}
                            userId={userId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

}

export default TicketPage;
