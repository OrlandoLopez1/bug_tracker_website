import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {Table, Pagination} from "react-bootstrap";
//todo fix css for gods sake please
import "./TicketTable.css";

function getPriorityColor(priority) {
    switch(priority) {
        case 'high':
            return '#FFD6C9';
        case 'medium':
            return '#FEFFD6';
        case 'low':
            return '#CAF2C2';
        default:
            return 'white';
    }
}


function TicketTable({ tickets, viewType }) {
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 5;
    const totalPages = Math.ceil(tickets.length / ticketsPerPage);
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

    // If less than usersPerPage users exist, create an array of empty users to fill the rest of the table
    const emptyRows = Array(ticketsPerPage - currentTickets.length).fill(null);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const columnsConfig = {
        default: ['Title', 'Type', 'Status', 'Priority'],
        user: ['Title', 'Status', 'Priority']
    };

    const columns = columnsConfig[viewType] || columnsConfig.default;

    if (!tickets) {
        return <p>Loading...</p>;
    }
    else{
        return (
            <div>
                <Table className="ticket-table-pv">
                    <thead>
                    <tr>
                        {columns.map((column) => <th scope="col" key={column}>{column}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {currentTickets.map((ticket) => (
                        <tr key={ticket._id}>
                            {columns.includes('Title') &&
                                <td><Link className="ticket-link" to={`/ticketview/${ticket._id}`}>{ticket.title}</Link></td>
                            }
                            {columns.includes('Type') &&
                                <td>{ticket.type}</td>
                            }
                            {columns.includes('Status') &&
                                <td>{ticket.status}</td>
                            }
                            {columns.includes('Priority') &&
                                <td>
                                    <span
                                        style={{
                                            backgroundColor: getPriorityColor(ticket.priority),
                                            padding: "5px",
                                            borderRadius: "5px"
                                        }}>
                                        {ticket.priority}
                                    </span>
                                </td>
                            }
                        </tr>
                    ))}
                    {emptyRows.map((_, index) => (
                        <tr key={`empty-${index}`}>
                            <td colSpan={columns.length}>&nbsp;</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <Pagination>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                        <Pagination.Item
                            key={pageNumber}
                            active={pageNumber === currentPage}
                            onClick={() => handlePageChange(pageNumber)}
                        >
                            {pageNumber}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
        );

    }
}

export default TicketTable;
