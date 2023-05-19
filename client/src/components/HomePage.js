import React, { useState, useEffect } from 'react';
import SideMenu from "./SideMenu";
import CustomNavbar from "./CustomNavbar";

function HomePage() {
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const usernameFromStorage = localStorage.getItem('username');

        if (usernameFromStorage) {
            setUsername(usernameFromStorage);
        }
    }, []);

    return (
        <div>
            <CustomNavbar username={username} />

            <SideMenu />
            <div>
                <h1>Welcome to the Bug Tracker</h1>
                {/* More content... */}
            </div>
        </div>
    );
}

export default HomePage;
