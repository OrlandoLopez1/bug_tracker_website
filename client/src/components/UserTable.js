import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {Table, Pagination} from "react-bootstrap";
import "./UserTable.css";
import {deleteUser, fetchUserProjects} from "../controllers/UserController";
import {removeUserFromProject} from "../controllers/ProjectController";
function UserTable({ users, viewType, token, isEditing, projectId}) {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const totalPages = Math.ceil(users.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const [selectedUsers, setSelectedUsers] = useState({});

    const emptyRows = Array(usersPerPage - currentUsers.length).fill(null);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCheckboxChange = (userId, isChecked) => {
        setSelectedUsers({...selectedUsers, [userId]: isChecked,});
    };

    const  handleRemove = () => {
        for (let selectedUserId in selectedUsers) {
            console.log(selectedUserId)
            removeUserFromProject(projectId, selectedUserId, token)

        }
            setSelectedUsers({}); // Clear selected users after deleting
    };

    const columnsConfig = {
        default: ['name', 'email', 'role'],
        project: ['name', 'email', 'role'],
        full: ['profilePicture', 'firstName', 'lastName', 'username', 'email', 'role', 'projects', 'tickets', 'skills']
    };

    const columns = columnsConfig[viewType] || columnsConfig.default;

    useEffect(() => {
        // If isEditing changes from true to false, clear selectedUsers
        if (!isEditing) {
            setSelectedUsers({});
        }
    }, [isEditing]);
    return (
        <div>
                {isEditing ? <Table className="table-user-edit-pv">
                    <thead>
                    <tr>
                        <th></th>
                        {columns.map((column) => <th scope="col" key={column}>{column}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user._id}>
                             <td>
                                <input type="checkbox" checked={!!selectedUsers[user._id]} onChange={(e) => handleCheckboxChange(user._id, e.target.checked)} />
                             </td>
                            {columns.includes('profilePicture') && <td><img src="/defaultpfp.jpg" alt="Profile1" className="profile-picture-edit-ut"/></td>}
                            {columns.includes('firstName') && <td>{user.firstName}</td>}
                            {columns.includes('lastName') && <td>{user.lastName}</td>}
                            {columns.includes('name') && <td><Link className="user-link" to={`/userview/${user._id}`}>{user.firstName} {user.lastName}</Link></td>}
                            {columns.includes('username') && <td>{user.username}</td>}
                            {columns.includes('email') && <td>{user.email}</td>}
                            {columns.includes('role') && <td>{user.role}</td>}
                        </tr>
                    ))}
                    {emptyRows.map((_, index) => (
                        <tr key={`empty-${index}`}>
                            <td colSpan={columns.length + (isEditing ? 1 : 0)}>&nbsp;</td>
                        </tr>
                    ))}
                    </tbody>

                </Table> : <Table className="table-user-pv">
                <thead>
                <tr>
                    {columns.map((column) => <th scope="col" key={column}>{column}</th>)}
                </tr>
                </thead>
                <tbody>
                {currentUsers.map((user) => (
                    <tr key={user._id}>
                        {columns.includes('profilePicture') && <td><img src="/defaultpfp.jpg" alt="Profile1" className="profile-picture-edit-ut"/></td>}
                        {columns.includes('firstName') && <td>{user.firstName}</td>}
                        {columns.includes('lastName') && <td>{user.lastName}</td>}
                        {columns.includes('name') && <td><Link className="user-link" to={`/userview/${user._id}`}>{user.firstName} {user.lastName}</Link></td>}
                        {columns.includes('username') && <td>{user.username}</td>}
                        {columns.includes('email') && <td>{user.email}</td>}
                        {columns.includes('role') && <td>{user.role}</td>}
                    </tr>
                ))}
                {emptyRows.map((_, index) => (
                    <tr key={`empty-${index}`}>
                        <td colSpan={columns.length + (isEditing ? 1 : 0)}>&nbsp;</td>
                    </tr>
                ))}
                </tbody>
            </Table>}

            <div className={"user-table-buttons-pv"}>
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

export default UserTable;
