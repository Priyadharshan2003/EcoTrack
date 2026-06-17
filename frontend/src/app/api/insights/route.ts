import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@/lib/supabase/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Convert history to string for Gemini or pass it properly
    const latestMessage = messages[messages.length - 1].content;
    const historyContext = messages.slice(0, -1).map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join('\n');

    const prompt = `
    You are an EcoTrack AI Assistant, an expert in carbon footprint reduction, climate change, and sustainability.
    Your goal is to provide concise, practical, and highly personalized advice.
    Be friendly and encouraging. Focus on actionable insights.
    
    Conversation History:
    ${historyContext}
    
    User: ${latestMessage}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: unknown) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insight', details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
