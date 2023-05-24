import React, { useState, useEffect } from 'react';
import './AccordionBody.css';
import { fetchTicketsForProject } from '../controllers/TicketController';
import TicketTable from "./TicketTable";

function AccordionBody({ project }) {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetchAndSetTickets = async () => {
            const fetchedTickets = await fetchTicketsForProject(project._id);
            setTickets(fetchedTickets);
        };
        fetchAndSetTickets();
    }, [project]);



    return (
        <div>
            <p>{project.projectDescription}</p>
            <div className="horizontal-container">
                <div className="item">
                    <p className="header">Manager:</p>
                    <p>{project.projectManager}</p>
                </div>

                <div className="item">
                    <p className="header">Start Date:</p>
                    <p>{project.startDate}</p>
                </div>

                <div className="item">
                    <p className="header">End Date:</p>
                    <p>{project.endDate}</p>
                </div>

                <div className="item">
                    <p className="header">Priority:</p>
                    <p>{project.priority}</p>
                </div>

                <div className="item">
                    <p className="header">Status:</p>
                    <p>{project.currentStatus}</p>
                </div>

                <div className="item">
                    <p className="header">Associated Tickets:</p>
                    {tickets.map(ticket => (
                        <p key={ticket._id}>{ticket.title}</p>
                    ))}
                </div>
            </div>
            <div>
                {/* Other components or HTML elements... */}
                <h3>Tickets:</h3>
                <TicketTable tickets={tickets} projectID={project._id} />

            </div>
        </div>
    );
}

export default AccordionBody;
