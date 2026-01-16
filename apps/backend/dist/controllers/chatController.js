"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChat = void 0;
const agent_1 = require("../mcp/agent");
const handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const response = await (0, agent_1.processUserMessage)(message);
        res.json(response);
    }
    catch (error) {
        console.error('Error handling chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.handleChat = handleChat;
