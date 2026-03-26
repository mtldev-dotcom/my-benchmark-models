# Connecting a Real OpenClaw Worker

This guide walks through everything needed to go from mock mode to live agent benchmarking.

---

## What you need

1. A running OpenClaw worker (your agent runtime server)
2. An API key from a model provider (OpenAI, Anthropic, etc.)
3. Two env var changes — that's it

---

## Step 1 — Get a Provider API Key

Pick the provider your OpenClaw worker will call.

### OpenAI

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create an account
3. Click your profile → **API keys**
4. Click **+ Create new secret key**
5. Name it (e.g. `benchmark-dev`) → **Create secret key**
6. Copy the key — it starts with `sk-...` and is only shown once

> Requires a funded account or free trial credits. Billing → [platform.openai.com/settings/organization/billing](https://platform.openai.com/settings/organization/billing)

---

### Anthropic

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign in or create an account
3. Go to **API Keys** in the left sidebar
4. Click **Create Key**
5. Name it → copy the key (starts with `sk-ant-...`)

> Requires credits. Billing → [console.anthropic.com/settings/plans](https://console.anthropic.com/settings/plans)

---

### OpenRouter (access multiple providers with one key)

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign in → **Keys** in the top nav
3. Click **Create Key**
4. Copy the key (starts with `sk-or-...`)

> OpenRouter routes to OpenAI, Anthropic, Mistral, Meta, and others from a single key. Good for multi-provider benchmarking.

---

### Google (Gemini)

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with a Google account
3. Click **Get API key** → **Create API key**
4. Copy the key

> Free tier available with rate limits.

---

## Step 2 — Add the Key to the Dashboard

The dashboard stores provider keys so your OpenClaw worker can retrieve them at runtime.

1. Open the app → click the **⚙ gear icon** (top right of the dashboard)
2. Under **Providers**, click **Add Provider**
3. Select your provider (e.g. OpenAI)
4. Enter a display name and paste your API key
5. Toggle on the models you want available for benchmark runs
6. Click **Add provider**

Your key is stored in Postgres and masked in the UI. The worker will receive it in requests (or can fetch it via the settings API).

---

## Step 3 — Set `OPENCLAW_WORKER_URL`

Open your `.env.local` file and add:

```
OPENCLAW_WORKER_URL=http://localhost:8080
```

Replace `http://localhost:8080` with wherever your OpenClaw worker is running.

Then restart the dev server:

```bash
npm run dev
```

That's the only change needed. The dashboard automatically routes run requests to the real worker instead of the mock.

---

## Step 4 — Make Your Dashboard Reachable (for the webhook)

The worker needs to call back to the dashboard when a test finishes. In local dev this means the worker must be able to reach your machine.

**If worker is on the same machine:**
```
# No extra config needed — worker calls http://localhost:3000
```

**If worker is on a remote server or Docker container:**

Add to `.env.local`:
```
DASHBOARD_BASE_URL=http://your-machine-ip:3000
```

Then expose it via ngrok if needed:
```bash
npx ngrok http 3000
# Use the https://xxxx.ngrok.io URL as DASHBOARD_BASE_URL
```

> In production (Vercel), the dashboard URL is stable — no extra config needed.

---

## Step 5 — What the OpenClaw Worker Must Implement

Your worker needs one HTTP endpoint:

### `POST /run`

**Receives:**

```json
{
  "runId": "run_abc123",
  "testId": "op-01",
  "testName": "Priority Triage",
  "prompt": "Given 8 incoming ops tasks...",
  "baseStateVersion": "2026-03-25-001",
  "baseStateFiles": [
    {
      "filename": "AGENT_CORE.md",
      "content": "# Agent Core Context\n...",
      "capturedAt": "2026-03-25T10:00:00Z"
    }
  ],
  "timeoutMs": 60000,
  "modelSettings": {
    "model": "gpt-4o",
    "provider": "openai",
    "contextWindow": "128k"
  },
  "callbackUrl": "https://your-dashboard.com/api/runs/run_abc123/result"
}
```

**Must respond immediately with 202:**

```json
{ "jobId": "worker-job-xyz" }
```

**Then — after the agent cycle completes — POST to `callbackUrl`:**

```json
{
  "runId": "run_abc123",
  "testId": "op-01",
  "response": "Here are the top 3 prioritised tasks...",
  "tokensIn": 312,
  "tokensOut": 487,
  "durationMs": 4200,
  "logs": [
    "[2026-03-25T10:00:01Z] Worker booted",
    "[2026-03-25T10:00:01Z] Base state 2026-03-25-001 loaded (2 files)",
    "[2026-03-25T10:00:01Z] Running test: Priority Triage",
    "[2026-03-25T10:00:05Z] Test complete",
    "[2026-03-25T10:00:05Z] Factory reset complete"
  ],
  "mdSnapshots": [
    {
      "filename": "AGENT_CORE.md",
      "content": "# Agent Core Context\n...",
      "capturedAt": "2026-03-25T10:00:05Z"
    }
  ],
  "workerMeta": {
    "workerId": "worker-01",
    "bootedAt": "2026-03-25T10:00:01Z",
    "resetAt": "2026-03-25T10:00:05Z",
    "baseStateVersion": "2026-03-25-001"
  }
}
```

> If the test fails or times out, include `"error": "reason here"` in the response. The dashboard handles it gracefully.

---

### Worker lifecycle rules (for fairness)

Each test run **must** follow this order — no exceptions:

1. Verify the instance is in a clean base state (factory reset if needed)
2. Load `baseStateFiles` from the request into the agent's context
3. Boot the isolated agent instance
4. Run the `prompt` with the configured model
5. Capture: response text, token counts, duration, logs, final MD file states
6. POST `OpenClawWorkerResponse` to `callbackUrl`
7. Factory reset the instance back to clean base state

The worker must not accept a new request until step 7 is complete.

---

## Step 6 — Test the Connection

1. Restart the dev server (`npm run dev`)
2. Open the dashboard → pick any instance
3. Click **Start**
4. The card should show `Running...`
5. Watch your worker logs — you should see the request arrive
6. After the worker calls back: card updates to `Tested`, score appears
7. Click **View Results** → **Run History** → **Evidence** — real logs and MD diffs should appear

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Card stays on "Running" forever | Worker not calling back | Check `callbackUrl` is reachable from the worker |
| `OpenClaw worker rejected request: 404` | Worker URL wrong or `/run` route missing | Verify `OPENCLAW_WORKER_URL` and worker route |
| Evidence shows empty logs | Worker returned empty `logs: []` | Add logging to your worker lifecycle |
| Score is always 0 | Worker returned empty `response` | Check model API key is valid and has credits |
| `Failed to trigger run` in browser | Dashboard can't reach Postgres | Check Docker is running and `DATABASE_URL` is set |
