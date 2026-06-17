import { z } from "zod";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const ChatInsightResponseSchema = z.object({
  reply: z.string(),
});

const DashboardInsightSchema = z.object({
  insights: z.array(z.unknown()), // Can be refined later
});

export type ChatInsightResponse = z.infer<typeof ChatInsightResponseSchema>;
export type DashboardInsightResponse = z.infer<typeof DashboardInsightSchema>;
export type Message = {
  id: number;
  role: "user" | "ai";
  content: string;
};

export const api = {
  chat: {
    getInsights: async (messages: Message[]): Promise<ChatInsightResponse> => {
      const fallbackResponse = { reply: "I'm having trouble connecting to our servers right now. Please check back later!" };
      try {
        const response = await fetch("/api/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
        });

        if (!response.ok) {
          return fallbackResponse;
        }

        const data = await response.json();
        const parsed = ChatInsightResponseSchema.safeParse(data);
        
        if (!parsed.success) {
          // Sanitized log to avoid leaking sensitive payload data
          console.error("API Response Validation Failed: Data structure mismatch.");
          return fallbackResponse;
        }

        return parsed.data;
      } catch (error) {
        return fallbackResponse;
      }
    },
    getDashboardInsights: async (footprint: number, profile?: unknown): Promise<DashboardInsightResponse> => {
      const fallbackInsights = {
        insights: [
          {
            id: "fallback-api-1",
            title: "System Optimized",
            description: "Our AI is currently analyzing your data. Check back soon for personalized reduction strategies.",
            savings: "TBD",
            icon: "Sparkles",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20"
          }
        ]
      };

      try {
        const response = await fetch("/api/ai/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userData: { totalEmissions: footprint }, userProfile: profile }),
        });

        if (!response.ok) {
          return fallbackInsights;
        }

        const data = await response.json();
        const parsed = DashboardInsightSchema.safeParse(data);
        
        if (!parsed.success) {
          // Sanitized log to avoid leaking sensitive payload data
          console.error("API Dashboard Response Validation Failed: Data structure mismatch.");
          return fallbackInsights;
        }

        return parsed.data;
      } catch (error) {
        return fallbackInsights;
      }
    }
  }
};
