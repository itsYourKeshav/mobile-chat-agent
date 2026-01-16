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
export declare const ChatRequestSchema: z.ZodObject<{
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
}, {
    message: string;
}>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export interface ChatResponse {
    summary: string;
    recommendations: Phone[];
    comparison?: Phone[];
    explanation?: string;
}
