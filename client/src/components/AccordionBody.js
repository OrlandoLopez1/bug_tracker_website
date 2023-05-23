function AccordionBody({ project }) {
    return (
        <>
            <h5>Description:</h5>
            <p>{project.projectDescription}</p>
            <h5>Manager:</h5>
            <p>{project.projectManager}</p>
            <h5>Start Date:</h5>
            <p>{project.startDate}</p>
            <h5>End Date:</h5>
            <p>{project.endDate}</p>
            <h5>Priority:</h5>
            <p>{project.priority}</p>
            <h5>Status:</h5>
            <p>{project.currentStatus}</p>
        </>
    );
}

export default AccordionBody;