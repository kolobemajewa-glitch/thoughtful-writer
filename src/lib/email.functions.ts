import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  purpose: z.string().trim().min(1).max(500),
  recipient: z.string().trim().min(1).max(200),
  keyPoints: z.string().trim().min(1).max(2000),
  tone: z.enum(["formal", "friendly", "persuasive"]),
  senderName: z.string().trim().max(100).optional().default(""),
});

const EmailSchema = z.object({
  subject: z.string(),
  greeting: z.string(),
  body: z.string(),
  closing: z.string(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const toneGuide: Record<string, string> = {
      formal: "professional, respectful, and concise; suitable for executives or external partners",
      friendly: "warm, approachable, and conversational while still professional",
      persuasive: "compelling, confident, and action-oriented; designed to drive a clear response",
    };

    const prompt = `Write a workplace email with the following details.\n\nPurpose: ${data.purpose}\nRecipient: ${data.recipient}\nKey points to cover:\n${data.keyPoints}\nTone: ${data.tone} — ${toneGuide[data.tone]}\nSender name: ${data.senderName || "(leave a placeholder like [Your Name])"}\n\nRequirements:\n- Subject line: clear and specific, under 80 chars\n- Greeting: appropriate to the recipient and tone\n- Body: 2–4 short paragraphs, plain text, no markdown\n- Closing: professional sign-off line plus sender name on its own line`;

    try {
      const { text } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system:
          'You are an expert email writer. Respond ONLY with a JSON object matching this shape: {"subject": string, "greeting": string, "body": string, "closing": string}. No markdown, no code fences, no extra commentary.',
        prompt,
      });
      const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
      const parsed = EmailSchema.parse(JSON.parse(cleaned));
      return parsed;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429")) {
        throw new Error("AI is rate-limited. Please try again in a moment.");
      }
      if (msg.includes("402")) {
        throw new Error("AI credits exhausted. Please add credits in your workspace.");
      }
      throw new Error("Failed to generate email. Please try again.");
    }
  });