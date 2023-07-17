import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import {useNavigate, useParams} from 'react-router-dom';
import Modal from 'react-modal';
import React, {useEffect, useState} from "react";
import TicketTable from "./TicketTable";
import {deleteTicket, fetchTicket, fetchTicketsForProject, updateTicket} from "../controllers/TicketController";
import {fetchUser} from "../controllers/UserController";
Modal.setAppElement('#root');

function TicketView() {
    const {id} = useParams();
    const [ticket, setTicket] = useState([]);
    const [assignedUser, setAssignedUser] = useState(null);
    const [editingTicketId, setEditingTicketId] = useState(null);  // new state variable
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }

        const fetchData = async () => {
            try {
                const ticketData = await fetchTicket(id, token);
                setTicket(ticketData);
                if (ticketData.assignedTo) {
                    const userData = await fetchUser(ticketData.assignedTo, token);
                    setAssignedUser(userData);
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, [navigate, token]);



    const handleEditTicket = (ticket) => {
        setEditingTicketId(ticket._id);  // when Edit button is clicked, set this project as being edited
    };

    const handleDeleteTicket = (ticket) => {
        console.log("delete clicked", ticket);
        const confirmation = window.confirm(`Are you sure you want to delete Ticket: ${ticket.title}?`);

        if (!confirmation) {
            return;
        }

        try {
            deleteTicket(ticket._id, token);
            navigate(`/projectview/${ticket.project}`)
        } catch (err) {
            console.error("Failed to delete ticket:", err);
            alert("Failed to delete ticket");
        }
    }

    const handleUpdateTicket = async (updatedTicket) => {
        try {
            const response = await updateTicket(updatedTicket, token);
            setEditingTicketId(null);
        } catch (error) {
            console.error('Failed to update ticket:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>
    } else {
        return (
            <div>
                <CustomNavbar/>
                <div className="main-content">
                    <SideMenu/>
                    <div className="outside-container top-container">
                        <div className="overlapping-title-view">
                            <div className="title-text">
                                {ticket.title}
                            </div>
                            <div className="title-desc-text">
                                Back | Edit
                            </div>
                        </div>
                        <div className="outside-container">
                            <div className="ticket-details-top-container">
                                <div className='ticket-details-section'>
                                    <div className="ticketx`-details-left">
                                        <div>
                                            Assigned to: {assignedUser ?
                                            `${assignedUser.firstName} ${assignedUser.lastName}`  : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="ticket-details-right">
                                        <div>
                                            <p>{ticket.ticketDescription}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default TicketView;
