import React from 'react';

function TicketTable({ tickets }) {
    return (
        <table className="table">
            <thead>
            <tr>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Assigned By</th>
                <th scope="col">Assigned To</th>
                <th scope="col">Status</th>
                <th scope="col">Priority</th>
            </tr>
            </thead>
            <tbody>
            {tickets.map((ticket, index) => (
                <tr key={ticket.title}>
                    <th scope="row">{index + 1}</th>
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
