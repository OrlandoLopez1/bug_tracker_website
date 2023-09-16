import React, { useState } from "react";
import { registerUser } from "../controllers/AuthController";
import { Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("submitter");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            firstName,
            lastName,
            username,
            email,
            password,
            role
        };
        const data = await registerUser(userData);
        if (data.message === 'User created') {
            alert("Registration Successful");
            navigate("/login");
        } else {
            alert("Something went wrong");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#212529'}}>
            <div className="card p-4" style={{width: '300px', backgroundColor: '#eaeef3'}}>
                <form onSubmit={handleSubmit}>
                    <h3 className="mb-4">Sign Up</h3>

                    <div className="mb-3">
                        <label>First Name</label>
                        <input
                            className="form-control"
                            placeholder="Enter first name"
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Last Name</label>
                        <input
                            className="form-control"
                            placeholder="Enter last name"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Username</label>
                        <input
                            className="form-control"
                            placeholder="Enter username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <Form.Group>
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            as="select"
                            value={role}
                            onChange={e => setRole(e.target.value)}
                        >
                            <option value="submitter">Submitter</option>
                            <option value="developer">Developer</option>
                            <option value="projectmanager">Project Manager</option>
                        </Form.Control>
                    </Form.Group>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Register
                        </button>
                    </div>

                    <p className="forgot-password text-right">
                        Already registered <a href="/login">sign in?</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
