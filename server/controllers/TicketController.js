const Ticket = require('../models/Ticket');
exports.addTicket = async (req, res) => {
    console.log("SEVER SIDEEEEEEEEEEE "); // <-- Add this
    console.log(req.body)
    try {
        const ticket = new Ticket({
            title: req.body.title,
            description: req.body.description,
            assignedBy: req.body.assignedBy,
            assignedTo: req.body.assignedTo,
            type: req.body.type,
            status: req.body.status,
            priority: req.body.priority,
            project: req.body.project
        });
        ticket.save();
        res.status(201).json({message: 'Ticket created'});
    }catch (error) {
            if (error.name === 'ValidationError') {
                res.status(400).json({ message: 'Error validating ticket', error: error.message });
            } else if (error.name === 'MongoError') {
                res.status(500).json({ message: 'Error saving ticket to database', error: error.message });
            } else {
                res.status(500).json({ message: 'Unknown server error', error: error.message });
            }
        }

    };


exports.getTicket = async (req, res) => {
    const title = req.query.title;
    const ticket = await Ticket.findOne({title: title});

    if (ticket == null) {
        return res.status(404).json({message: 'Cannot find ticket'})
    }

    const ticket_info = {
        title: ticket.title,
        description: ticket.description,
        type: ticket.type,
        assignedBy: ticket.assignedBy,
        assignedTo: ticket.assignedTo,
        status: ticket.status,
        priority: ticket.priority,
        project: ticket.project
    }
    res.json(ticket_info);
};

exports.getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({});
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error getting tickets', error: error.message });
    }
};

exports.getTicketsForProject = async (req, res) => {

    try {
        const projectId = req.params.projectId;

        const tickets = await Ticket.find({ project: projectId });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error getting tickets', error: error.message });
    }
};





