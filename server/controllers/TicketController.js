const Ticket = require('../models/Ticket');

exports.addTicket = async (req, res) => {
    try {
        const ticket = new Ticket({
            title: req.body.title,
            description: req.body.description,
            assignedBy: req.body.assignedBy,
            assignedTo: req.body.assignedTo,
            project_name: req.body.project_name,
            type: req.body.type,
            status: req.body.status,
            priority: req.body.priority
        });
        await ticket.save();
        res.status(201).json({ message: 'Ticket created' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating ticket', error: error.message });
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
        project_name: ticket.project_name,
        assignedBy: ticket.assignedBy,
        assignedTo: ticket.assignedTo,
        status: ticket.status,
        priority: ticket.priority
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
