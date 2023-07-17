import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import TicketForm from "./components/TicketForm";
import TicketPage from "./components/TicketPage";
import TicketView from "./components/TicketView";
import  ProjectPage from "./components/ProjectPage";
import  ProjectForm from "./components/ProjectForm";
import  ProjectView from "./components/ProjectView";
import Dashboard from "./components/Dashboard";
import Testing from "./components/testing";
// todo make it redirect to a logged out page after a token expires
function App() {
    const token = localStorage.getItem('accessToken');

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={ token ? <HomePage /> : <Login /> } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/homepage" element={<HomePage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ticketForm" element={<TicketForm />} />
                    <Route path="/ticketPage" element={<TicketPage />} />
                    <Route path="/projectForm" element={<ProjectForm />} />
                    <Route path="/projectPage" element={<ProjectPage />} />
                    <Route path="/projectView/:id" element={<ProjectView />} />
                    <Route path="/testing/:id" element={<Testing/>} />
                    <Route path="/ticketView/:id" element={<TicketView />} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
