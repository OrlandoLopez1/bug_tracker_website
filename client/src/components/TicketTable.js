import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {Table, Pagination} from "react-bootstrap";
//todo fix css for gods sake please
import "./TicketTable.css";
import {removeUserFromProject} from "../controllers/ProjectController";

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


function TicketTable({ tickets, viewType, token, isEditing, projectId}) {
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 5;
    const totalPages = Math.ceil(tickets.length / ticketsPerPage);
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
    const [selectedTickets, setSelectedTickets] = useState({});

    // If less than usersPerPage users exist, create an array of empty users to fill the rest of the table
    const emptyRows = Array(ticketsPerPage - currentTickets.length).fill(null);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCheckboxChange = (userId, isChecked) => {
        setSelectedTickets({...selectedTickets, [userId]: isChecked,});
    };

    const handleRemove = () => {
        for (let selectedTicketId in selectedTickets) {
            console.log(selectedTicketId)
            // todo write the code for this function
            // removeTicketsFromProject(projectId, selectedTicketId, token)

        }
        setSelectedTickets({}); // Clear selected users after deleting
    };

    const columnsConfig = {
        default: ['Title', 'Type', 'Status', 'Priority'],
        user: ['Title', 'Status', 'Priority']
    };

    const columns = columnsConfig[viewType] || columnsConfig.default;

    useEffect(() => {
        // If isEditing changes from true to false, clear selectedUsers
        if (!isEditing) {
           setSelectedTickets({});
        }
    }, [isEditing]);

    if (!tickets) {
        return <p>Loading...</p>;
    }
    else{
        return (
            <div>
                {isEditing ? <Table className="table-ticket-edit-pv">
                    <thead>
                    <tr>
                        <th></th>
                        {columns.map((column) => <th scope="col" key={column}>{column}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {currentTickets.map((ticket) => (

                        <tr key={ticket._id}>
                            <td>
                                <input type="checkbox" checked={!!selectedTickets[ticket._id]} onChange={(e) => handleCheckboxChange(ticket._id, e.target.checked)} />
                            </td>
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
                            <td colSpan={columns.length + (isEditing ? 1 : 0)}>&nbsp;</td>
                        </tr>
                    ))}
                    </tbody>
                </Table> : <Table className="table-ticket-pv">
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
                            <td colSpan={columns.length + (isEditing ? 1 : 0)}>&nbsp;</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>}
                {/*<Table className="ticket-table-pv">*/}
                {/*    <thead>*/}
                {/*    <tr>*/}
                {/*        {columns.map((column) => <th scope="col" key={column}>{column}</th>)}*/}
                {/*    </tr>*/}
                {/*    </thead>*/}
                {/*    <tbody>*/}
                {/*    {currentTickets.map((ticket) => (*/}
                {/*        <tr key={ticket._id}>*/}
                {/*            {columns.includes('Title') &&*/}
                {/*                <td><Link className="ticket-link" to={`/ticketview/${ticket._id}`}>{ticket.title}</Link></td>*/}
                {/*            }*/}
                {/*            {columns.includes('Type') &&*/}
                {/*                <td>{ticket.type}</td>*/}
                {/*            }*/}
                {/*            {columns.includes('Status') &&*/}
                {/*                <td>{ticket.status}</td>*/}
                {/*            }*/}
                {/*            {columns.includes('Priority') &&*/}
                {/*                <td>*/}
                {/*                    <span*/}
                {/*                        style={{*/}
                {/*                            backgroundColor: getPriorityColor(ticket.priority),*/}
                {/*                            padding: "5px",*/}
                {/*                            borderRadius: "5px"*/}
                {/*                        }}>*/}
                {/*                        {ticket.priority}*/}
                {/*                    </span>*/}
                {/*                </td>*/}
                {/*            }*/}
                {/*        </tr>*/}
                {/*    ))}*/}
                {/*    {emptyRows.map((_, index) => (*/}
                {/*        <tr key={`empty-${index}`}>*/}
                {/*            <td colSpan={columns.length}>&nbsp;</td>*/}
                {/*        </tr>*/}
                {/*    ))}*/}
                {/*    </tbody>*/}
                {/*</Table>*/}
                <div className={"ticket-table-buttons-pv"}>
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
                    {isEditing && <button onClick={handleRemove}>Remove</button>}
                </div>
            </div>
        );

    }
}

export default TicketTable;
