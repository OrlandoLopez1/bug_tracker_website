import React, { useState, useEffect } from 'react';
import "./UserTable.css";
import ChildComponent from "../components/ChildComponent";
import { fetchUsersForProject } from "../controllers/ProjectController";
import { useParams } from "react-router-dom";

function ParentComponentTest() {
    const [users, setUsers] = useState([]);
    const { projectId } = useParams();
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedUsers = await fetchUsersForProject(projectId, token);
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("ParentComponentTest.js fetchData error: ", error);
            }
        }

        fetchData();
    }, [projectId, token]);

    return (
        <div>
            <h1>Parent Component</h1>
            <ChildComponent users={users} setUsers={setUsers} token={token} projectId={projectId} />
        </div>
    );
}

export default ParentComponentTest;
