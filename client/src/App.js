import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import TicketForm from "./components/TicketForm";
import TicketPage from "./components/TicketPage";
import  ProjectsPage from "./components/ProjectsPage";
import  ProjectForm from "./components/ProjectForm";

function App() {
    const isLoggedIn = window.localStorage.getItem("loggedIn");
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={ isLoggedIn ? <HomePage /> : <Login /> } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/homepage" element={<HomePage />} />
                    <Route path="/ticketForm" element={<TicketForm />} />
                    <Route path="/ticketPage" element={<TicketPage />} />
                    <Route path="/projectForm" element={<ProjectForm />} />
                    <Route path="/projectsPage" element={<ProjectsPage />} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
