import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import './TicketView.css'
import {useNavigate, useParams} from 'react-router-dom';
import Modal from 'react-modal';
import React, {useEffect, useState} from "react";
import {fetchAttachmentsForTicket, addAttachmentToTicket, getPresignedUrl} from "../controllers/AttachmentController";
import TicketTable from "./TicketTable";
import {
    attachFileToTicket,
    deleteTicket,
    fetchTicket,
    fetchTicketsForProject,
    updateTicket
} from "../controllers/TicketController";
import {fetchUser} from "../controllers/UserController";
import CommentSection from "./CommentSection";
import {fetchCommentsForTicket} from "../controllers/CommentController";
import AttachmentSection from "./AttachmentSection";
import jwtDecode from "jwt-decode";
import ProjectEditForm from "./ProjectEditForm";
import TicketEditForm from "./TicketEditForm";
Modal.setAppElement('#root');


function getPriorityColor(priority) {
    switch(priority) {
        case 'high':
            return '#FFD6C9';
        case 'medium':
            return '#FEFFD6';
        case 'low':
            return '#CAF2C2';
        default:
            return 'white';
    }
}
function TicketView() {
    const {ticketId} = useParams();
    const [ticket, setTicket] = useState([]);
    const [assignedUser, setAssignedUser] = useState(null);
    const [comments, setComments] = useState(null);
    const [editingTicketId, setEditingTicketId] = useState(null);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [curUserId, setCurUserId] = useState(null);
    const [curUser, setCurUser] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('No file selected');
    const [isLoading, setIsLoading] = useState(false);
    const [isEditingAttachments, setIsEditingAttachments] = useState(false);
    const [isEditingComments, setIsEditingComments] = useState(false);
    const [isEditingTicket, setIsEditingTicket] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [assignableUsers, setAssignableUsers] = useState([]);

    const handleEditTicketClick = () => {
        setIsEditingTicket(!isEditingTicket);
    };
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }

        const fetchData = async () => {
            try {
                const ticketData = await fetchTicket(ticketId, token);
                setTicket(ticketData);
                if (ticketData.assignedTo) {
                    const userData = await fetchUser(ticketData.assignedTo, token);
                    setAssignedUser(userData);
                }
                if (ticketData.comments) {
                    const commentData = await fetchCommentsForTicket(ticketData._id, token);
                    console.log("Fetched comments:", commentData);
                    setComments(commentData);
                }
                if (ticketData.attachments) {
                    const attachmentData = await fetchAttachmentsForTicket(ticketData._id, token);
                    console.log("Fetched attachments:", attachmentData);
                    setAttachments(attachmentData);
                }

                const decodedToken = jwtDecode(token);
                const curUserId = decodedToken.UserInfo.id;
                setCurUserId(curUserId);
                const fetchedUser = await fetchUser(curUserId, token)
                setCurUser(fetchedUser);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, [navigate, token]);

    useEffect(() => {
        // This will cause a re-render when 'isEditingAttachments' changes
    }, [isEditingAttachments, isEditingComments]);


    const handleFileUpload = async () => {
        setIsLoading(true);
        let uploadSuccessful = false;

        try {
            if (selectedFiles && selectedFiles.length > 0) {
                for (let i = 0; i < selectedFiles.length; i++) {
                    const selectedFile = selectedFiles[i];

                    // Get the presigned URL from the server immediately before uploading the file
                    const presignData = await getPresignedUrl(selectedFile.filename, selectedFile.file.type, token);
                    const presignedUrl = presignData.url;

                    const response = await fetch(presignedUrl, {
                        method: 'PUT',
                        body: selectedFile.file,
                        headers: {
                            'Content-Type': selectedFile.file.type
                        }
                    });

                    if (!response.ok) {
                        const errorResponse = await response.text();
                        console.error('Failed to upload file to S3:', errorResponse);
                        throw new Error('Failed to upload file to S3');
                    } else {
                        // If file upload was successful, the file location would be at the presigned URL (minus the query parameters)
                        const attachmentLocation = presignedUrl.split("?")[0];
                        const attachment = {
                            filename: selectedFile.filename,
                            path: attachmentLocation,
                            uploader: curUserId,
                            ticket: ticketId
                        };
                        await attachFileToTicket(ticketId, attachment, token);

                        // If the upload is successful, fetch the updated list of attachments
                        const attachmentData = await fetchAttachmentsForTicket(ticketId, token);
                        setAttachments(attachmentData);

                        uploadSuccessful = true;
                    }
                }
            }
        } catch (error) {
            console.error('Failed to upload file:', error);
        } finally {
            setSelectedFiles([]);
            setIsLoading(false);
        }

        return uploadSuccessful;
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const attachments = files.map(file => ({
            file,
            filename: file.name,
            uploader:  curUserId
        }));
        setSelectedFiles(attachments);
        // If you want to show the name of the first selected file or a summary
        setSelectedFileName(files.length > 1 ? `${files.length} files selected` : files[0].name);
    };


    const handleEditTicket = (ticket) => {
        setEditingTicketId(ticket._id);  // when Edit button is clicked, set this project as being edited
    };

    const handleDeleteTicket = (ticket) => {
        console.log("delete clicked", ticket);
        const confirmation = window.confirm(`Are you sure you want to delete Ticket: ${ticket.title}?`);

        if (!confirmation) {
            return;
        }

        try {
            deleteTicket(ticket._id, token);
            navigate(`/projectview/${ticket.project}`)
        } catch (err) {
            console.error("Failed to delete ticket:", err);
            alert("Failed to delete ticket");
        }
    }

    const handleUpdateTicket = async (updatedTicket) => {
        try {
            const response = await updateTicket(updatedTicket, token);
            setEditingTicketId(null);
        } catch (error) {
            console.error('Failed to update ticket:', error);
        }
    };
    const handleSave = async (updatedTicket) => {
        try {

            const updatedTicketData = await updateTicket(ticketId, updatedTicket, token);
            setTicket(updatedTicketData);
            setTitle(updatedTicketData.title);
            setDescription(updatedTicketData.description);
            setType(updatedTicketData.type);
            setStatus(updatedTicketData.status);
            setPriority(updatedTicketData.priority);

            if (updatedTicketData.users && Array.isArray(updatedTicketData.users)) {
                const usersData = updatedTicketData.users;
                setSelectedUsers(usersData);
                setCurrentTicket(currentTicket => ({ ...currentTicket, users: usersData }));
            }

            setIsEditingTicket(false);

        } catch (error) {
            console.error('Failed to update ticket:', error);
        }
    };


    if (loading) {
        return <p>Loading...</p>
    } else {
        return (
            <div>
                <CustomNavbar/>
                <div className="main-content-tv">
                    <SideMenu/>
                    <div className="outside-container-tv">
                        <div className="overlapping-title-view">
                            <div className="title-text">
                                {ticket.title}
                            </div>
                            <div className="title-desc-text">
                                Back | <button className="button-pv" onClick={handleEditTicketClick}>Edit</button>
                            </div>
                        </div>
                            <div className="ticket-details-top-container">
                                <div className='ticket-details-section'>
                                    <div className="ticket-details-left">
                                        <div>
                                            Assigned to: {assignedUser ?
                                            `${assignedUser.firstName} ${assignedUser.lastName}`  : 'N/A'}
                                        </div>
                                        <div>
                                            <div>Type: {ticket.type}</div>
                                            <div>Priority:&nbsp;
                                                <span
                                                    style={{
                                                        backgroundColor: getPriorityColor(ticket.priority),
                                                        padding: "2px",
                                                        borderRadius: "2px"
                                                    }}
                                                >{ticket.priority}</span>
                                            </div>
                                            <div>Status: {ticket.status}</div>
                                            <div>Created: {new Date(ticket.createdAt).toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="ticket-details-right">
                                        <div>
                                            <p>{ticket.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <div className="horizontal-container-tv">
                            <div className="common-parent1-tv">
                                <div className="overlapping-title-view">
                                    <div className="title-text">
                                        {"Attachments"}
                                    </div>
                                    <div className="title-desc-text">
                                        <button className="edit-button-tv" onClick={() => setIsEditingAttachments(!isEditingAttachments)}>Edit</button>
                                    </div>

                                </div>
                                <div className="content1-tv">
                                    <AttachmentSection
                                        curUserId={curUserId}
                                        attachments={attachments}
                                        setAttachments={setAttachments}
                                        ticketId={ticketId}
                                        selectedFiles={selectedFiles}
                                        setSelectedFiles={setSelectedFiles}
                                        selectedFileName={selectedFileName}
                                        setSelectedFileName={setSelectedFileName}
                                        handleFileUpload={handleFileUpload}
                                        isLoading={isLoading}
                                        token={token}
                                        isEditingAttachments={isEditingAttachments}
                                        setIsEditingAttachments={setIsEditingAttachments}
                                    />

                                </div>
                            </div>
                            <div className="common-parent2-tv">
                                <div className="overlapping-title-view">
                                    <div className="title-text">
                                        {"Comments"}
                                    </div>
                                    <div className="title-desc-text">
                                        <button className="edit-button" onClick={() => setIsEditingComments(!isEditingComments)}>Edit</button>
                                    </div>
                                </div>
                                <div className="content2-tv">
                                    <CommentSection
                                        curUserObject={curUser}
                                        isEditingComments={isEditingComments}
                                        setIsEditingComments={setIsEditingComments}
                                    ></CommentSection>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    isOpen={isEditingTicket === true}
                    onRequestClose={() => setIsEditingTicket(false)}
                    contentLabel="Edit Ticket"
                    className="custom-modal-project-edit"
                >
                    <TicketEditForm
                        ticketId={ticketId}
                        title={ticket.title}
                        setTitle={setTitle}
                        description={ticket.description}
                        setDescription={setDescription}
                        type={ticket.type}
                        setType={setType}
                        status={ticket.status}
                        setStatus={setStatus}
                        priority={ticket.priority}
                        setPriority={setPriority}
                        selectedUsers={ticket.users}
                        setSelectedUsers={setSelectedUsers}
                        assignableUsers={assignableUsers}
                        handleSave={handleSave}
                        setIsEditing={setIsEditingTicket}
                        // toggleFormVisibility={() => setIsEditingTicket(!isEditingTicket)}
                    />
                </Modal>
            </div>
        )
    }
}
export default TicketView;
