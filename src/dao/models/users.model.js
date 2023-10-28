import mongoose from 'mongoose';

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: Number,
    password: String,
    role: {
        type: String,
        default: 'user'
    }
});

export const usersModel = mongoose.model(usersCollection, userSchema);