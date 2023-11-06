import Messages from "../dao/dbManagers/messages.manager.js";

const messagesManager = new Messages();

const getMessages = async (limit = null) => {
    let messages;
    if (!limit == null) {
        messages = await messagesManager.getAllPaginated(limit);
    } else {
        messages = await messagesManager.getAll();
    };
    return messages;
};

const getMessageById = async (id) => {
    const message = await messagesManager.getByID(id);
    return message;
};

const saveMessage = async (message) => {
    await messagesManager.save(message);
    return message;
};

const deleteMessage = async (id) => {
    return await messagesManager.delete(id);
};

export {
    getMessages,
    getMessageById,
    saveMessage,
    deleteMessage
};