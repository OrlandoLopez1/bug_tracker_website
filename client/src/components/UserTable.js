import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {Table, Pagination} from "react-bootstrap";
import "./UserTable.css";
import {deleteUser, fetchUserProjects, getAllUsers} from "../controllers/UserController";
import {fetchUsersForProject, addUserToProject, removeUserFromProject} from "../controllers/ProjectController";
function UserTable({ users, setUsers, tableType, viewMode, token, isEditing, projectId}) {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const totalPages = Math.ceil(users.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const [selectedUsers, setSelectedUsers] = useState({});
    const emptyRows = Array(usersPerPage - currentUsers.length).fill(null);
    const [displayUsers, setDisplayUsers] = useState(users);
    const [allUsers, setAllUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCheckboxChange = (userId, isChecked) => {
        setSelectedUsers({...selectedUsers, [userId]: isChecked,});
    };

    const fetchUsers = async () => {
        try {
            const fetchedUsers = await fetchUsersForProject(projectId, token);
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("ChildComponent.js fetchData error: ", error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const allFetchedUsers= await getAllUsers(token);
            setAllUsers(allFetchedUsers);
            const types = ['developer', 'submitter'];
            const usersFilteredByType = allUsers.filter(user => types.includes(user.type));
            setFilteredUsers(usersFilteredByType)
        }
        catch (error) {
            console.error(`Error fetching all users: ${error}`)
        }

    }

   const handleAdd = async () => {
       const additionPromises= Object.keys(selectedUsers).map(async selectedUserId=> {
           if (selectedUsers[selectedUserId]) {
               console.log(selectedUserId);
               return addUserToProject(projectId, selectedUserId, token);
           }
       });
        await Promise.all(additionPromises);
        console.log(`removal promises ${additionPromises}`)
        setSelectedUsers({});
        fetchUsers();
   };

    const  handleRemove = async () => {
        const removalPromises = Object.keys(selectedUsers).map(async selectedUserId=> {
            if (selectedUsers[selectedUserId]) {
                console.log(selectedUserId);
                return removeUserFromProject(projectId, selectedUserId, token);
            }
        });
            await Promise.all(removalPromises);
            console.log(`removal promises ${removalPromises}`)
            setSelectedUsers({});
            fetchUsers();
        };


    const columnsConfig = {
        default: ['name', 'email', 'role'],
        project: ['name', 'email', 'role'],
        full: ['profilePicture', 'firstName', 'lastName', 'username', 'email', 'role', 'projects', 'tickets', 'skills']
    };

    const columns = columnsConfig[tableType] || columnsConfig.default;

    let table;
    switch(viewMode) {
        case 'view':
            console.log("In view mode")
            table = (
                <div>
                    <Table className="table-user-pv">
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
                    </Table>

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
                    </div>
                </div>
            )
            break;
        case 'edit':
            console.log("In edit mode");
            table = (
                <div>
                    <Table className="table-user-edit-pv">
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
                                    <input type="checkbox" checked={!!selectedUsers[user._id]}
                                           onChange={(e) => handleCheckboxChange(user._id, e.target.checked)}/>
                                </td>
                                {columns.includes('profilePicture') &&
                                    <td><img src="/defaultpfp.jpg" alt="Profile1" className="profile-picture-edit-ut"/>
                                    </td>}
                                {columns.includes('firstName') && <td>{user.firstName}</td>}
                                {columns.includes('lastName') && <td>{user.lastName}</td>}
                                {columns.includes('name') && <td><Link className="user-link"
                                                                       to={`/userview/${user._id}`}>{user.firstName} {user.lastName}</Link>
                                </td>}
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

                    </Table>

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
                        {viewMode === 'edit' && <button onClick={handleRemove}>Remove</button>}
                    </div>
                </div>
            )
            break;

        case 'add':
            console.log("In add mode");
            table = (
                <div>
                    <Table className="table-user-edit-pv">
                        <thead>
                        <tr>
                            <th></th>
                            {columns.map((column) => <th scope="col" key={column}>{column}</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    <input type="checkbox" checked={!!selectedUsers[user._id]}
                                           onChange={(e) => handleCheckboxChange(user._id, e.target.checked)}/>
                                </td>
                                {columns.includes('profilePicture') &&
                                    <td><img src="/defaultpfp.jpg" alt="Profile1" className="profile-picture-edit-ut"/>
                                    </td>}
                                {columns.includes('firstName') && <td>{user.firstName}</td>}
                                {columns.includes('lastName') && <td>{user.lastName}</td>}
                                {columns.includes('name') && <td><Link className="user-link" to={`/userview/${user._id}`}>{user.firstName} {user.lastName}</Link>
                                </td>}
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

                    </Table>
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

                            {viewMode === 'add' && <button onClick={handleAdd}>Add</button>}
                        </div>
                    </div>
            )
            break;

    }

    useEffect(() => {
        if (!isEditing) {
            setSelectedUsers({});
        }
        setSelectedUsers({})
        fetchAllUsers();
    }, [token]);

   useEffect(() => {
       console.log("all users: ", allUsers)
       const types = ['developer', 'submitter'];
        console.log('Users: ', users)
       const usersFilteredByType = allUsers.filter(user =>
           types.includes(user.role) && !users.some(existingUser => existingUser._id === user._id)
       );
       setFilteredUsers(usersFilteredByType)
   },[allUsers])


    return (
        <div>
            {table}
        </div>
    );
}

export default UserTable;
