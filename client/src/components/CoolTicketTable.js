import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {Table, Pagination} from "react-bootstrap";
import "./TicketTable.css";
import {
    addTicketToProject,
    addUserToProject,
    fetchPageOfTicketsForProject,
    fetchPageOfUsersForProject,
    removeTicketFromProject, removeUserFromProject
} from "../controllers/ProjectController";
import CoolButton from "./CoolButton";

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


function CoolTicketTable({tableType, token, projectId, viewMode, setViewMode}) {
    const [projectTickets, setProjectTickets] = useState([])
    const [selectedTickets, setSelectedTickets] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0); // Update this value based on the data from the API
    const [inputPage, setInputPage] = useState('1'); // Add state for the input page


    const fetchTicketsInProject = async () => {
        try {
            const { tickets, totalPages } = await fetchPageOfTicketsForProject(projectId, token, currentPage, pageSize)
            if (totalPages === currentPage) {
                let ticketsAndEmptyRows = [...tickets]
                const numEmptyRows = pageSize - tickets.length
                for (let i = 0; i < numEmptyRows; i++){
                    ticketsAndEmptyRows.push({})
                }
                setProjectTickets(ticketsAndEmptyRows);
            } else {
                setProjectTickets(tickets);
            }
            setTotalPages(totalPages);
        } catch (error) {
            console.error("error in fetchDevsAndSubsFromProject: ", error);
        }
    };


    const handleAdd = async () => {
        const additionPromises= Object.keys(selectedTickets).map(async selectedTicketId=> {
            if (selectedTickets[selectedTicketId]) {
                return addTicketToProject(projectId, selectedTicketId, token);
            }
        });
        await Promise.all(additionPromises);
        setSelectedTickets({});
        setViewMode('view');
    };


    const handleRemove = async () => {
        const removalPromises = Object.keys(selectedTickets).map(async selectedTicketId=> {
            if (selectedTickets[selectedTicketId]) {
                return removeTicketFromProject(projectId, selectedTicketId, token);
            }
        });
        await Promise.all(removalPromises);
        setSelectedTickets({});
    };

    const handleCheckboxChange = (ticketId, isChecked) => {
        setSelectedTickets({...selectedTickets, [ticketId]: isChecked,});
    };

    let table
    const columnsConfig = {
        default: ['Title', 'Type', 'Status', 'Priority'],
        user: ['Title', 'Status', 'Priority']
    };

    const columns = columnsConfig[tableType] || columnsConfig.default;

    switch (viewMode) {
        case 'view':
            table = (
                <div>
                    <Table className="table-ticket-pv">
                        <thead>
                        <tr>
                            {columns.map((column) => <th scope="col" key={column}>{column}</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {projectTickets.map((ticket) => (
                            <tr key={ticket._id}>
                                {columns.includes('Title') &&
                                    <td><Link className="ticket-link" to={`/ticketview/${ticket._id}`}>{ticket.title}</Link></td>
                                }
                                {columns.includes('Type') && <td>{ticket.type}</td>}
                                {columns.includes('Status') && <td>{ticket.status}</td>}
                                {columns.includes('Priority') &&
                                    <td>
                                    <span
                                        style={{
                                            backgroundColor: getPriorityColor(ticket.priority),
                                            padding: "5px",
                                            borderRadius: "5px",
                                        }}>
                                        {ticket.priority}
                                    </span>
                                    </td>
                                }
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                </div>
            )
            break;
        case 'edit':
            console.log("In edit mode");
            table = (
                <div>
                    <Table className="table-ticket-edit-pv">
                        <thead>
                        <tr>
                            <th></th>
                            {columns.map((column) => <th scope="col" key={column}>{column}</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {projectTickets.map((ticket) => (
                            <tr key={ticket._id}>
                                <td>
                                    <input type="checkbox" checked={!!selectedTickets[ticket._id]}
                                           onChange={(e) => handleCheckboxChange(ticket._id, e.target.checked)}/></td>
                                {columns.includes('Title') &&
                                    <td><Link className="ticket-link" to={`/ticketview/${ticket._id}`}>{ticket.title}</Link></td>
                                }
                                {columns.includes('Type') && <td>{ticket.Type}</td>}
                                {columns.includes('Status') && <td>{ticket.status}</td>}
                                {columns.includes('Priority') &&
                                    <td>
                                    <span
                                        style={{
                                            backgroundColor: getPriorityColor(ticket.priority),
                                            padding: "5px",
                                            borderRadius: "5px",
                                            overflow:"auto"
                                        }}>
                                        {ticket.priority}
                                    </span>
                                    </td>
                                }
                            </tr>
                        ))}
                        </tbody>

                    </Table>
                    {viewMode === 'edit' &&
                        <CoolButton
                            label={"remove"}
                            handleRequest={handleRemove}
                        />}
                </div>
            )
            break;
    }

    const handleInputChange = (e) => {
        const value = e.target.value;
        // Ensure that the value is a positive number
        if (/^\d+$/.test(value) || value === '') {
            setInputPage(value);
        }
    };

    const goToInputPage = () => {
        // Ensure that the input page is within the range of valid pages
        const page = Math.max(1, Math.min(totalPages, parseInt(inputPage)));
        setCurrentPage(page);
    };

    const paginationComponent = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{ visibility: currentPage === 1 ? 'hidden' : 'visible' }}
            >
                Prev
            </button>
            <input
                type="text"
                value={inputPage}
                onChange={handleInputChange}
                style={{ width: `${(inputPage.length * 8) + 10}px`, textAlign: 'center' }}
                onBlur={goToInputPage}
                onKeyPress={(e) => { if (e.key === 'Enter') goToInputPage() }}
            />
            <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{ visibility: currentPage === totalPages ? 'hidden' : 'visible' }}
            >
                Next
            </button>
        </div>
    );

    useEffect(() => {
        setInputPage(currentPage);
    }, [currentPage]);

    useEffect(() => {
        fetchTicketsInProject()
    }, [token])

    useEffect(() => {
        console.log("view mode: ", viewMode)
        console.log("Project Tickets: ", projectTickets)
    }, [viewMode,projectTickets])

    return (
        <div>
            {table}
            {paginationComponent}
        </div>
    )
}
export default CoolTicketTable
