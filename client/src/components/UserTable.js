import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {Table, Pagination} from "react-bootstrap";
import "./UserTable.css";

function UserTable({ users, viewType }) {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const totalPages = Math.ceil(users.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const emptyRows = Array(usersPerPage - currentUsers.length).fill(null);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const columnsConfig = {
        default: ['Name', 'Email', 'Role'],
        project: ['Name', 'Email', 'Role']
    };

    const columns = columnsConfig[viewType] || columnsConfig.default;

    return (
        <div>
            <Table className="table">
                <thead>
                <tr>
                    {columns.map((column) => <th scope="col" key={column}>{column}</th>)}
                </tr>
                </thead>
                <tbody>
                {currentUsers.map((user) => (
                    <tr key={user._id}>
                        {columns.includes('Name') &&
                            <td><Link className="user-link" to={`/userview/${user._id}`}>{user.firstName} {user.lastName}</Link></td>
                        }
                        {columns.includes('Email') &&
                            <td>{user.email}</td>
                        }
                        {columns.includes('Role') &&
                            <td>{user.role}</td>
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

export default UserTable;
