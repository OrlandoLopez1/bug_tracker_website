// controllers/AttachmentController.js
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


export async function getPresignedUrl(filename, filetype, token) {
    const response = await fetch(`http://localhost:5000/attachments/presign?filename=${encodeURIComponent(filename)}&filetype=${encodeURIComponent(filetype)}`, {
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


export const fetchPresignedUrl = async (filename, token) => {
    console.log(token)
    const response = await fetch(`http://localhost:5000/attachments/presign-get?filename=${filename}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // Output the HTTP status code and the raw response text
    const responseText = await response.text();

    if (!response.ok) {
        throw new Error('Failed to fetch presigned URL');
    }

    // Parse the response text as JSON
    const presignData = JSON.parse(responseText);
    return presignData.url  ;
};


export async function deleteAttachment(attachmentId, token) {
    const response = await fetch(`http://localhost:5000/attachments/${attachmentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

