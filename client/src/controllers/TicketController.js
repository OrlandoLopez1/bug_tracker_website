export async function fetchTicket(id, token) {
    const response = await fetch(`http://localhost:5000/tickets/${id}`, {
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


export async function fetchTickets(token) {
    const response = await fetch('http://localhost:5000/tickets', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export async function createTicket(ticket, token) {
    const response = await fetch('http://localhost:5000/tickets', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticket)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}


export async function updateTicket(id, ticket, token) {
    const response = await fetch(`http://localhost:5000/tickets/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticket)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function deleteTicket(id, token) {
    const response = await fetch(`http://localhost:5000/tickets/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}


export async function attachFileToTicket(id, fileUrl, token) {
    const response = await fetch(`http://localhost:5000/tickets/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attachment: fileUrl })  // assuming your API expects a field named "attachment"
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}



export async function fetchTicketsForProject(projectId, token) {
    const response = await fetch(`http://localhost:5000/tickets/project/${projectId}`, {
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


