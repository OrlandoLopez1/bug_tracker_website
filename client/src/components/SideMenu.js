import { useState } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './SideMenu.css';

function SideMenu() {
    const [openDropdowns, setOpenDropdowns] = useState([]);
    const navigate = useNavigate();

    const buttons = [
        'Dashboard',
        'My Projects',
        { name: 'My Tickets', dropdown: ['Ticket 1', 'Ticket 2'] },
        'Another Button',
        'One More Button'
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

    return (
        <div className="sidenav">
            {buttons.map((button, index) => (
                typeof button === 'string'
                    ? <Button className="w-100 text-start" key={button} onClick={() => navigate(`/${button.toLowerCase().replace(' ', '')}`)}>{button}</Button>
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
                                        <Button key={subitem} className={`w-100 text-start sub-item ${openDropdowns[index] ? 'active-dropdown-item' : ''}`}>{subitem}</Button>
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
