import "./AccordionBody.css"
function AccordionBody({ project }) {
    return (

        <div >
            <p>{project.projectDescription}</p>
            <div className="horizontal-container">
                <div className="item">
                    <p className="header">Manager:</p>
                    <p>{project.projectManager}</p>
                </div>
                <div className="item">
                    <p className="header">Start Date:</p>
                    <p>{project.startDate}</p>
                </div>
                <div className="item">
                    <p className="header">End Date:</p>
                    <p>{project.endDate}</p>
                </div>
                <div className="item">
                    <p className="header">Priority:</p>
                    <p>{project.priority}</p>
                </div>
                <div className="item">
                    <p className="header">Status:</p>
                    <p>{project.currentStatus}</p>
                </div>
            </div>
        </div>
    );
}

export default AccordionBody;
