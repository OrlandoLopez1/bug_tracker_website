import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { fetchUsersForProject, removeUserFromProject } from "../controllers/ProjectController";
function ChildComponent({ users, setUsers, projectId, token }) {
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleCheckboxChange = (userId, isChecked) => {
        setSelectedUsers(prevState => ({ ...prevState, [userId]: isChecked }));
        console.log(`Selected user: ${userId} was ${isChecked ? "checked" : "unchecked"}`);
    };

    const handleRemove = async () => {
        const removalPromises = Object.keys(selectedUsers).map(async selectedUserId => {
            if (selectedUsers[selectedUserId]) {
                console.log(selectedUserId);
                return removeUserFromProject(projectId, selectedUserId, token);
            }
        });

        await Promise.all(removalPromises);
        console.log("removalPromises");
        console.log(removalPromises);
        setSelectedUsers({});
        // fetchData();
    };

    const fetchUsers = async () => {
        try {
            const fetchedUsers = await fetchUsersForProject(projectId, token);
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("ChildComponent.js fetchData error: ", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token, projectId]);

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>Checkbox</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user._id}>
                        <td>
                            <input type="checkbox" checked={!!selectedUsers[user._id]} onChange={(e) => handleCheckboxChange(user._id, e.target.checked)} />
                        </td>
                        <td>
                            {user.firstName}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Button onClick={handleRemove}>Remove</Button>
        </div>
    );
}

export default ChildComponent;
