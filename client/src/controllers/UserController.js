export async function fetchUser(userId, token) {
    const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}


export async function getAllUsers(token) {
    const response = await fetch('http://localhost:5000/users', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function getAllUsersOfRole(token, roles = []) {
    const roleQuery = roles.length > 0 ? `?roles=${roles.join(',')}` : '';
    const response = await fetch(`http://localhost:5000/users/roles${roleQuery}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}


// export async function getAllUsersOfRole(token, roles = [], page = 1, pageSize = 10) {
//     const roleQuery = roles.length > 0 ? `roles=${roles.join(',')}` : '';
//     const paginationQuery = `page=${page}&pageSize=${pageSize}`;
//     const queryString = [roleQuery, paginationQuery].filter(Boolean).join('&');
//
//     const response = await fetch(`http://localhost:5000/users/roles?${queryString}`, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     });
//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.json();
// }

export async function createNewUser(userData, token) {
    const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function updateUser(userData, token) {
    const response = await fetch('http://localhost:5000/users', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function deleteUser(userId, token) {
    const response = await fetch('http://localhost:5000/users', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: userId })
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function fetchUserProjects(userId, token) {
    const response = await fetch(`http://localhost:5000/users/${userId}/projects`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function fetchUserTickets(userId, token) {
    const response = await fetch(`http://localhost:5000/users/${userId}/tickets`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}
