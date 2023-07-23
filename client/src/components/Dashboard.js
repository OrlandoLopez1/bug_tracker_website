import React, { useState, useEffect } from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './Dashboard.css';
import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import UserTable from './UserTable';
import { useNavigate } from 'react-router-dom';
import {getAllUsers} from "../controllers/UserController";
Chart.register(...registerables);

//todo check if there is a way to modify the charts so that the label is next to the arch
//todo fetch actual data
function Dashboard() {
    const doughnutData = {
        labels: ['Low', 'Medium', 'High'],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }
        ]
    };

    const lineData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Bugs',
                data: [65, 59, 80, 81, 56, 55],
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)'
            },
            {
                label: 'Features',
                data: [28, 48, 40, 19, 86, 27],
                fill: false,
                backgroundColor: 'rgba(255,99,132,0.4)',
                borderColor: 'rgba(255,99,132,1)'
            }
        ]
    };

    const barData = {
        labels: ['Bugs', 'Features', 'Improvements'],
        datasets: [
            {
                label: 'Status',
                data: [65, 59, 80],
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1
            }
        ]
    };

    const barOptions = {
        indexAxis: 'y',
    };

    const [username, setUsername] = useState(null);
    const [users, setUsers] = useState(null);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
        const fetchUsers = async () => {
            try {
                const userData = await getAllUsers(token);
                setUsers(userData);
            }
            catch (error){
                console.error('Failed to fetch Users:', error);
            }
        }

        fetchUsers();

    }, [navigate, token]);
    return (
        <div>
            <CustomNavbar username={username} />
            <div className="main-content">
                <SideMenu />

                <div className="dashboard">
                    <div className="row row1">
                        <div className="dashboard-item1">
                            <h2 className="large-number">500</h2>
                            <p className="large-number-subtext">Tickets open</p>
                        </div>
                        <div className="dashboard-item1">
                            <h2 className="large-number">127</h2>
                            <p className="large-number-subtext">In progress</p>
                        </div>
                        <div className="dashboard-item chart-container">
                            <Line data={lineData} />
                        </div>

                    </div>
                    <div className="row row2">

                        <div className="dashboard-item chart-container2">
                            <Doughnut data={doughnutData} />
                        </div>
                        <div className="dashboard-item chart-container2">
                            <Bar data={barData} options={barOptions} />
                        </div>

                    </div>
                    <div className="row row3">
                        <div className="dashboard-item">
                            {users && <UserTable users={users}></UserTable>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Dashboard;
