import './AddAttachment.css';
import { Form, Button } from 'react-bootstrap';
import React, {useState} from "react";

function AddAttachment({ selectedFile, setSelectedFile, selectedFileName, setSelectedFileName, handleFileUpload, isLoading, uploader }) {
    const [inputKey, setInputKey] = React.useState(Date.now()); // add this line
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        const attachment = {
            file,
            filename: file.name,
            uploader
        };
        setSelectedFile(attachment);
        setSelectedFileName(file.name);
    };

    const handleClick = async () => {
        const result = await handleFileUpload();
        if (result) {  // only reset the fields if the upload was successful
            setSelectedFile(null);
            setSelectedFileName('No file selected');
            setInputKey(Date.now());
        }
    }


    return (
        <>
            <Form.Group>
                <Form.Label>Attachment</Form.Label>
                <Form.Control
                    type="file"
                    accept=".jpg,.jpeg,.png,.doc,.pdf"
                    onChange={handleFileSelect}
                    key={inputKey}  // add this line
                />
            </Form.Group>

            <Button variant="primary" className='add-attachment-button text-right' onClick={handleClick} disabled={isLoading}>
                {isLoading ? 'Uploading...' : 'Upload'}
            </Button>
            <div style={{clear: 'both'}}></div>
        </>
    );
}

export default AddAttachment;
