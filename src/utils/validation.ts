import { z } from 'zod';

// Activity Validation
export const ActivityTypeSchema = z.enum(['cab_travel', 'food_order', 'streaming', 'walk', 'bike']);

export const ActivitySchema = z.object({
  id: z.string().min(1),
  type: ActivityTypeSchema,
  title: z.string().min(1),
  description: z.string(),
  confidence: z.number().min(0).max(1),
  inferred_from: z.array(z.string()),
  status: z.enum(['pending', 'verified', 'rejected']),
  emissions_kg: z.number().nonnegative(),
  timestamp: z.string().datetime()
});

// Chat Validation & Sanitization
export const ChatMessageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(['user', 'assistant']),
  text: z.string().min(1).max(1000), // Max 1000 chars to prevent massive payloads
  timestamp: z.string().datetime()
});

export function sanitizeChatInput(input: string): string {
  // Very basic sanitization, remove typical script injection vectors
  return input
    .replace(/<script[^>]*?>.*?<\/script>/gi, '')
    .replace(/<[\/\!]*?[^<>]*?>/gi, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim();
}

// Ensure payload inputs are valid
export function validateActivity(data: unknown) {
  return ActivitySchema.safeParse(data);
}

export function validateChatMessage(data: unknown) {
  return ChatMessageSchema.safeParse(data);
}
