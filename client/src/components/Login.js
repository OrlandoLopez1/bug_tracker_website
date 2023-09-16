import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { loginUser } from "../controllers/AuthController";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(email, password);
            if (data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                navigate("/projectpage");
                alert("Login Successful");
            } else {
                alert("Something went wrong");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#212529'}}>
            <div className="card p-4" style={{width: '300px', backgroundColor: '#eaeef3'}}>
                <form onSubmit={handleSubmit}>
                    <h3 className="mb-4">Sign In</h3>

                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-3 d-flex align-items-center">
                        <input
                            type="checkbox"
                            className="me-2"
                            id="rememberMe"
                        />
                        <label htmlFor="rememberMe">
                            Remember me
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mb-3">
                        Login
                    </button>

                    <div className="d-flex justify-content-between">
                        <a href="/register">Register</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
