import './AttachmentSection.css'
import AddAttachment from './AddAttachment';
//todo on submit reset file selection
function AttachmentSection({ curUserId, attachments, selectedFile, setSelectedFile, selectedFileName, setSelectedFileName, handleFileUpload, isLoading }) {
    return (
        <div className="attachments">
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
