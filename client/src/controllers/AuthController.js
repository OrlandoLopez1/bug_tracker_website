// Register User
export async function registerUser(username, email, password) {
    const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        credentials: 'include', // Include credentials to handle cookies
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            email,
            password
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

// Login User
export async function loginUser(email, password) {
    const response = await fetch("http://localhost:5000/auth", {
        method: "POST",
        credentials: 'include', // Include credentials to handle cookies
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