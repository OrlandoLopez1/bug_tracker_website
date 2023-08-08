import React, {useEffect, useState} from 'react';
import "./UserTable.css";
import {ChildComponent} from "../components/ChildComponent"
import {fetchUsersForProject} from "../controllers/ProjectController"
import {useParams} from "react-router-dom";
function parentComponentTest () {
    const [users, setUsers] =  useState([]);
    const projectId = useParams();
    const token = localStorage.getItem('accessToken');
    useEffect(() => {
        const fetchDate = async () => {
            console.log("Inside fetchData")
            try {
                const fetchedUsers = await fetchUsersForProject(projectId, token)
            }
            catch (error) {
               console.error("ParentComponentTest.js useEffect error: ", error)
            }
            fetchDate();
        }
    }, [token])

    return (
        <div>
            <h1>Parent Component</h1>
            <ChildComponent users={users}/>
        </div>

    )
}

export default parentComponentTest
