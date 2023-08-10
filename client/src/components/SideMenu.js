import {useEffect, useState} from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import {fetchUserData, getAllUsers} from '../controllers/UserController';
import './SideMenu.css';
//todo fix issue where side menu is changing size
function SideMenu() {
    const [openDropdowns, setOpenDropdowns] = useState([]);
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);
    const [role, setRole] = useState(null);
    const token = localStorage.getItem('accessToken');


    const buttons = [
        'Dashboard',
        {
            name: 'My Projects',
            dropdown: [
                { name: 'View', path: '/projectpage' },
                { name: 'Add', path: '/projectform' },
                { name: 'Edit', path: '/projectview' }
            ]
        },
        {
            name: 'My Tickets',
            dropdown: [
                { name: 'View', path: '/ticketpage' },
                { name: 'Add', path: '/ticketform' },
                { name: 'Edit' }
            ]
        },
    ];

    const toggleDropdown = (index) => {
        setOpenDropdowns(prev => {
            const newOpenDropdowns = [...prev];
            newOpenDropdowns[index] = !newOpenDropdowns[index];
            return newOpenDropdowns;
        });
    };

    const closeDropdown = (index) => {
        setOpenDropdowns(prev => {
            const newOpenDropdowns = [...prev];
            newOpenDropdowns[index] = false;
            return newOpenDropdowns;
        });
    };


    useEffect(() => {
        // console.log("useEffect side menu 1")
        const fetchData = async () => {
            if (token) {
                const decodedToken = jwtDecode(token);

                const username = decodedToken.UserInfo.username;
                const role = decodedToken.UserInfo.role;
                setUserName({username});

                switch (role){
                    case "admin":
                        setRole("Admin");
                        break;
                    case "projectmanager":
                        setRole("Project Manager");
                        break;
                    case "developer":
                        setRole("Developer");
                        break;
                    case "submitter":
                        setRole("Submitter");
                        break;
                    default:
                        setRole("Role: ???");
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
                    <img src="/defaultpfp.jpg" alt="Profile1" className="profile-picture"/>
                    <h2 className="username-style">{userName.username}</h2>
                    <h3 className="role-style">{role}</h3>
                </div>
            )}
            {buttons.map((button, index) => (
                typeof button === 'string'
                    ? <Button className="w-100 text-start" key={button} onClick={() => navigate(`/${button.toLowerCase().replace(' ', '')}`)}>{button}</Button>
                    : (
                        <div key={button.name}> {/* Wrap the components with a div and provide the key here */}
                            <Button
                                onClick={() => toggleDropdown(index)}
                                onBlur={() => closeDropdown(index)}
                                aria-controls={`dropdown-${index}`}
                                aria-expanded={openDropdowns[index]}
                                className={`w-100 text-start ${openDropdowns[index] ? 'open' : ''}`}
                            >
                                {button.name} &#9660;
                            </Button>
                            <Collapse in={openDropdowns[index]} timeout={200}>
                                <div id={`dropdown-${index}`} className="mb-1">
                                    {button.dropdown.map(subitem => (
                                        <Button
                                            key={subitem.name}
                                            className={`w-100 sub-item-button ${openDropdowns[index] ? 'active-dropdown-item' : ''}`}
                                            onClick={() => subitem.path && navigate(subitem.path)}
                                        >
                                            {subitem.name}
                                        </Button>
                                    ))}
                                </div>
                            </Collapse>
                        </div>
                    )
            ))}

        </div>
    );
}

export default SideMenu;
