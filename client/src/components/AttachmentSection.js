import './AttachmentSection.css'
import AddAttachment from './AddAttachment';

function AttachmentSection({ curUserId, attachments, selectedFile, setSelectedFile, selectedFileName, setSelectedFileName, handleFileUpload, isLoading }) {
    return (
        <div className="attachments">
            <h2>Attachments</h2>
            {console.log("attachemts")}
            {console.log(attachments)}
            {attachments && attachments.length > 0 ? (
                attachments.map(attachment => (
                    attachment ? (
                        <div key={attachment._id}>
                            <a href={attachment.path} download>{attachment.filename}</a>
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
