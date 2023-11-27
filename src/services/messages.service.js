import Messages from "../dao/classes/messages.dao.js";

const messagesManager = new Messages();

const getMessages = async (user, sender = null) => {
    let messages;
    if (sender != null) {
        messages = await messagesManager.readConversation(user, sender);
    } else {
        messages = await messagesManager.readByUser(user);
    };
    return messages;
};

const getMessageById = async (id) => {
    const message = await messagesManager.readByID(id);
    return message;
};

const saveMessage = async (message) => {
    await messagesManager.create(message);
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