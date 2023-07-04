import React from 'react';
import "./UserTable.css";
export function UserTable({users}) {
    return (
        <table className="table">
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
        </table>
    );
}

export function ProjectViewUserTable({users}) {
    console.log(users);
    return (
        <table className="table">
            <thead>
            <tr>
                <th scope="col"></th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user._id}>
                    <td>
                        <img src={"/defaultpfp.jpg"} alt="user" className="table-profile-pic"/>
                    </td>
                    <td>
                        {user.firstName} {user.lastName}
                        <span className="table-username">{" (" + user.username + ")"}</span>

                    </td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                </tr>
            ))}

            </tbody>
        </table>
    );
}

export default ProjectViewUserTable;
