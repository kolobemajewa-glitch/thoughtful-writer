# MailCraft - Smart Email Generator 🚀

**MailCraft** is a modern, responsive web application designed to help professionals, job seekers, and teams instantly create polished, context-aware email drafts. Powered by advanced AI models, MailCraft takes simple inputs and converts them into professional, structured email communications tailored to your desired tone.

---

## ✨ Features

- **Context-Aware AI Generation**: Turn basic bullet points, recipient info, and purpose details into high-quality drafts including subject lines, greetings, body text, and closings.
- **Multiple Writing Tones**: Choose from **Formal** (for executives, clients, and official proposals), **Friendly** (for close colleagues and casual check-ins), and **Persuasive** (for pitches, sales, or convincing proposals).
- **Workplace Templates**: Jumpstart your drafts with standard presets like:
  - Meeting request
  - Project status update
  - Pitching a new idea
  - Follow-up after an interview
  - Apology / correction
- **Intelligent Word & Character Counting**: Live counts for both input descriptors and generated drafts.
- **Interactive Drafting & Copying**: View fully generated structured drafts and copy them to your clipboard with a single click.
- **Responsible AI Warning**: Prominent disclaimers advising review prior to sending.
- **SaaS-Inspired Minimal Design**: Clean, fully responsive layout built with Tailwind CSS v4 and Shadcn components.

---

## 🛠️ Technology Stack

MailCraft is engineered on a modern full-stack TypeScript architecture:

- **Frontend & Routing**: [TanStack Start v1](https://tanstack.com/router/v1) — A React 19 framework featuring file-based routing and Server SSR capabilities.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with native CSS variables and Lightning CSS.
- **Icons & Components**: [Lucide React](https://lucide.dev/) & custom [Radix UI](https://www.radix-ui.com/) accessible primitives.
- **Validation**: [Zod](https://zod.dev/) for type-safe client-to-server schemas.
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/docs) connected via serverless routes and gateway functions to state-of-the-art AI models.

---

## 🚀 Getting Started

### Prerequisites

You need **Bun** installed on your system.

```bash
# Verify bun installation
bun --version
```

### Installation

1. Clone the repository (if downloaded or linked from GitHub):
   ```bash
   git clone <your-repository-url>
   cd smart-email-generator
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Development Server

Launch the Vite local development server:

```bash
bun dev
```

The app will start running, usually at `http://localhost:8080` (or the fallback port indicated in your console).

### Production Build

Create a optimized bundle ready for serverless edge workers:

```bash
bun build
```

To preview the production build locally:

```bash
bun preview
```

---

## 🛡️ Security & Responsible AI

- **Data Privacy**: Input processing is handled securely server-side. Private APIs and gateway secrets remain fully isolated from public client bundles.
- **Schema Protection**: Input validation is enforced on both the client and the server function boundaries using strict Zod schemas.
- **AI Accountability**: In accordance with responsible AI guidelines, all drafts contain explicit reminders that generated material is a draft and must be reviewed before sending.

---

*MailCraft is built with 💙 using Lovable.*
