export async function registerUser(userData) {
    const { firstName, lastName, username, email, password, role } = userData;

    const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstName,
            lastName,
            username,
            email,
            password,
            role
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}


export async function loginUser(email, password) {
    const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

export async function getUserInfo() {
    const response = await fetch("http://localhost:5000/auth/userinfo", {
        method: "GET",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}


export async function logoutUser() {
    const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // const data = await response.json();
    return null;
}
