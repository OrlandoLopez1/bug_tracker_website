import React from 'react';

function TicketTable({ tickets }) {
    return (
        <table>
            <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Assigned By</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Priority</th>
            </tr>
            </thead>
            <tbody>
            {tickets.map((ticket) => (
                <tr key={ticket.title}>
                    <td>{ticket.title}</td>
                    <td>{ticket.description}</td>
                    <td>{ticket.assignedBy}</td>
                    <td>{ticket.assignedTo}</td>
                    <td>{ticket.status}</td>
                    <td>{ticket.priority}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default TicketTable;
