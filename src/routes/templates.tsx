import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — MailCraft" },
      {
        name: "description",
        content: "Common workplace email templates: meeting requests, follow-ups, intros, status updates, and more.",
      },
    ],
  }),
  component: TemplatesPage,
});

type Tpl = {
  title: string;
  description: string;
  tone: "formal" | "friendly" | "persuasive";
  purpose: string;
  recipient: string;
  keyPoints: string;
};

const templates: Tpl[] = [
  {
    title: "Meeting request",
    description: "Propose a meeting with clear agenda and time options.",
    tone: "formal",
    purpose: "Request a 30-minute meeting to align on project priorities",
    recipient: "Cross-functional teammate",
    keyPoints:
      "- Suggest two time slots next week\n- Share short agenda (3 items)\n- Ask them to add anything before the call",
  },
  {
    title: "Project status update",
    description: "Share progress, blockers, and next steps with stakeholders.",
    tone: "formal",
    purpose: "Weekly project status update for stakeholders",
    recipient: "Project stakeholders",
    keyPoints:
      "- Progress this week\n- Current blockers and mitigation\n- Plan for next week\n- Asks / decisions needed",
  },
  {
    title: "Follow-up after no reply",
    description: "Gently nudge after a previous email went unanswered.",
    tone: "friendly",
    purpose: "Polite follow-up to a previous email that didn't get a reply",
    recipient: "Previous contact",
    keyPoints:
      "- Reference original email and date\n- Restate the ask in one sentence\n- Offer a quick call as an alternative",
  },
  {
    title: "Introduction email",
    description: "Introduce yourself to a new teammate or contact.",
    tone: "friendly",
    purpose: "Introduce myself to a new colleague",
    recipient: "New teammate",
    keyPoints:
      "- Brief intro: role and team\n- What I'm currently working on\n- Suggest a 15-min intro coffee chat",
  },
  {
    title: "Pitch a new idea",
    description: "Make the case for a proposal with clear benefits.",
    tone: "persuasive",
    purpose: "Pitch a new initiative to leadership",
    recipient: "Department lead",
    keyPoints:
      "- Problem and impact\n- Proposed solution\n- Expected outcome and metrics\n- Ask: 20-min slot to discuss",
  },
  {
    title: "Decline politely",
    description: "Say no while preserving the relationship.",
    tone: "friendly",
    purpose: "Decline a request while remaining helpful",
    recipient: "Requester",
    keyPoints:
      "- Thank them for the ask\n- Clearly decline with a brief reason\n- Suggest an alternative or future timing",
  },
  {
    title: "Request feedback",
    description: "Ask a colleague for review on your work.",
    tone: "friendly",
    purpose: "Ask a colleague for feedback on a draft",
    recipient: "Trusted colleague",
    keyPoints:
      "- Context on the draft and goal\n- Specific areas to focus on\n- Deadline for feedback",
  },
  {
    title: "Apology / service recovery",
    description: "Acknowledge an issue and outline a fix.",
    tone: "formal",
    purpose: "Apologize for a recent issue and explain next steps",
    recipient: "Affected customer or partner",
    keyPoints:
      "- Acknowledge what happened\n- Take responsibility\n- Concrete next steps and timeline\n- How to reach you",
  },
];

function TemplatesPage() {
  const navigate = useNavigate();

  function use(tpl: Tpl) {
    const payload = encodeURIComponent(
      JSON.stringify({
        purpose: tpl.purpose,
        recipient: tpl.recipient,
        keyPoints: tpl.keyPoints,
        tone: tpl.tone,
      }),
    );
    navigate({ to: "/", search: { template: payload } });
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Templates</h1>
        <p className="text-sm text-muted-foreground">
          Start from a common workplace scenario and customize before generating.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Card key={t.title} className="flex flex-col shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">{t.title}</CardTitle>
                <Badge variant="secondary" className="capitalize">
                  {t.tone}
                </Badge>
              </div>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button variant="outline" className="w-full" onClick={() => use(t)}>
                Use template <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}