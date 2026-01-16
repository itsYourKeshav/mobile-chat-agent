import { z } from 'zod';

export interface Phone {
  id: string;
  brand: string;
  model: string;
  price: number;
  camera_mp: number;
  has_ois: boolean;
  battery_mah: number;
  charging_watts: number;
  size_category: 'compact' | 'medium' | 'large';
  os: string;
  rating: number;
}

export const ChatRequestSchema = z.object({
  message: z.string().min(1)
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export interface ChatResponse {
  summary: string;
  recommendations: Phone[];
  comparison?: Phone[]; // Optional for side-by-side
  explanation?: string; // Optional for specific concept queries
}
