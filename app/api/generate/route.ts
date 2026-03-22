import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const { productName, productType, keyFeatures, customerGoals, tone } = await req.json();

    if (!productName) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const prompt = `You are an expert email copywriter specializing in SaaS onboarding sequences. Generate a 7-email onboarding sequence for ${productName}.

Product Name: ${productName}
Product Type: ${productType || "SaaS Product"}
Key Features: ${keyFeatures || "Core features of the product"}
Customer Goals: ${customerGoals || "What customers want to achieve"}
Tone: ${tone || "Friendly, professional, encouraging"}

Generate exactly 7 emails in this JSON format (no markdown):
{
  "emails": [
    {
      "day": 1,
      "subject": "Email subject line",
      "preview": "Email preview text (50 chars max)",
      "body": "Full email body copy. Use clear paragraphs. Include CTA buttons indicated as [CTA: button text]. Warm, helpful tone.",
      "goal": "What this email is trying to achieve",
      "trigger": "When to send this email (e.g. immediately after signup, 3 days after login, etc.)"
    }
  ]
}

Email sequence logic:
- Email 1 (Day 0): Welcome + instant value / quick start guide
- Email 2 (Day 1): Feature deep-dive #1 — most important feature
- Email 3 (Day 3): Social proof / case study
- Email 4 (Day 5): Feature deep-dive #2 — second most important feature  
- Email 5 (Day 7): Success milestone / "you've accomplished X" celebration
- Email 6 (Day 10): Engagement prompt — get them to do the key action
- Email 7 (Day 14): Soft upgrade CTA + support offer

Make each email 120-180 words. Conversational, not corporate. Focus on customer success, not selling.`;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85,
    });

    const raw = completion.choices[0]?.message?.content || "";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const data = JSON.parse(cleaned);

    return NextResponse.json(data);
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
