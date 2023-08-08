import React, {useEffect, useState} from 'react';
import {Button} from 'react-bootstrap';
import {fetchUsersForProject, removeUserFromProject} from "../controllers/ProjectController";
function ChildComponent({users, projectId, token}){
    const [selectedUsers, setSelectedUsers] = useState([])
    const [currentUsers, setCurrentUsers] = useState(users);
    const handleCheckboxChange = (userId, isChecked) => {
        setSelectedUsers({...selectedUsers, [userId]: isChecked,});
        console.log(`Selected user: ${userId} was ${isChecked ? "checked" : "unchecked"}`)
    };

    const fetchData = async () => {
        try {
            const fetchedUsers = await fetchUsersForProject(projectId, token);
            setCurrentUsers(fetchedUsers);
        }
        catch (error) {
            console.error("ParentComponentTest.js useEffect error: ", error);
        }
    }

    const  handleRemove = () => {
        for (let selectedUserId in selectedUsers) {
            console.log(selectedUserId);
            removeUserFromProject(projectId, selectedUserId, token);

        }
        setSelectedUsers({});
    };

   useEffect(() => {
       console.log("calling useEffect in ChildComponet");
       fetchData();
   },[currentUsers, token])

    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>checkbox</th>
                    <th>name</th>
                </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <th>
                                <input type="checkbox" checked={!!selectedUsers[user._id]} onChange={(e) => handleCheckboxChange(user._id, e.target.checked)} />
                            </th>
                            <th key={index}>
                                {user.firstName}
                            </th>
                        </tr>
                    ))}
                </tbody>

            </table>
            <Button onClick={handleRemove}>Remove</Button>
        </div>
    )
}

export default ChildComponent;