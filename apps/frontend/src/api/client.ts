import axios from 'axios';
import { ChatResponse } from '@repo/shared-types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001'
});

export const sendMessage = async (message: string): Promise<ChatResponse> => {
  const { data } = await api.post<ChatResponse>('/chat', { message });
  return data;
};
