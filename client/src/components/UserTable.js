import React, {useEffect, useState} from 'react';
import "./UserTable.css";
import {Pagination, Table} from 'react-bootstrap';
export function UserTable({users}) {

    return (
        <div>
            <Table className="table">
                <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Tickets Assigned</th>
                    <th scope="col">Tickets Completed</th>
                    <th scope="col">Start Date</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user._id}>
                        <td>
                            <img src={"/defaultpfp.jpg"} alt="user" className="table-profile-pic"/>
                            {user.firstName} {user.lastName}
                            <span className="table-username">{" (" + user.username + ")"}</span>

                        </td>
                        <td>{user.totalAssignedTickets || 0}</td>
                        <td>{user.totalCompletedTickets || 0}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                ))}

                </tbody>
            </Table>

        </div>
    );
}

export function ProjectViewUserTable({users, className}) {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const totalPages = Math.ceil(users.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // If less than usersPerPage users exist, create an array of empty users to fill the rest of the table
    const emptyRows = Array(usersPerPage - currentUsers.length).fill(null);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className={`table-container ${className}`}>
            <Table className="table">
                <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                </tr>
                </thead>
                <tbody>
                {currentUsers.map((user) => (
                    <tr key={user._id}>
                        <td>
                            <span className="table-name">{user.firstName} {user.lastName}</span>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                    </tr>
                ))}
                {/* Render empty rows */}
                {emptyRows.map((_, index) => (
                    <tr key={`empty-${index}`}>
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


export default ProjectViewUserTable;
