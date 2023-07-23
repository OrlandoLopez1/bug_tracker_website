import './AttachmentSection.css';
import AddAttachment from './AddAttachment';
import { fetchPresignedUrl } from '../controllers/AttachmentController';
//todo pagination, delete functionality
function AttachmentSection({ curUserId, attachments, selectedFile, setSelectedFile, selectedFileName, setSelectedFileName, handleFileUpload, isLoading, token }) {

    const handleImageClick = async (event, filename) => {
        event.preventDefault(); // Prevent the browser from following the link

        try {
            const url = await fetchPresignedUrl(filename, token);
            // Open the image in a new browser tab
            window.open(url, '_blank');
        } catch (error) {
            console.error('Failed to display image:', error);
        }
    };

    return (
        <div className="attachments">
            {attachments && attachments.length > 0 ? (
                attachments.map(attachment => (
                    attachment ? (
                        <div key={attachment._id}>
                            <a href="#" onClick={(event) => handleImageClick(event, attachment.filename)} download>{attachment.filename}</a>
                        </div>
                    ) : null
                ))
            ) : (
                <p>No attachments</p>
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
