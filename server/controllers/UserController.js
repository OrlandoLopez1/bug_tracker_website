const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


// @desc Get a specific user by id
// @route GET /users/:id
// @access Private
const getUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'Cannot find user' });
    }
    res.json(user);
});


// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()

    // If no users
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, role } = req.body

    // Confirm data
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = { username, "password": hashedPwd, role }

    // Create and store new user
    const user = await User.create(userObject)

    if (user) { //created
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { userId, username, role, password } = req.body

    // Confirm data
    if (!userId || !username || !role) {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(userId).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== userId) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.role = role

    if (password) {
        // Hash password
        user.password = await bcrypt.hash(password, 10) // salt rounds
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.body

    if (!userId) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    const user = await User.findById(userId).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

// @desc Get user projects
// @route GET /users/:id/projects
// @access Private
const getUserProjects = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('projects');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.projects);
});

// @desc Get user tickets
// @route GET /users/:id/tickets
// @access Private
const getUserTickets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('tickets');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.tickets);
});

module.exports = {
    getUser,
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUserProjects,
    getUserTickets
}