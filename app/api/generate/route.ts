import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const { productType, keyFeatures, customerGoals, deliveryDays } = await req.json();
    if (!productType?.trim()) {
      return NextResponse.json({ error: "Product type is required." }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert email marketer and customer success specialist. Generate comprehensive 5-7 email onboarding sequences that educate, engage, and activate new customers. Emails should flow naturally from welcome to value to upgrade.`,
        },
        {
          role: "user",
          content: `Generate a professional email onboarding sequence for new customers.

**Product Type:** ${productType}
**Key Features:** ${keyFeatures || "Core features of the product"}
**Customer Goals:** ${customerGoals || "Get started and see value quickly"}
**Delivery Timing:** ${deliveryDays || "Space emails 2-3 days apart"}

Create a 5-7 email sequence with this structure:

---

## Day 1 — Welcome Email
[Email 1: Warm welcome, what to expect, getting started link]

## Day 3 — Quick Win
[Email 2: Help them achieve their first specific result with the product]

## Day 5 — Feature Deep-Dive
[Email 3: Highlight a key feature with a practical use case]

## Day 7 — Social Proof & Community
[Email 4: Show how other customers succeeded, invite to community]

## Day 10 — Advanced Tips
[Email 5: Share pro tips, hidden features, or integration ideas]

## Day 14 — Check-In
[Email 6: Ask how it's going, offer help, foreshadow upgrade]

## Day 21 — Upgrade/Next Step Prompt
[Email 7: Gently introduce higher tier or add-on that matches their usage]

---

For EACH email provide:
- Subject line (and 2-3 alternatives)
- Preview text (1 sentence)
- Full email body (100-180 words each)
- Call-to-action button copy

Make each email feel personal. Reference the product type specifically. Vary the tone — some educational, some exciting, some warm and personal.`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.65,
    });

    const result = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Generation failed." }, { status: 500 });
  }
}
