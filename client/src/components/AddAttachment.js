import './AddAttachment.css';
import { Form, Button } from 'react-bootstrap';
import React, { useState } from "react";

function AddAttachment({ selectedFiles, setSelectedFiles, handleFileUpload, isLoading, uploader }) {
    const [inputKey, setInputKey] = useState(Date.now());

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const attachments = files.map(file => ({
            file,
            filename: file.name,
            uploader
        }));
        setSelectedFiles(attachments);
    };

    const handleClick = async () => {
        const result = await handleFileUpload();
        if (result) {
            setSelectedFiles([]);
            setInputKey(Date.now());
        }
    }

    return (
        <>
            <Form.Group>
                <Form.Label>Attachments</Form.Label>
                <Form.Control
                    type="file"
                    accept=".jpg,.jpeg,.png,.doc,.pdf"
                    onChange={handleFileSelect}
                    key={inputKey}
                    multiple
                />
            </Form.Group>

            <Button variant="primary" className='add-attachment-button text-right' onClick={handleClick} disabled={isLoading}>
                {isLoading ? 'Uploading...' : 'Upload'}
            </Button>
            <div style={{ clear: 'both' }}></div>
        </>
    );
}

export default AddAttachment;
