import MessageModel from "../models/messages.model.js";

exports.getAllMessages = async () => {
    return await MessageModel.find().lean();
};
