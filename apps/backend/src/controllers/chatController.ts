import { Request, Response } from 'express';
import { processUserMessage } from '../mcp/agent';
import { ChatRequest } from '@repo/shared-types';

export const handleChat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body as ChatRequest;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await processUserMessage(message);
    res.json(response);
  } catch (error) {
    console.error('Error handling chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
