import {useEffect, useState} from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './SideMenu.css';

function SideMenu() {
    const [openDropdowns, setOpenDropdowns] = useState([]);
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    const buttons = [
        'Dashboard',
        'My Projects',
        {
            name: 'My Tickets',
            dropdown: [
                { name: 'View', path: '/ticketpage' },
                { name: 'Add', path: '/ticketform' },
                { name: 'Edit' }
            ]
        },
    ];

    async function getUserData(username) {
        const response = await fetch(`http://localhost:5000/user?username=${username}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
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
        const fetchData = async () => {
            const username = localStorage.getItem('username'); // Retrieve the username from localStorage
            if (username) { // Only attempt to fetch user data if the username is not null
                try {
                    const data = await getUserData(username); // Pass the username to getUserData()
                    setUserData(data);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <div className="sidenav">
            {userData && (
                <div className="profile-info">
                    <img src="/defaultpfp.jpg" alt="Profile1" className="profile-picture"/>
                    <h2>{userData.username}</h2>
                </div>
            )}
            {buttons.map((button, index) => (
                typeof button === 'string'
                    ? <Button className="w-100 text-start" key={button} onClick={() =>
                        navigate(`/${button.toLowerCase().replace(' ', '')}`)}>{button}</Button>
                    : (
                        <>
                            <Button
                                key={button.name}
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
                        </>
                    )
            ))}
        </div>
    );
}

export default SideMenu;
