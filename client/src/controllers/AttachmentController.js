// controllers/AttachmentController.js
export async function addAttachmentToTicket(attachment, token) {
    const response = await fetch('http://localhost:5000/attachments', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(attachment)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function fetchAttachmentsForTicket(ticketId, token) {
    const response = await fetch(`http://localhost:5000/attachments/ticket/${ticketId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',

        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}
