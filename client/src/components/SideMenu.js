import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { fetchUserData, getAllUsers } from '../controllers/UserController';
import './SideMenu.css';

function SideMenu() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);
    const [role, setRole] = useState(null);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                const decodedToken = jwtDecode(token);
                const username = decodedToken.UserInfo.username;
                const role = decodedToken.UserInfo.role;
                setUserName({ username });

                switch (role) {
                    case 'admin':
                        setRole('Admin');
                        break;
                    case 'projectmanager':
                        setRole('Project Manager');
                        break;
                    case 'developer':
                        setRole('Developer');
                        break;
                    case 'submitter':
                        setRole('Submitter');
                        break;
                    default:
                        setRole('Role: ???');
                        break;
                }
            }
        };

        fetchData();
    }, [token]);

    return (
        <div className="sidenav">
            {userName && (
                <div className="profile-info">
                    <img src="/defaultpfp.jpg" alt="Profile1" className="profile-picture" />
                    <h2 className="username-style">{userName.username}</h2>
                    <h3 className="role-style">{role}</h3>
                </div>
            )}
            {/*<Button className="w-100 text-start" onClick={() => navigate("/dashboard")}>Dashboard</Button>*/}
            <Button className="w-100 text-start" onClick={() => navigate("/projectPage")}>My Projects</Button>
            <Button className="w-100 text-start" onClick={() => navigate("/ticketPage")}>My Tickets</Button>
        </div>
    );
}

export default SideMenu;
