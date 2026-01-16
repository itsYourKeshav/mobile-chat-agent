import axios from 'axios';
import { ChatResponse } from '@repo/shared-types';

const api = axios.create({
  baseURL: '/api'
});

export const sendMessage = async (message: string): Promise<ChatResponse> => {
  const { data } = await api.post<ChatResponse>('/chat', { message });
  return data;
};
