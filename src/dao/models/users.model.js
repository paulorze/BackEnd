import mongoose from 'mongoose';

const usersCollection = 'users';

const userSchema = new mongoose.Schema({
    username: String,
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: {
        type: String,
        default: 'user'
    }
});

export const usersModel = mongoose.model(usersCollection, userSchema);