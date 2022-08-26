const mongoose = require('mongoose');

const mongooseUserSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true,'username is missing']
    },
    password: {
        type: String,
        default: '',
    },
    age: {
        type: Number,
        required: [true,'age is missing']
    },
    state: {
        type: String,
        required: [true,'state is missing']
    },
    firstname: {
        type: String,
        default: '',
    },
    lastname: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        required: [true,'gender is missing'],
    },
});

const UserValidationSchema = {
    username: {
        type: 'string',
        required: true,
        validation: {
            validator: (un) => un.length >= 4 && un.length <= 20 && un.includes('@'),
            msg: 'username must have more than 4 and less than 20 characters. An @ must be included',
        },
    },
    password: {
        type: 'string',
    },
    firstname: {
        type: 'string',
    },
    lastname: {
        type: 'string',
    },
    state: {
        type: 'string',
        required: true,
        validation: {
            validator: (state) => ['online', 'offline'].includes(state),
        },
    },
    age: {
        type: 'number',
        required: true,
        validation: {
            validator: (age) => age >= 12 && age <= 120,
            msg: 'age only between 4 and 120 allowed.',
        },
    },
    gender: {
        type: 'string',
        required: true,
        validation: {
            validator: (gender) => ['male', 'female'].includes(gender),
        },
    },
};



const User = mongoose.model('User', mongooseUserSchema);

module.exports.User = User;
module.exports.UserValidationSchema = UserValidationSchema;