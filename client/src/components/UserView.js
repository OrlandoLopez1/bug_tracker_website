import SideMenu from './SideMenu';
import CustomNavbar from './CustomNavbar';
import './UserView.css'
import {useNavigate, useParams} from 'react-router-dom';
import Modal from 'react-modal';
import React, {useEffect, useState} from "react";
import jwtDecode from "jwt-decode";
import {fetchUser, fetchUserProjects, fetchUserTickets} from "../controllers/UserController";
import TicketTable from "./TicketTable";
import ProjectTable from "./ProjectTable";
Modal.setAppElement('#root');


function UserView() {
    const {userId} = useParams();
    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState(null);
    const [projects, setProjects] = useState([]);
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }

        const fetchData = async () => {
            try {
                const userData = await fetchUser(userId, token);
                const userProjects = await fetchUserProjects(userId, token);
                const ticketData = await fetchUserTickets(userId, token)
                setUser(userData);
                setProjects(userProjects);
                setTickets(ticketData)
                setLoading(false);
            } catch (error) {
             }
        };

        fetchData();
    }, [navigate, token, userId]);

    if (loading) {
        return <p>Loading...</p>
    } else {
        return (
            <div>
                <CustomNavbar/>
                <div className="main-content-uv">
                    <SideMenu/>
                    <div className="outside-container-uv">
                        <div className='user-details-container'>
                            <div className="user-details-section">
                                <div className="user-details-left">
                                    <img src="/defaultpfp.jpg" alt="Profile picture" className="profile-picture-uv"/>
                                    <div className={"user-details-name-row"}>
                                        <div>{`${user.firstName} ${user.lastName}`}</div>{''}
                                        <span>({user.username})</span>
                                    </div>
                                    <div>{user.role}</div> {/*todo replace with stylized version*/}
                                    <div>{user.email}</div>
                                    <div>Joined at {user.createdAt}</div>
                                </div>
                                <div className="user-details-right">
                                    <div className="skills-container">
                                        <span className="skill-bubble">Placeholder skill 1</span>
                                        <span className="skill-bubble">Placeholder skill 2</span>
                                        <span className="skill-bubble">Placehold skill 3</span>
                                        <span className="skill-bubble">Placeholder</span>
                                        <span className="skill-bubble">Placeholder skill 5</span>
                                        <span className="skill-bubble">Placehlder skill 1</span>
                                        <span className="skill-bubble">Placeholder skill 2</span>
                                        <span className="skill-bubble">Placeholder skill </span>
                                        <span className="skill-bubble">Placeholder skill 4</span>
                                        <span className="skill-bubble">Placeholder skill 5</span>
                                        <span className="skill-bubble">Placeholder skill 5</span>
                                        <span className="skill-bubble">Placeholder skill 5</span>
                                        <span className="skill-bubble">Placeholder skill 5</span>
                                        <span className="skill-bubble">Placeholder skill 5</span>
                                    </div>
                                </div>

                            </div>
                            <div className="table-container">
                                <TicketTable tickets={tickets}  viewType="user" style={{ marginRight: "2vw" }} />
                                <ProjectTable projects={projects}  viewType="user" />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default UserView;