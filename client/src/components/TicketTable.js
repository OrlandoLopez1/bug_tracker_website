import React from 'react';

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

function TicketTable({ tickets }) {
    return (
        <table className="table">
            <thead>
            <tr>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Type</th>
                <th scope="col">Project</th>
                <th scope="col">Assigned By</th>
                <th scope="col">Assigned To</th>
                <th scope="col">Status</th>
                <th scope="col">Priority</th>
            </tr>
            </thead>
            <tbody>
            {tickets.map((ticket) => (
                <tr key={ticket.title}>
                    <td>{ticket.title}</td>
                    <td>{ticket.description}</td>
                    <td>{ticket.type}</td>
                    <td>{ticket.project_name}</td>
                    <td>{ticket.assignedBy}</td>
                    <td>{ticket.assignedTo}</td>
                    <td>{ticket.status}</td>
                    <td>
                        <span style={{backgroundColor: getPriorityColor(ticket.priority), padding: "5px",
                                      borderRadius: "5px" }}>
                            {ticket.priority}
                        </span>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default TicketTable;
