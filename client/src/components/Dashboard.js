import React, { useState, useEffect } from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './Dashboard.css';
import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import { useNavigate } from 'react-router-dom';
Chart.register(...registerables);

//todo check if there is a way to modify the charts so that the label is next to the arch
//todo add the user chart
//todo fetch actual data
function Dashboard() {
    const doughnutData = {
        labels: ['Bugs', 'Features', 'Improvements'],
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
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    useEffect(() => {
        const usernameFromStorage = localStorage.getItem('username');

        if (usernameFromStorage) {
            setUsername(usernameFromStorage);
        }
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);
    return (
        <div>
            <CustomNavbar username={username} />
            <div className="main-content">
                <SideMenu />
                <div className="dashboard">
                    <div className="dashboard-item">
                        <Doughnut data={doughnutData} />
                    </div>
                    <div className="dashboard-item">
                        <Line data={lineData} />
                    </div>
                    <div className="dashboard-item">
                        <Bar data={barData} options={barOptions} />
                    </div>
                    <div className="dashboard-item">
                        <h2 className="large-number">500</h2>
                        <p className="large-number-subtext">Open Tickets</p>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Dashboard;
