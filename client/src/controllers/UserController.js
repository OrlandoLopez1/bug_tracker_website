export async function fetchUserData(username) {
    const response = await fetch(`http://localhost:5000/user?username=${username}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}
