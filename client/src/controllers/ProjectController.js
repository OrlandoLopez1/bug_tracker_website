export async function fetchProject(projectId, token) {
    const response = await fetch(`http://localhost:5000/projects/${projectId}`, {
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

export async function fetchProjects(token) {
    const response = await fetch("http://localhost:5000/projects", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

}


export async function addProject(project, token) {
    const response = await fetch("http://localhost:5000/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(project),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function updateProject(project, token) {
    const response = await fetch(`http://localhost:5000/projects/${project._id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(project),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function deleteProject(projectId, token) {
    const response = await fetch(`http://localhost:5000/projects/${projectId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function fetchUsersForProject(projectId, token) {
    const response = await fetch(`http://localhost:5000/projects/${projectId}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}


export async function fetchPageOfUsersForProject(projectId, token, page = 1, pageSize = 10) {
    const response = await fetch(`http://localhost:5000/projects/${projectId}/pageOfUsers?page=${page}&pageSize=${pageSize}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}


export async function fetchPageOfTicketsForProject(projectId, token, page = 1, pageSize = 10) {
    const response = await fetch(`http://localhost:5000/projects/${projectId}/pageOfTickets?page=${page}&pageSize=${pageSize}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function fetchPageOfUsersNotInProject(projectId, token, page = 1, pageSize = 10) {
    const response = await fetch(`http://localhost:5000/projects/${projectId}/pageOfUsersNotInProject?page=${page}&pageSize=${pageSize}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function fetchTicketsForProject(projectId, token) {
    const response = await fetch(`http://localhost:5000/projects/${projectId}/tickets   `, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}


export async function addTicketToProject(projectId, ticketId, token) {
    const response = await fetch(`http://localhost:5000/projects/${projectId}/tickets/${ticketId}`, {
        method: "POST",
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

export async function removeUserFromProject(projectId, userId, token) {
    const response = await fetch(`http://localhost:5000/projects/${projectId}/users/${userId}`, {
        method: "PATCH",
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

export async function addUserToProject(projectId, userId, token) {
    const response = await fetch(`http://localhost:5000/projects/${projectId}/users/${userId}`, {
        method: "POST",
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


export async function removeTicketFromProject(projectId, ticketId, token) {
    const response = await fetch(`http://localhost:5000/projects/${projectId}/tickets/${ticketId}`, {
        method: "DELETE",
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
