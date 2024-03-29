export async function fetchTicket(ticketId, token) {
    const response = await fetch(`http://localhost:5000/tickets/${ticketId}`, {
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


export async function updateTicket(ticketId, ticket, token) {
    const response = await fetch(`http://localhost:5000/tickets/${ticketId}`, {
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

export async function deleteTicket(ticketId, token) {
    const response = await fetch(`http://localhost:5000/tickets/${ticketId}`, {
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


export async function attachFileToTicket(ticketId, attachment, token) {
    const response = await fetch(`http://localhost:5000/tickets/${ticketId}/attachment`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attachment })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}


export async function addCommentToTicket(uploaderId, comment, ticketId, token) {
    const commentObj = {
        uploader: uploaderId.curUserId,  // Extract the string ObjectId from the object
        content: comment,
        ticket: ticketId,
    };


    const response = await fetch(`http://localhost:5000/tickets/${ticketId}/comment`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({comment: commentObj}) // send the comment object, not just the text
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}



// export async function fetchTicketsForProject(projectId, token) {
//     const response = await fetch(`http://localhost:5000/tickets/project/${projectId}`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//         },
//     });
//
//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }
//
//     return await response.json();
// }


