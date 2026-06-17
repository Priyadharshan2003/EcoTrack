import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { calculateCarbon, calculateTotal, calculateBreakdown, CarbonInput } from "@/lib/carbon/calculator";
import { z } from "zod";

export const runtime = 'edge';

// AI client will be instantiated inside POST to prevent build-time crashes if API key is missing

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

function generateDeterministicInsights(data: CarbonInput[], overrideTotal?: number) {
  const breakdown = calculateCarbon(data);
  const calculatedTotal = calculateTotal(breakdown);
  const total = overrideTotal !== undefined ? overrideTotal : calculatedTotal;
  const nationalAvg = 15; // 15 kg/day
  
  const insights = [];
  if (total > nationalAvg) {
    insights.push({
      id: "fb-1",
      title: "Above Average Footprint",
      description: `Your footprint (${total}kg) is higher than the national daily average of ${nationalAvg}kg. Consider reducing transport emissions.`,
      impact: "24",
      icon: "Train",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    });
  } else {
    insights.push({
      id: "fb-1",
      title: "Excellent Efficiency",
      description: `Great job! Your footprint (${total}kg) is below the national daily average of ${nationalAvg}kg.`,
      impact: "15",
      icon: "Zap",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      border: "border-amber-400/20"
    });
  }
  
  return insights;
}

export async function POST(req: Request) {
  let fallbackTotal = 0;
  try {
    const rawBody = await req.json();
    const parsed = RequestSchema.safeParse(rawBody);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error }, { status: 400 });
    }
    
    const { userData, userProfile } = parsed.data;

    const dataArray: CarbonInput[] = userData?.inputs || [];
    const breakdown = calculateCarbon(dataArray);
    const calculatedTotal = calculateTotal(breakdown);
    const total = userData?.totalEmissions !== undefined ? userData.totalEmissions : calculatedTotal;
    const topCategories = calculateBreakdown(dataArray)
      .slice(0, 2)
      .map(([cat, val]) => `${cat}: ${val} kg CO2`)
      .join("\n");
      
    fallbackTotal = total;

    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found, using deterministic insights.");
      return NextResponse.json({ insights: generateDeterministicInsights(dataArray, total) });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are EcoTrack AI, a context-aware sustainability coach.
User Profile: ${JSON.stringify(userProfile)}

User carbon footprint today: ${total} kg CO2
National daily average: 15 kg CO2

Top emissions:
${topCategories}

Provide:
1. 3 personalized action items
2. Estimated CO2 reduction for each
3. Short description. In one of the descriptions, explicitly compare the user's footprint to the national daily average of 15 kg CO2.

Format strictly as JSON:
{
  "actions": [
    { "title": "", "impact": "", "description": "" }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      
      interface AIAction {
        title: string;
        impact: string;
        description: string;
      }
      
      const formattedInsights = (parsed.actions || []).map((action: AIAction, i: number) => ({
        id: `ai-${i}`,
        title: action.title,
        description: action.description,
        impact: action.impact,
        icon: "Leaf",
        color: "text-primary",
        bg: "bg-primary/10",
        border: "border-primary/20"
      }));

      return NextResponse.json({ insights: formattedInsights });
    }

    return NextResponse.json({ insights: generateDeterministicInsights(dataArray, total) });
  } catch (error) {
    console.error("AI Generation failed:", error);
    // Even if it fails, return deterministic insights
    return NextResponse.json({ insights: generateDeterministicInsights([], fallbackTotal) });
  }
}
