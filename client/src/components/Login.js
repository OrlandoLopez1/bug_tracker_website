import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { loginUser } from "../controllers/AuthController";
// todo make it look better
// todo give the user the option to register
// todo give the user feedback when password was inputed incorrect
// todo limit password attempts (low priority)
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(email, password);
            if (data.status === "ok") {
                // Store username in localStorage after successful login
                localStorage.setItem('username', data.username);
                localStorage.setItem('loggedIn', 'true')
                navigate("/homepage")
                alert("Login Successful");
            } else {
                alert("Something went wrong");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <form onSubmit={handleSubmit}>
                    <h3>Sign In</h3>

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

                    <div className="mb-3">
                        <div className="custom-control custom-checkbox">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id="customCheck1"
                            />
                            <label className="custom-control-label" htmlFor="customCheck1">
                                Remember me
                            </label>
                        </div>
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                    <p className="forgot-password text-right">
                        Forgot <a href="#">password?</a>
                    </p>
                    <p className="forgot-password text-right">
                         <a href="/register">register?</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
