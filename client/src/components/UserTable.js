import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {Table, Pagination} from "react-bootstrap";
import "./UserTable.css";
import {deleteUser, fetchUserProjects, getAllUsers} from "../controllers/UserController";
import {fetchUsersForProject, addUserToProject, removeUserFromProject} from "../controllers/ProjectController";
import CoolButton from "../components/CoolButton"
function UserTable({ users, setUsers, tableType, viewMode, setViewMode, token, isEditing, projectId}) {
    // users includes every user assigned to the specific project
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const totalPages = Math.ceil(users.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    // initial users before any changes have been made to the table
    const initialUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const [addableUsers, setAddableUsers] = useState([])


    const [selectedUsers, setSelectedUsers] = useState({});
    //todo fix issue where add table has wrong number of empty rows
    // const emptyRowsEditTable = Array(usersPerPage - initialUsers.length).fill(null);
    const [filteredUsers, setFilteredUsers] = useState([])
    const [emptyRowsEditTable, setEmptyRowsEditTable] = useState(Array(usersPerPage - filteredUsers.length).fill(null));
    const [emptyRowsAddTable, setEmptyRowsAddTable] = useState(Array(usersPerPage - addableUsers.length).fill(null));
    const [displayUsers, setDisplayUsers] = useState(users);
    const [allUsers, setAllUsers] = useState([])
    // for debugging
    const helpfulButton = () => {
        console.log("allUsers array: ", allUsers);
        console.log("filtered array: ", filteredUsers)
        console.log("users array: ",users)
    }

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
            console.log("called fetchAllUsers")
            const allFetchedUsers = await getAllUsers(token);
            setAllUsers(allFetchedUsers);

        } catch (error) {
            console.error(`Error fetching all users: ${error}`)
        }
    }
    const updateFilteredUsers =  () => {
        const types = ['developer', 'submitter'];
        console.log("users Array", users);
        console.log("allUsers Array", allUsers)
        const usersFilteredByType = allUsers.filter(user =>
            types.includes(user.role) && !users.some(existingUser => existingUser._id === user._id)
        );
        setFilteredUsers(usersFilteredByType)
        setEmptyRowsEditTable()
    }

    const updateAddableUsers = () => {
        const types = ['developer', 'submitter'];
        let usersToAdd= []
        for (const user of allUsers) {
            if (!users.some(viewableUser => viewableUser._id === user._id) && types.includes(user.role)) {
                usersToAdd.push(user)
            }
        }
        setAddableUsers(usersToAdd)
        console.log("addableUsers Updated!")
    }

    const updateEmptyRowsAddTable = () => {
        setEmptyRowsAddTable(Array(usersPerPage - addableUsers.length).fill(null))
    };

    const updateEmptyRowsEditTable = () => {
        setEmptyRowsAddTable(Array(usersPerPage - filteredUsers.length).fill(null))
    };


    const handleAdd = async () => {
        const additionPromises= Object.keys(selectedUsers).map(async selectedUserId=> {
            if (selectedUsers[selectedUserId]) {
                return addUserToProject(projectId, selectedUserId, token);
            }
        });
        await Promise.all(additionPromises);
        setSelectedUsers({});
        await fetchUsers();
        setViewMode('view');
        updateFilteredUsers()
    };

    const  handleRemove = async () => {
        const removalPromises = Object.keys(selectedUsers).map(async selectedUserId=> {
            if (selectedUsers[selectedUserId]) {
                return removeUserFromProject(projectId, selectedUserId, token);
            }
        });
            await Promise.all(removalPromises);
            setSelectedUsers({});
            await fetchUsers();
            await updateFilteredUsers();
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
            table = (
                <div>
                    <Table className="table-user-pv">
                        <thead>
                        <tr>
                            {columns.map((column) => <th scope="col" key={column}>{column}</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {initialUsers.map((user) => (
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
                        {emptyRowsEditTable.map((_, index) => (
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
                        {initialUsers.map((user) => (
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
                        {emptyRowsEditTable.map((_, index) => (
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

                        {emptyRowsAddTable.map((_, index) => (
                            <tr key={`empty-${index}`}>
                                {/*<td colSpan={columns.length + (isEditing ? 1 : 0)}>&nbsp;</td>*/}
                                <td colSpan={columns.length + (viewMode === "add" ? 1 : 0)}>&nbsp;</td>
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

                            {/*{viewMode === 'add' && <button onClick={handleAdd}>Add</button>}*/}
                            {viewMode === 'add' &&
                                <CoolButton
                                    label={"add"}
                                    handleRequest={handleAdd}
                                />}
                        </div>
                    </div>
            )
            break;

    }

    // useEffect(() => {
    //     console.log("useEffect 1 running UT")
    //     if (!isEditing) {
    //         setSelectedUsers({});
    //     }
    //     const fetchData = async () => {
    //         console.log("In fetch data")
    //         await fetchAllUsers();
    //     }
    //     setSelectedUsers({})
    //     fetchData();
    // }, [token]);

    useEffect(() => {
        console.log("useEffect 1 running UT")
        const fetchData = async () => {
            console.log("In fetch data")
            await fetchAllUsers();
        }
        setSelectedUsers({});
        fetchData();
    }, [token]);

    useEffect(() => { // New useEffect hook to watch allUsers
        updateFilteredUsers();
    }, [allUsers]);

    useEffect(() => {
        updateFilteredUsers(); // Called after the users state changes
    }, [users]);

    useEffect(() => {
        updateEmptyRowsAddTable();

    }, [addableUsers])

    useEffect(() => {
        updateAddableUsers();
        updateEmptyRowsEditTable()
    }, [filteredUsers]);

    // useEffect(() => {
    //     console.log("useEffect 3 running UT")
    //     console.log("FilteredUsers: ", filteredUsers)
    //
    // }, [filteredUsers])

    // useEffect(() => {
    //     console.log("useEffect 2 running UT")
    //     updateFilteredUsers();
    // }, [users])

    return (

        <div>
            {table}
            <button onClick={helpfulButton}>HELP</button>

        </div>
    );
}

export default UserTable;
