const Chance = require('chance');
const chance = new Chance();
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');  //
const User = require('../models/User');

const register = asyncHandler(async () => {
    try {
        for (let i = 0; i < 10; i++) {
            const firstName = chance.first();
            const lastName = chance.last();
            const username = chance.twitter();
            const email = chance.email({ domain: 'example.com' });
            const password = chance.string({ length: 8 });
            const roles = ["submitter", "developer", "projectmanager"];
            const role = chance.pickone(roles);

            console.log(`Generating user ${username}...`);

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                firstName,
                lastName,
                username,
                email,
                password: hashedPassword,
                role
            });

            await user.save();
            console.log(`User ${username} created successfully.`);
        }

        console.log('Users created');
    } catch (error) {
        console.error(`An error occurred: ${error}`);
        console.log('Internal Server Error');
    }
});

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/your_database_name', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch(err => {
        console.error('Connection error', err);
    });


register();
