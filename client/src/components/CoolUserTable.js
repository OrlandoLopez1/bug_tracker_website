import React, {useState, useEffect} from 'react'
import CoolButton from "./CoolButton";
import {Pagination, Table} from 'react-bootstrap'
import {Link} from "react-router-dom";
import {getAllUsersOfRole} from "../controllers/UserController";
import "./CoolUserTable.css";
import "./UserTable.css";
import {
    addUserToProject,
    fetchPageOfUsersForProject, fetchPageOfUsersNotInProject,
    fetchUsersForProject,
    removeUserFromProject
} from "../controllers/ProjectController";

function CoolUserTable({tableType, token, projectId, viewMode, setViewMode}) {
    const [projectDevsAndSubs, setProjectDevsAndSubs] = useState([])
    const [devsAndSubsNotInProject, setDevsAndSubsNotInProject] = useState([])
    const [selectedUsers, setSelectedUsers] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0); // Update this value based on the data from the API
    const [inputPage, setInputPage] = useState('1'); // Add state for the input page
    const fetchUsersInProject = async () => {
        try {
            const { users, totalPages } = await fetchPageOfUsersForProject(projectId, token, currentPage, pageSize);
            if (totalPages === currentPage) {
                let usersAndEmptyRows = [...users]
                const numEmptyRows = pageSize - users.length
                for (let i = 0; i < numEmptyRows; i++){
                    usersAndEmptyRows.push({})
                }
                setProjectDevsAndSubs(usersAndEmptyRows);
            } else {
                setProjectDevsAndSubs(users);
            }
            setTotalPages(totalPages);
        } catch (error) {
            console.error("error in fetchDevsAndSubsFromProject: ", error);
        }
    };

    const fetchUsersNotInProject = async () => {
        try {
            const { users, totalPages } = await fetchPageOfUsersNotInProject(projectId, token, currentPage, pageSize); // Assuming the function name
            setDevsAndSubsNotInProject(users);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("error in fetchDevsAndSubsNotFromProject: ", error);
        }
    };

    const handleAdd = async () => {
        const additionPromises= Object.keys(selectedUsers).map(async selectedUserId=> {
            if (selectedUsers[selectedUserId]) {
                return addUserToProject(projectId, selectedUserId, token);
            }
        });
        await Promise.all(additionPromises);
        setSelectedUsers({});
        setViewMode('view');
    };


    const handleRemove = async () => {
        const removalPromises = Object.keys(selectedUsers).map(async selectedUserId=> {
            if (selectedUsers[selectedUserId]) {
                return removeUserFromProject(projectId, selectedUserId, token);
            }
        });
        await Promise.all(removalPromises);
        setSelectedUsers({});
    };

    const handleCheckboxChange = (userId, isChecked) => {
        setSelectedUsers({...selectedUsers, [userId]: isChecked,});
    };



    let table
    const columnsConfig = {
        default: ['Name', 'Email', 'Role'],
        project: ['Name', 'Email', 'Role'],
        full: ['ProfilePicture', 'FirstName', 'LastName', 'Username', 'Email', 'Role', 'Projects', 'Tickets', 'Skills']
    };

    const columns = columnsConfig[tableType] || columnsConfig.default;

    switch (viewMode) {
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
                        {projectDevsAndSubs.map((user) => (
                            <tr key={user._id}>
                                {columns.includes('profilePicture') &&
                                    <td><img src="/defaultpfp.jpg" alt="Profile1" className="profile-picture-edit-ut"/>
                                    </td>}
                                {columns.includes('FirstName') && <td>{user.firstName }</td>}
                                {columns.includes('LastName') && <td>{user.lastName}</td>}
                                {columns.includes('Name') && <td>
                                    <Link
                                        className="user-link"
                                        to={`/userview/${user._id}`}>{user.firstName} {user.lastName}
                                    </Link>

                                </td>}
                                {columns.includes('Username') && <td>{user.username}</td>}
                                {columns.includes('Email') && <td>{user.email}</td>}
                                {columns.includes('Role') &&
                                    <td>
                                        <span
                                            style={{
                                                padding: "5px",
                                                borderRadius: "5px",
                                            }}>
                                            {user.role}
                                        </span>
                                    </td>}
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
                    <Table className="table-user-edit-pv">
                        <thead>
                        <tr>
                            <th></th>
                            {columns.map((column) => <th scope="col" key={column}>{column}</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {projectDevsAndSubs.map((user) => (
                            <tr key={user._id}>
                                <td>
                                    <input type="checkbox" checked={!!selectedUsers[user._id]}
                                           onChange={(e) => handleCheckboxChange(user._id, e.target.checked)}/></td>
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
                                {columns.includes('role') &&
                                    <td>
                                        <span
                                            style={{
                                                padding: "5px",
                                                borderRadius: "5px",
                                            }}>
                                            {user.role}
                                        </span>
                                    </td>}
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
                        {devsAndSubsNotInProject.map((user) => (
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
                        </tbody>
                    </Table>
                    {viewMode === 'add' &&
                        <CoolButton
                            label={"add"}
                            handleRequest={handleAdd}
                        />}
                </div>
            )


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
        setInputPage(currentPage); // Update inputPage when currentPage changes
    }, [currentPage]);

    useEffect(() => {
        fetchUsersInProject()
    }, [token])

    useEffect(() => {
        console.log("Project Users: ", projectDevsAndSubs)
    }, [projectDevsAndSubs])

    useEffect(() => {
        console.log("None Project Users: ", projectDevsAndSubs)
    }, [devsAndSubsNotInProject])

    useEffect(() => {
        if (viewMode === 'view' || viewMode === 'edit') {
            fetchUsersInProject();
        } else if (viewMode === 'add') {
            fetchUsersNotInProject()
        }
    }, [token, currentPage, pageSize, viewMode]);

    return (
        <div>
            {table}
            {paginationComponent}
        </div>
    )
}
export default CoolUserTable