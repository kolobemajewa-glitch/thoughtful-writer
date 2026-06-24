import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Loader2, RefreshCw, Sparkles, AlertTriangle, Check } from "lucide-react";
import { z } from "zod";

import { generateEmail } from "@/lib/email.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type IndexSearch = { template?: string };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): IndexSearch => ({
    template: typeof s.template === "string" ? s.template : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Email Generator — MailCraft" },
      {
        name: "description",
        content: "Generate professional workplace emails with AI. Choose a tone and ship a polished draft.",
      },
    ],
  }),
  component: GeneratorPage,
});

type Tone = "formal" | "friendly" | "persuasive";

const FormSchema = z.object({
  purpose: z.string().trim().min(3, "Add a short purpose").max(500),
  recipient: z.string().trim().min(2, "Who's it for?").max(200),
  keyPoints: z.string().trim().min(5, "Add at least one key point").max(2000),
  tone: z.enum(["formal", "friendly", "persuasive"]),
  senderName: z.string().trim().max(100),
});

type EmailDraft = {
  subject: string;
  greeting: string;
  body: string;
  closing: string;
};

function GeneratorPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [senderName, setSenderName] = useState("");
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [copied, setCopied] = useState(false);

  // Pre-fill from template selection
  useEffect(() => {
    if (search.template) {
      try {
        const t = JSON.parse(decodeURIComponent(search.template));
        if (t.purpose) setPurpose(t.purpose);
        if (t.recipient) setRecipient(t.recipient);
        if (t.keyPoints) setKeyPoints(t.keyPoints);
        if (t.tone) setTone(t.tone);
        navigate({ to: "/", search: {} as IndexSearch, replace: true });
      } catch {
        /* ignore */
      }
    }
  }, [search.template, navigate]);

  const generateFn = useServerFn(generateEmail);
  const mutation = useMutation({
    mutationFn: async (input: z.infer<typeof FormSchema>) => {
      return (await generateFn({ data: input })) as EmailDraft;
    },
    onSuccess: (data) => {
      setDraft(data);
      toast.success("Email draft ready");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  function handleGenerate() {
    const parsed = FormSchema.safeParse({ purpose, recipient, keyPoints, tone, senderName });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please complete the form");
      return;
    }
    mutation.mutate(parsed.data);
  }

  const fullText = useMemo(() => {
    if (!draft) return "";
    return `Subject: ${draft.subject}\n\n${draft.greeting}\n\n${draft.body}\n\n${draft.closing}`;
  }, [draft]);

  const wordCount = useMemo(() => (fullText.trim() ? fullText.trim().split(/\s+/).length : 0), [fullText]);
  const charCount = fullText.length;

  async function handleCopy() {
    if (!fullText) return;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy");
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" /> AI-powered
          </Badge>
          <Badge variant="outline">Workplace emails</Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Draft a professional email
        </h1>
        <p className="text-sm text-muted-foreground">
          Tell us the purpose, recipient, and key points. We'll craft a complete draft you can edit and send.
        </p>
      </div>

      <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Review before sending</AlertTitle>
        <AlertDescription>
          AI-generated emails may contain inaccuracies. Always review and edit drafts before sending.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Email details</CardTitle>
            <CardDescription>The more specific, the better the draft.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Email purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g. Request a meeting to review Q3 roadmap"
                value={purpose}
                maxLength={500}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Sarah, Director of Product"
                value={recipient}
                maxLength={200}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keypoints">Key points to include</Label>
              <Textarea
                id="keypoints"
                placeholder={`• Propose 30-min meeting next week\n• Share updated timeline\n• Ask for input on hiring plan`}
                rows={6}
                value={keyPoints}
                maxLength={2000}
                onChange={(e) => setKeyPoints(e.target.value)}
              />
              <p className="text-right text-xs text-muted-foreground">{keyPoints.length}/2000</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender">Your name (optional)</Label>
                <Input
                  id="sender"
                  placeholder="e.g. Alex Chen"
                  value={senderName}
                  maxLength={100}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                onClick={handleGenerate}
                disabled={mutation.isPending}
                className="bg-[var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)] hover:opacity-95"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate email
                  </>
                )}
              </Button>
              {draft && (
                <Button
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={mutation.isPending}
                >
                  <RefreshCw className="h-4 w-4" /> Regenerate
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle>Generated email</CardTitle>
              <CardDescription>Edit any field, then copy.</CardDescription>
            </div>
            {draft && (
              <Button size="sm" variant="outline" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {!draft && !mutation.isPending && (
              <div className="flex h-64 flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-center">
                <Sparkles className="h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Your generated email will appear here.
                </p>
              </div>
            )}
            {mutation.isPending && !draft && (
              <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border bg-muted/30">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
            {draft && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="subj">Subject</Label>
                  <Input
                    id="subj"
                    value={draft.subject}
                    onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="greet">Greeting</Label>
                  <Input
                    id="greet"
                    value={draft.greeting}
                    onChange={(e) => setDraft({ ...draft, greeting: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Body</Label>
                  <Textarea
                    id="body"
                    rows={10}
                    value={draft.body}
                    onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="close">Closing</Label>
                  <Textarea
                    id="close"
                    rows={3}
                    value={draft.closing}
                    onChange={(e) => setDraft({ ...draft, closing: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>{wordCount} words</span>
                  <span>{charCount} characters</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
