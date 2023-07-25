import React, {useEffect, useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import { createTicket, attachFileToTicket } from '../controllers/TicketController'
import {getPresignedUrl} from "../controllers/AttachmentController";
import CustomNavbar from "./CustomNavbar";
import SideMenu from "./SideMenu";
import {addTicketToProject, fetchProjects} from "../controllers/ProjectController";
import {getAllUsers} from "../controllers/UserController";
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import AddAttachment from './AddAttachment';

function CommonFormFields({title, setTitle, type, setType, description, setDescription, priority, setPriority, project, setProject, projects, setProjects}) {
    return (
        <>
            <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Control
                    as="select"
                    value={type}
                    onChange={e => setType(e.target.value)}
                >
                    <option value="bug">Bug</option>
                    <option value="feature request">Feature Request</option>
                    <option value="improvement">Improvement</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="security">Security</option>
                    <option value="documentation">Documentation</option>
                    <option value="ui/ux">UI/UX</option>
                    <option value="performance">Performance</option>
                    <option value="compatibility">Compatibility</option>
                    <option value="other">Other</option>
                </Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Project</Form.Label>
                <Form.Control
                    as="select"
                    value={project}
                    onChange={e => setProject(e.target.value)}
                >
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <option key={project._id} value={project._id}>
                                {project.name}
                            </option>
                        ))
                    ) : (
                        <option>No projects available</option>
                    )}

                </Form.Control>
            </Form.Group>
        </>

    );
}

function SubmitterFields() {
    // form fields specific to submitter role
    return null;
}

function ProjectManagerFields({user, setUser, users, priority, setPriority, assignedTo, setAssignedTo, assignedBy, setAssignedBy}) {

    return (
        <>
            <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Control
                    as="select"
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                </Form.Control>
            </Form.Group>

            <Form.Group>
                <Form.Label>Assigned To</Form.Label>
                <Form.Control
                    as="select"
                    value={assignedTo || 'none'}
                    onChange={e => setAssignedTo(e.target.value === 'none' ? null : e.target.value)}
                >
                    <option value='none'>No Assignment</option>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.firstName} {user.lastName}
                            </option>
                        ))
                    ) : (
                        <option>No users available</option>
                    )}
                </Form.Control>
            </Form.Group>
        </>

    );
}

function DeveloperFields({priority, setPriority}) {
    return (
        <Form.Group>
            <Form.Label>Priority</Form.Label>
            <Form.Control
                as="select"
                value={priority}
                onChange={e => setPriority(e.target.value)}
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </Form.Control>
        </Form.Group>
    );
}


function CreateTicketPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedBy, setAssignedBy] = useState(null);
    const [assignedTo, setAssignedTo] = useState(null);
    const [type, setType] = useState('bug');
    const [project, setProject] = useState('');
    const [status, setStatus] = useState('open');
    const [priority, setPriority] = useState('medium');
    const [projects, setProjects] = useState([]);
    const [user, setUser] = useState('');
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [curUserId, setCurUserId] = useState(null);
    const [role, setRole] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFileNames, setSelectedFileNames] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // add this to your state
    const [presignedUrl, setPresignedUrl] = useState(null);

    // creates tickets first then sends attachment
    const handleSubmit = async (event) => {
        setIsLoading(true);

        try {
            const isValidForm = title && description && type && project;
            if (!isValidForm) {
                console.error('Invalid form fields');
                return;
            }

            const ticket = { title, description, type, assignedBy, assignedTo, status, priority, project };
            const createdTicket = await createTicket(ticket, token);
            const ticketId = createdTicket.ticket._id;

            if (ticketId && selectedFiles && selectedFiles.length > 0) {
                for (let i = 0; i < selectedFiles.length; i++) {
                    const selectedFile = selectedFiles[i];

                    // Get the presigned URL immediately before uploading the file
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
                        const attachmentLocation = presignedUrl.split("?")[0];

                        const attachment = {
                            filename: selectedFile.filename,
                            path: attachmentLocation,
                            uploader: selectedFile.uploader,
                            ticket: ticketId
                        };
                        await attachFileToTicket(ticketId, attachment, token);
                    }
                }
            }

            setTitle('');
            setDescription('');
            setAssignedBy(null);
            setAssignedTo(null);
            setType('bug');
            setStatus('open');
            setPriority('medium');
            setSelectedFiles([]);
            setSelectedFileNames([]);
        } catch (error) {
            console.error("Failed to create ticket:", error);
        }
        setIsLoading(false);
    };
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const attachments = files.map(file => ({
            file,
            filename: file.name,
            uploader: curUserId
        }));
        setSelectedFiles(attachments);
        setSelectedFileNames(files.map(file => file.name));
    };




    useEffect(() => {

        const fetchAndSetProjects = async () => {
            try {
                const data = await fetchProjects(token);
                if (data.length > 0) {
                    setProject(data[0]._id);
                }
                setProjects(data);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        }
        const fetchAndSetUsers = async () => {
            try {
                const data = await getAllUsers(token);
                if (data.length > 0) {
                    setUser(data[0]._id);
                }
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        }


        fetchAndSetProjects().then();
        fetchAndSetUsers().then();


        if (!token) {
            navigate('/login');
        }
        else{
            const decodedToken = jwtDecode(token);
            const role = decodedToken.UserInfo.role;
            const curUserId = decodedToken.UserInfo.id;
            setCurUserId(curUserId);
            setRole(role);
        }

    }, [navigate, token]);





    return (
        <Form onSubmit={handleSubmit}>
            <CustomNavbar />
            <div className="main-content">
                <SideMenu />
                <div className="ticket-page-content">
                    <CommonFormFields
                        title={title}
                        setTitle={setTitle}
                        type={type}
                        setType={setType}
                        description={description}
                        setDescription={setDescription}
                        project={project}
                        setProject={setProject}
                        projects={projects}  // Pass the projects state to CommonFormFields
                    />

                    {role === 'submitter' && <SubmitterFields />}

                    {role === 'projectmanager' &&
                        <ProjectManagerFields
                            user={user}
                            setUser={setUser}
                            users={users}
                            priority={priority}
                            setPriority={setPriority}
                            assignedTo={assignedTo}
                            setAssignedTo={setAssignedTo}
                            assignedBy={assignedBy}
                            setAssignedBy={setAssignedBy}
                        />}

                    {role === 'developer' &&
                        <DeveloperFields
                            priority={priority}
                            setPriority={setPriority}
                        />}
                    {/*todo modify the styling of this*/}
                    {/*<Form.Group>*/}
                    {/*    <Form.Label>Attachment</Form.Label>*/}
                    {/*    <Form.Control*/}
                    {/*        type="file"*/}
                    {/*        accept=".jpg,.jpeg,.png,.doc,.pdf" // adjust this string to limit which file types can be selected*/}
                    {/*        onChange={handleFileSelect}*/}
                    {/*        multiple*/}
                    {/*    />*/}
                    {/*    <Form.Text>*/}
                    {/*        <Form.Text>*/}
                    {/*            {selectedFileNames.join(', ')}*/}
                    {/*        </Form.Text>*/}
                    {/*    </Form.Text>*/}
                    {/*</Form.Group>*/}

                    {/*<Button variant="primary" type="submit" disabled={isLoading}>Submit</Button>*/}
                    <AddAttachment
                        selectedFiles={selectedFiles}
                        setSelectedFiles={setSelectedFiles}
                        handleFileUpload={handleSubmit}
                        isLoading={isLoading}
                        uploader={curUserId}
                    />
                </div>

            </div>
        </Form>
    );
}

export default CreateTicketPage;