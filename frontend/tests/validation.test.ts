import { describe, it, expect } from "vitest";
import { z } from "zod";

const RequestSchema = z.object({
  userData: z.object({
    inputs: z.array(z.object({
      category: z.enum(["transport", "energy", "food", "shopping"]),
      item: z.string(),
      value: z.number(),
      unit: z.string()
    })).optional(),
    totalEmissions: z.number().optional()
  }).optional(),
  userProfile: z.object({
    commuteType: z.string().optional(),
    dietType: z.string().optional(),
    cabUsageFrequency: z.string().optional(),
    hasCompletedOnboarding: z.boolean().optional(),
    publicLeaderboard: z.boolean().optional(),
    showBadges: z.boolean().optional(),
  }).optional()
});

describe("API Validation Schemas", () => {
  it("should accept valid payload", () => {
    const payload = {
      userData: {
        totalEmissions: 1500
      },
      userProfile: {
        commuteType: "car",
        hasCompletedOnboarding: true
      }
    };
    
    const result = RequestSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("should fail on invalid enum category", () => {
    const payload = {
      userData: {
        inputs: [{ category: "invalid_category", item: "test", value: 10, unit: "kg" }]
      }
    };
    
    const result = RequestSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
  
  it("should enforce correct typing on values", () => {
    const payload = {
      userData: {
        totalEmissions: "1500" // string instead of number
      }
    };
    
    const result = RequestSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
