import React, {useState, useEffect} from 'react';
import {Table, Pagination} from "react-bootstrap";
//todo fix css for gods sake please
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

// Other imports remain the same...

function TicketTable({ tickets, projectID }) {
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

    return (
        <div>
            <Table className="table">
                <thead>
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Type</th>
                    <th scope="col">Assigned To</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Priority</th>
                </tr>
                </thead>
                <tbody>
                {currentTickets.map((ticket) => (
                    <tr key={ticket._id}>
                        <td>{ticket.title}</td>
                        <td>{ticket.type}</td>
                        <td>{ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` : 'N/A'}</td>
                        <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                        <td>{ticket.status}</td>
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
                    </tr>
                ))}
                {emptyRows.map((_, index) => (
                    <tr key={`empty-${index}`}>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
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

export default TicketTable;
