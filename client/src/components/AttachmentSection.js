import './AttachmentSection.css';
import AddAttachment from './AddAttachment';
import {deleteAttachment, fetchAttachmentsForTicket, fetchPresignedUrl} from '../controllers/AttachmentController';
import {useState} from "react";
//todo pagination, delete functionality
function AttachmentSection({ curUserId, attachments, setAttachments, ticketId, selectedFile, setSelectedFile, selectedFileName, setSelectedFileName, handleFileUpload, isLoading, token, isEditingAttachments, setIsEditingAttachments }) {


    const [selectedAttachments, setSelectedAttachments] = useState([]);

    const handleSelectAll = () => {
        if (selectedAttachments.length === attachments.length) {
            // Deselect all
            setSelectedAttachments([]);
        } else {
            // Select all
            setSelectedAttachments(attachments.map(attachment => attachment._id));
        }
    };


    const handleAttachmentClick = async (attachment) => {
        if (isEditingAttachments) {
            // In edit mode, clicking an attachment toggles its selection
            if (selectedAttachments.includes(attachment._id)) {
                setSelectedAttachments(selectedAttachments.filter(id => id !== attachment._id));
            } else {
                setSelectedAttachments([...selectedAttachments, attachment._id]);
            }
        } else {
            // Not in edit mode, clicking an attachment attempts to display it
            await handleImageClick(attachment.filename);
        }
    };

    const handleImageClick = async (filename) => {
        try {
            const url = await fetchPresignedUrl(filename, token);
            // Open the image in a new browser tab
            window.open(url, '_blank');
        } catch (error) {
            console.error('Failed to display image:', error);
        }
    };


    const handleDeleteSelected = async () => {
        for (let id of selectedAttachments) {
            try {
                await deleteAttachment(id, token);
            } catch (error) {
                console.error(`Failed to delete attachment with id ${id}:`, error);
            }
        }

        // Refresh the attachments list
        const attachmentData = await fetchAttachmentsForTicket(ticketId, token);
        setAttachments(attachmentData);

        // Clear the selection
        setSelectedAttachments([]);
    };


    const handleCheckboxClick = (event, attachment) => {
        event.stopPropagation();
        if (selectedAttachments.includes(attachment._id)) {
            setSelectedAttachments(selectedAttachments.filter(id => id !== attachment._id));
        } else {
            setSelectedAttachments([...selectedAttachments, attachment._id]);
        }
    };

    return (

        <div className="attachments">

            {attachments && attachments.length > 0 ? (
                attachments.map(attachment => (
                    attachment ? (
                        <div className='attachment-and-checkbox' key={attachment._id}>
                            {isEditingAttachments &&
                                <input
                                    type="checkbox"
                                    checked={selectedAttachments.includes(attachment._id)}
                                    onClick={(event) => handleCheckboxClick(event, attachment)}
                                />
                            }
                            <a
                                href="#"
                                onClick={(event) => {
                                    handleAttachmentClick(attachment);
                                }}
                                className={isEditingAttachments && selectedAttachments.includes(attachment._id) ? 'selected' : ''}
                            >
                                {attachment.filename}
                            </a>
                        </div>
                    ) : null
                ))
            ) : (
                <p>No attachments</p>
            )}


            {isEditingAttachments && (
                <>
                    <div className="delete-attachment-buttons">
                        <button onClick={handleSelectAll}>
                            Select All
                        </button>
                        <button
                            onClick={handleDeleteSelected}
                            disabled={selectedAttachments.length === 0}
                        >
                            Delete Selected
                        </button>

                    </div>
                </>
            )}

            <AddAttachment
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                selectedFileName={selectedFileName}
                setSelectedFileName={setSelectedFileName}
                handleFileUpload={handleFileUpload}
                isLoading={isLoading}
                uploader={curUserId}
            />
        </div>
    );
}
    export default AttachmentSection;
