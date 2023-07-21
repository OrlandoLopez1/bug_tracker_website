import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import './TicketView.css'
import {useNavigate, useParams} from 'react-router-dom';
import Modal from 'react-modal';
import React, {useEffect, useState} from "react";
import TicketTable from "./TicketTable";
import {
    attachFileToTicket,
    deleteTicket,
    fetchTicket,
    fetchTicketsForProject,
    updateTicket
} from "../controllers/TicketController";
import {fetchUser} from "../controllers/UserController";
import ProjectViewUserTable from "./UserTable";
import CommentSection from "./CommentSection";
import {fetchCommentsForTicket} from "../controllers/CommentController";
import AttachmentSection from "./AttachmentSection";
import jwtDecode from "jwt-decode";
import {fetchAttachmentsForTicket, addAttachmentToTicket} from "../controllers/AttachmentController";
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
    const [editingTicketId, setEditingTicketId] = useState(null);  // new state variable
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [curUserId, setCurUserId] = useState(null);
    const [curUser, setCurUser] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('No file selected');
    const [isLoading, setIsLoading] = useState(false);

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


    const handleFileUpload = async () => {
        setIsLoading(true);
        let uploadSuccessful = false;

        try {
            if (selectedFile) {
                // Get the presigned URL immediately before uploading the file
                const presignResponse = await fetch(`https://z5pv2jprgl.execute-api.us-east-1.amazonaws.com/dev/presign?filename=${encodeURIComponent(selectedFile.filename)}&filetype=${encodeURIComponent(selectedFile.file.type)}`);
                if (!presignResponse.ok) {
                    throw new Error('Failed to get presigned URL');
                }
                const presignData = await presignResponse.json();
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
                    const addedAttachment = await attachFileToTicket(ticketId, attachment, token);

                    // If the upload is successful, fetch the updated list of attachments
                    const attachmentData = await fetchAttachmentsForTicket(ticketId, token);
                    setAttachments(attachmentData);

                    uploadSuccessful = true;
                }
            }
        } catch (error) {
            console.error('Failed to upload file:', error);
        } finally {
            setSelectedFile(null);
            setSelectedFileName('No file selected');
            setIsLoading(false);
        }

        return uploadSuccessful;
    };


    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        const attachment = {
            file,
            filename: file.name,
            uploader:  curUserId
        };
        setSelectedFile(attachment);
        setSelectedFileName(file.name);
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

    if (loading) {
        return <p>Loading...</p>
    } else {
        return (
            <div>
                <CustomNavbar/>
                <div className="main-content">
                    <SideMenu/>
                    <div className="outside-container">
                        <div className="overlapping-title-view">
                            <div className="title-text">
                                {ticket.title}
                            </div>
                            <div className="title-desc-text">
                                Back | Edit
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
                        <div className="horizontal-container">
                            <div className="common-parent1">
                                <div className="overlapping-title-view">
                                    <div className="title-text">
                                        {"Attachments"}
                                    </div>
                                    <div className="title-desc-text">
                                        Add | Edit
                                    </div>
                                </div>
                                <div className="content">
                                    <AttachmentSection
                                        curUserId={curUserId}
                                        attachments={attachments}
                                        selectedFile={selectedFile}
                                        setSelectedFile={setSelectedFile}
                                        selectedFileName={selectedFileName}
                                        setSelectedFileName={setSelectedFileName}
                                        handleFileUpload={handleFileUpload}
                                        isLoading={isLoading}
                                    />                                </div>
                            </div>
                            <div className="common-parent2">
                                <div className="overlapping-title-view">
                                    <div className="title-text">
                                        {"Comments"}
                                    </div>
                                    <div className="title-desc-text">
                                        Add | Edit
                                    </div>
                                </div>
                                <div className="content">
                                    <CommentSection curUserObject={curUser}></CommentSection>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default TicketView;
