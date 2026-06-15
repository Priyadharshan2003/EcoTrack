import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const fallbackInsights = [
  {
    id: "fb-1",
    title: "Energy Optimization",
    description: "Switching to LED bulbs in your living room could reduce your monthly footprint.",
    savings: "15kg CO₂",
    icon: "Zap",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20"
  },
  {
    id: "fb-2",
    title: "Commute Alternative",
    description: "Taking the train on Tuesdays and Thursdays reduces your weekly footprint by 12%.",
    savings: "24kg CO₂",
    icon: "Train",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  }
];

export async function POST(req: Request) {
  try {
    const { userData, userProfile } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found, using fallback insights.");
      return NextResponse.json({ insights: fallbackInsights });
    }

    const prompt = `
      You are EcoTrack AI, a context-aware sustainability coach.
      User Profile: ${JSON.stringify(userProfile)}
      Recent Data: ${JSON.stringify(userData)}
      
      Generate 2 highly personalized insights to help them reduce their carbon footprint.
      The advice MUST reference their profile (e.g. if their commute is car_petrol, suggest metro; if diet is meat_heavy, suggest vegan meal prep).
      Format the response as a JSON array of objects with the following keys:
      - title: Short title
      - description: 1 sentence personalized advice referencing their habits
      - savings: estimated kg CO2 saved (use science, e.g., '85kg CO2')
      - iconName: "Zap", "Train", "Leaf", or "Car"
      Only output the valid JSON array.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (response.text) {
      const generatedInsights = JSON.parse(response.text);
      
      const formattedInsights = generatedInsights.map((insight: Record<string, string>, i: number) => ({
        id: `ai-${i}`,
        title: insight.title,
        description: insight.description,
        savings: insight.savings,
        icon: insight.iconName || "Leaf",
        color: "text-primary",
        bg: "bg-primary/10",
        border: "border-primary/20"
      }));

      return NextResponse.json({ insights: formattedInsights });
    }

    return NextResponse.json({ insights: fallbackInsights });
  } catch (error) {
    console.error("AI Generation failed:", error);
    return NextResponse.json({ insights: fallbackInsights });
  }
}

