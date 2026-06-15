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
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new ApiError(response.status, "Failed to fetch insight");
      }

      const data = await response.json();
      const parsed = ChatInsightResponseSchema.safeParse(data);
      
      if (!parsed.success) {
        console.error("API Response Validation Failed:", parsed.error);
        throw new Error("Invalid response format from server");
      }

      return parsed.data;
    },
    getDashboardInsights: async (footprint: number, profile?: unknown): Promise<DashboardInsightResponse> => {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData: { totalEmissions: footprint }, userProfile: profile }),
      });

      if (!response.ok) {
        throw new ApiError(response.status, "Failed to fetch dashboard insights");
      }

      const data = await response.json();
      const parsed = DashboardInsightSchema.safeParse(data);
      
      if (!parsed.success) {
        console.error("API Response Validation Failed:", parsed.error);
        throw new Error("Invalid response format from server");
      }

      return parsed.data;
    }
  }
};
