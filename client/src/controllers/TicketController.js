export async function fetchTickets() {
    const token = localStorage.getItem('token');
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

export async function createTicket(ticket) {

    const response = await fetch('http://localhost:5000/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ticket)
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
