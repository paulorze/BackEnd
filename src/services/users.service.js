import Users from "../dao/classes/users.dao.js";

const usersManager = new Users();

const getUser = async (email) => {
    return await usersManager.readByEmail(email);
};

const getUserList = async () => {
    return await usersManager.readAll();
};

const saveUser = async (user) => {
    return await usersManager.create(user);
};

const updateUser = async (id, user) => {
    return await usersManager.update(id, user);
};

const deleteUser = async (id) => {
    return await usersManager.delete(id);
};

export {
    getUser,
    getUserList,
    saveUser,
    updateUser,
    deleteUser
};