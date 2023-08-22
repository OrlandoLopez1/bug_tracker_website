import React, {useState, useEffect} from 'react'
import CoolButton from "./CoolButton";
import {Pagination, Table} from 'react-bootstrap'
import {Link} from "react-router-dom";
import {getAllUsersOfRole} from "../controllers/UserController";
import {addUserToProject, fetchUsersForProject, removeUserFromProject} from "../controllers/ProjectController";

function CoolUserTable({tableType, token, projectId, viewMode, setViewMode}) {
    const [allDevsAndSubs, setAllDevsAndSubs] = useState([])
    const [projectDevsAndSubs, setProjectDevsAndSubs] = useState([])
    const [devsAndSubsNotInProject, setDevsAndSubsNotInProject] = useState([])
    const [selectedUsers, setSelectedUsers] = useState({});

    const fetchAllDevsAndSubs = async () => {
        try {
            const allFetchedUsers = await getAllUsersOfRole(token, ['developer', 'submitter'])
            setAllDevsAndSubs(allFetchedUsers)
        } catch (error) {
            console.error("error in fetchAllDevsAndSubs: ", error)
        }
    }

    const fetchDevsAndSubsFromProject = async () => {
        try {
            const fetchedUsers = await fetchUsersForProject(projectId, token)
            setProjectDevsAndSubs(fetchedUsers)
        } catch (error) {
            console.error("eror in fetchDevsAndSubsFromProject: ", error)
        }
    }

    const deriveDevsAndSubsNotInProject = () => {
        try {
            // assert
            allDevsAndSubs.forEach(user => {
                if (user.role !== 'developer' && user.role !== 'submitter') {
                    throw new Error(`User ${user.username} has an invalid role: ${user.role}`);
                }
            });

            const notInProject = allDevsAndSubs.filter(user =>
                !projectDevsAndSubs.some(projectUser => projectUser._id === user._id)
            );

            setDevsAndSubsNotInProject(notInProject);
        } catch (error) {
            console.error("Error in deriveDevsAndSubsNotInProject: ", error);
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
        await fetchDevsAndSubsFromProject();
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
        await fetchDevsAndSubsFromProject();
    };

    const handleCheckboxChange = (userId, isChecked) => {
        setSelectedUsers({...selectedUsers, [userId]: isChecked,});
    };



    let table
    const columnsConfig = {
        default: ['name', 'email', 'role'],
        project: ['name', 'email', 'role'],
        full: ['profilePicture', 'firstName', 'lastName', 'username', 'email', 'role', 'projects', 'tickets', 'skills']
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
                                {columns.includes('role') && <td>{user.role}</td>}
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
    // todo check if other use effect have to wait for this use effect to finish to go ahead, or if they still run
    useEffect(() => {
        fetchAllDevsAndSubs()
        fetchDevsAndSubsFromProject()
    }, [token])

    useEffect(() => {
        deriveDevsAndSubsNotInProject()
    },[projectDevsAndSubs])

    return (
        table
    )
}
export default CoolUserTable