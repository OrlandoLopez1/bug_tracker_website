import './AddAttachment.css';
import { Form, Button } from 'react-bootstrap';
//todo delete this and figure out what my own code fucking does
function AddAttachment({ selectedFile, setSelectedFile, selectedFileName, setSelectedFileName, handleFileUpload, isLoading, uploader }) {
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

    return (
        <>
            <Form.Group>
                <Form.Label>Attachment</Form.Label>
                <Form.Control
                    type="file"
                    accept=".jpg,.jpeg,.png,.doc,.pdf"
                    onChange={handleFileSelect}
                />
                <Form.Text>
                    {selectedFileName}
                </Form.Text>
            </Form.Group>

            <Button variant="primary" onClick={handleFileUpload} disabled={isLoading}>
                {isLoading ? 'Uploading...' : 'Upload'}
            </Button>
        </>
    );
}

export default AddAttachment;
