import Users from "../dao/dbManagers/users.manager.js";

const usersManager = new Users();

const getUser = async (email) => {
    return await usersManager.getByEmail(email);
};

const getUserList = async () => {
    return await usersManager.getAll();
};

const saveUser = async (user) => {
    return await usersManager.save(user);
};

const deleteUser = async (id) => {
    return await usersManager.delete(id);
};

export {
    getUser,
    getUserList,
    saveUser,
    deleteUser
}