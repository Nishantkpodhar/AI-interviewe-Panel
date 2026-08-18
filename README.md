# Natively (AIAssistent) — AI Interview / Meeting Copilot

Natively is a cross-platform **Electron desktop copilot** that listens to your meetings (microphone + system audio), reads your screen, and uses on-device and cloud LLMs to give you live, in-the-moment assistance — "what should I say next", recaps, clarifications, coding hints, follow-ups, and post-meeting notes.

It is architected as a **multi-process Electron app** with a **Rust native module** for low-latency audio capture / keyboard interception, a **React renderer** for the UI, a **companion browser extension** for web-tab context, and a deep **LLM/Intelligence layer** with pluggable providers, local models, and RAG.

---

## Table of Contents
- [Architecture](#architecture)
- [Project Flow (End-to-End Workflow)](#project-flow-end-to-end-workflow)
- [Tech Stack](#tech-stack)
- [Key Components](#key-components)
- [Features](#features)
- [LLM & STT Providers](#llm--stt-providers)
- [Setup & Build](#setup--build)
- [Configuration (.env)](#configuration-env)
- [Scripts Reference](#scripts-reference)
- [Testing](#testing)
- [License](#license)

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           ELECTRON MAIN PROCESS                            │
│  (electron/main.ts, ipcHandlers.ts, AppState, WindowHelper)                │
│                                                                           │
│  ┌──────────────┐   ┌────────────────┐   ┌─────────────────────────────┐ │
│  │ WindowHelper │   │  AppState      │   │ IntelligenceManager         │ │
│  │ (launcher /  │   │ (singleton,    │   │  → IntelligenceEngine       │ │
│  │  overlay /   │   │  IPC hub,      │   │   → LLMHelper (provider     │ │
│  │  popover /   │   │  audio, RAG,   │   │      routing + streaming)   │ │
│  │  tray)       │   │  updates)      │   │   → MeetingPersistence      │ │
│  └──────────────┘   └───────┬────────┘   └──────────────┬──────────────┘ │
│                             │                           │                 │
│        ┌────────────────────┼───────────────────────────┤                 │
│        ▼                    ▼                           ▼                 │
│  ┌──────────────┐  ┌──────────────┐          ┌──────────────────────┐   │
│  │ Audio Capture│  │   RAG        │          │  DatabaseManager     │   │
│  │ (mic + sys)  │  │ (sqlite-vec, │          │  (better-sqlite3)    │   │
│  │ + STT        │  │  Ollama emb, │          │  meetings / memory   │   │
│  │ providers)   │  │  reranker)   │          │  / usage / profiles  │   │
│  └──────┬───────┘  └──────────────┘          └──────────────────────┘   │
│         │                                                                 │
│         ▼  (NAPI-RS bindings)                                            │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │            NATIVE MODULE  (Rust, @napi-rs)  — native-module/      │   │
│  │  MicrophoneCapture · SystemAudioCapture · StealthKeyboardTap     │   │
│  │  applyStealthToWindow · resampler · VAD · silence suppression    │   │
│  │  audio device enum · hardware id · Dodo/Gumroad license check    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
        ▲ IPC (contextBridge / preload)                ▲ loopback WS/HTTP
        │                                              │
┌───────┴───────────────────┐              ┌───────────┴────────────────────┐
│  RENDERER (React 19 + Vite)│              │  BROWSER EXTENSION             │
│  src/ + renderer/src/      │              │  natively-browser/             │
│  Launcher, Overlay,        │              │  content-script captures       │
│  Settings, MeetingChat,    │◄─────────────│  active tab DOM → sends to     │
│  ModelSelector, Onboarding │  paired conn │  desktop app over loopback     │
└────────────────────────────┘              └─────────────────────────────────┘
```

### Process / Module Breakdown

| Layer | Path | Responsibility |
|-------|------|----------------|
| **Main** | `electron/main.ts`, `electron/ipcHandlers.ts`, `electron/AppState` | Boot, native-arch gate, crash/DB safety, IPC hub, audio pipeline orchestration, windows, auto-updater, permissions. |
| **Window Mgmt** | `electron/WindowHelper.ts`, `CropperWindowHelper.ts`, `ModelSelectorWindowHelper.ts`, `SettingsWindowHelper.ts` | Launcher vs overlay modes, stealth passthrough, popover catcher, cropper, model selector. |
| **Intelligence** | `electron/IntelligenceManager.ts` → `IntelligenceEngine.ts`, `electron/llm/*`, `electron/intelligence/*` | Answer generation modes, planning, context fusion, profile intelligence, RAG orchestration, live transcript brain. |
| **LLM** | `electron/LLMHelper.ts`, `electron/llm/ProviderRouter.ts` | Multi-provider routing (Gemini/Groq/OpenAI/Claude/Deepseek/LiteLLM/Ollama/Codex/Natively/Custom), streaming, fallback, vision policy, thinking budgets. |
| **Audio** | `electron/audio/*` | Mic capture, system-audio (CoreAudio/Screen Capture Kit) tap, STT providers, transcript coalescing, lifecycle queue. |
| **RAG / Memory** | `electron/rag/*`, `electron/db/*` | Local embeddings (Ollama / on-device), `sqlite-vec` vector store, semantic chunking, reranker, live indexing. |
| **Native** | `native-module/` (Rust) | PCM capture at 16 kHz, VAD, resampling, keyboard tap (CGEventTap), stealth window attributes, license validation, HWID. |
| **Renderer** | `src/` (React app), `renderer/src/` | UI: Launcher, Overlay, Meeting chat, Settings, Model selector, Onboarding, trial/plans, dynamic actions. |
| **Browser Ext** | `natively-browser/` | Companion extension capturing the active web tab and forwarding context to the desktop app over a paired loopback connection. |
| **Build/Tools** | `scripts/`, `vite.config.mts`, `electron-builder.*`, `native-module` (napi-rs/esbuild) | Bundling, native rebuild, model download, packaging, notarization, benchmarks, E2E. |

---

## Project Flow (End-to-End Workflow)

1. **Boot & Native-Arch Gate**
   - `main.ts` first imports `nativeArchGate` to verify the packaged native binaries match the host chip (x64/arm64). Mismatches show a fix dialog and exit.
   - Crash/DB safety scaffolding (uncaughtException, unhandledRejection windowing, SIGTERM/SIGINT, emergency DB close) is installed before anything else.

2. **Window & Permission Setup**
   - `WindowHelper` creates the **Launcher** window (or **Overlay** in meeting mode). Tray is created; stealth/disguise state is reapplied.
   - macOS TCC checks: microphone (`askForMediaAccess`), screen recording (`systemPreferences.getMediaAccessStatus` + `desktopCapturer` probe, cached 3 s).

3. **Audio Capture → STT**
   - `AppState.setupSystemAudioPipeline()` + mic capture start. The **Rust `SystemAudioCapture`/`MicrophoneCapture`** deliver 16 kHz PCM buffers.
   - PCM is fed to an **STT provider** (`LocalWhisperSTT`, `Deepgram`, `OpenAI`, `Google`, `ElevenLabs`, `Soniox`, `NativelyPro`, `Rest`). `openaiTranscriptTurnCoalescer` groups final/partial segments.
   - Transcript segments flow into `SessionTracker` (speaker→role mapping: interviewer/user/assistant) and are emitted to renderer surfaces (throttled).

4. **Intelligence / Answer Generation**
   - Each transcript segment is handed to `IntelligenceManager` → `IntelligenceEngine`.
   - Based on the active **mode** (Assist / What-Should-I-Say / Recap / Clarify / FollowUp / Manual / CodeHint / Brainstorm), it assembles context (recent transcript, RAG retrieval, screen/DOM context, profile intelligence) and calls `LLMHelper` with provider routing + streaming.
   - `DynamicActionEngine` can proactively surface actions; `ProfileIntelligence` and `RAG` enrich answers with grounding/evidence.

5. **Screen & Web Context**
   - `ScreenshotHelper` captures full/selective screenshots (hide windows, stitch multi-display, crop to selection).
   - The **browser extension** streams the active tab's readable DOM to the desktop app over a paired loopback connection, giving the LLM web-page context.

6. **Persistence & RAG Indexing**
   - Live transcript/answers are cached in `SessionTracker` and (optionally) cached into the **RAG** vector store for in-meeting retrieval.
   - On `endMeeting()`, `MeetingPersistence.processAndSaveMeeting()` summarizes (templates + tone), stores to `better-sqlite3`, indexes into RAG, and optionally retains to long-term memory (Hindsight, if enabled).

7. **Output & Review**
   - Renderer shows streamed answers in the overlay/chat, meeting recap/details, follow-up email drafts (PDF/Markdown export via `jspdf`, `pdf-parse`).
   - Unprocessed meetings are recoverable via `recoverUnprocessedMeetings()`.

8. **Updates & Licensing**
   - `electron-updater` handles auto-update (GitHub provider). Native module exposes `verifyGumroadKey` / `verifyDodoKey` for license gating; HWID locks activations.

---

## Tech Stack

| Area | Technology |
|------|------------|
| **Desktop Shell** | Electron 43, `electron-builder` (DMG/ZIP/NSIS/AppImage/deb), `electron-updater`. |
| **UI** | React 19, TypeScript 5/7, Vite 5 (`vite-plugin-electron`), Tailwind 3, Framer Motion, Radix UI, `lucide-react`, `react-markdown` + `remark-gfm`/`remark-math`/`rehype-katex`, `react-syntax-highlighter`, liquid-glass / paper-design shaders, `thinking-orbs`. |
| **State/Data** | `electron-store`, `better-sqlite3` (12.x) + `sqlite-vec` (vector search), `keytar` (secure creds), TanStack Query. |
| **Native** | Rust via **NAPI-RS** (`@napi-rs/cli`), CoreAudio / Screen Capture Kit (macOS), WASAPI (Windows); CGEventTap for keyboard; VAD + resampler + silence suppression. |
| **LLM SDKs** | `@google/genai`, `groq-sdk`, `openai`, `@anthropic-ai/sdk`, `deepseek` (OpenAI-compat), LiteLLM (Curl/OpenAI-compat), `ollama`, `mongoose` (Natively backend), custom Curl providers. |
| **STT / Audio** | `@deepgram/sdk`, `@elevenlabs/*`, `@google-cloud/speech`, OpenAI/Whisper, local Whisper (ONNX/`onnxruntime-node`), Soniox, `ws`, `screenshot-desktop`, `sharp`. |
| **Local Models / ML** | `onnxruntime-node`/`onnxruntime-web`, `@huggingface/transformers` (Xenova models in `models/`, `resources/models`), `tesseract.js` (OCR), Ollama embeddings + reranker. |
| **Browser Ext** | Manifest V3, `@mozilla/readability`, esbuild, service worker, content script, paired loopback transport. |
| **Tooling/Test** | Playwright, `node --test`, `husky`, `patch-package`, `rimraf`, `concurrently`, Python (`scripts/*.py`), `react-doctor`. |

---

## Key Components

**Main process**
- `electron/main.ts` — entry, crash/DB safety, permissions, DNS override for `api.natively.software`, Fontations mitigation, log rotation.
- `electron/ipcHandlers.ts` + `electron/AppState` — the central singleton: audio pipeline, STT lifecycle, RAG bootstrap, updater, screenshots, disguise/stealth, IPC surface.
- `electron/WindowHelper.ts` — launcher/overlay/popover window lifecycle and stealth passthrough.

**Intelligence**
- `electron/IntelligenceManager.ts` / `IntelligenceEngine.ts` — orchestrates answer modes, speculative generation, dynamic actions, follow-ups, recaps.
- `electron/llm/*` — `LLMHelper` (provider routing + streaming + fallback), `ProviderRouter`, `AnswerLLM`, `AssistLLM`, `WhatToAnswerLLM`, `RecapLLM`, `ClarifyLLM`, `FollowUpLLM`, `BrainstormLLM`, `CodeHintLLM`, intent classifier, planner, profile intelligence.
- `electron/intelligence/*` — context fusion, live transcript brain, memory services, profile tree, search orchestration, RRF fusion.

**Audio**
- `electron/audio/SystemAudioCapture.ts` (wraps native), `MicrophoneCapture.ts`, `*StreamingSTT.ts`, `LocalWhisperSTT.ts`, `openaiTranscriptTurnCoalescer.ts`, `meetingLifecycleQueue.ts`.

**RAG / DB**
- `electron/rag/RAGManager.ts`, `EmbeddingPipeline.ts`, `VectorStore.ts`, `LocalReranker.ts`, `SemanticChunker.ts`, `LiveRAGIndexer.ts`.
- `electron/db/DatabaseManager.ts` — `better-sqlite3` wrapper (meetings, usage, profiles, memory) with safe WAL handling.

**Native (Rust)**
- `native-module/src/lib.rs` + `microphone.rs`, `speaker/*` (core_audio/sck/windows), `keyboard_tap.rs`, `stealth_window.rs`, `resampler.rs`, `vad.rs`, `silence_suppression.rs`, `license.rs`, `process_name.rs`.

**Renderer / UI**
- `src/App.tsx`, `src/components/Launcher.tsx`, `NativelyInterface.tsx`, `MeetingChatOverlay.tsx`, `OverlayAuxWindows.tsx`, `ModelSelectorWindow.tsx`, `SettingsOverlay.tsx`, `Cropper.tsx`, `dynamic-actions/*`, `onboarding/*`, `settings/*`, `trial/*`, `premium/*`.

**Browser Extension**
- `natively-browser/src/content-script.ts`, `service-worker.ts`, `capture/*` (smart-capture, classifier, extractors, registry), `extract.ts`, `popup.ts`.

---

## Features

- **Live meeting copilot** — real-time "what should I say", recap, clarification, follow-up questions, manual Q&A.
- **Multi-source audio** — microphone + system audio (CoreAudio tap / Screen Capture Kit), with VAD, resampling, bluetooth/HFP degradation detection, output-device-follow on switch.
- **Local + cloud AI** — run fully offline with Ollama/Whisper/ONNX, or use Gemini/Groq/OpenAI/Claude/Deepseek/LiteLLM/Natively; automatic fallback and vision routing.
- **Coding interview mode** — detect coding questions from transcript/screenshot, extract problem statement, generate solutions/debug with images.
- **RAG & long-term memory** — on-device vector search (`sqlite-vec` + Ollama embeddings + reranker); optional Hindsight cross-meeting memory.
- **Screen & web context** — selective/full screenshots (multi-display stitch, crop), plus companion browser extension feeding active-tab DOM.
- **Stealth & disguise** — overlay mouse passthrough, window stealth attributes (native), disguise modes (terminal/settings/activity), launcher taskbar stealth.
- **Dynamic actions** — proactive, context-triggered suggestions/actions during a meeting.
- **Profile intelligence** — build/use a personal profile to tailor answers (just-in-time prompt building, evidence validation).
- **Meeting artifacts** — recaps, follow-up email drafts, PDF/Markdown export, meeting details, recovery of unprocessed meetings.
- **Multi-mode intelligence** — Assist, What-Should-I-Say, Recap, Clarify, FollowUp, Manual, CodeHint, Brainstorm, custom modes.
- **Cross-platform packaging** — macOS (x64/arm64, DMG/ZIP), Windows (NSIS/portable), Linux (AppImage/deb).
- **Licensing & trials** — Gumroad/Dodo license validation (native HWID lock), free-trial modal, plans/quotas.
- **Observability** — verbose logging, crash diagnostics, lifecycle tracker, vision benchmarks, profile-intelligence benchmarks.

---

## LLM & STT Providers

**LLM (routed by `LLMHelper` / `ProviderRouter`)**
- Google Gemini (`@google/genai`), Groq, OpenAI, Anthropic Claude, Deepseek, LiteLLM (OpenAI-compat), Ollama (local), Codex CLI, **Natively API** (managed backend), and user-defined **Custom / Curl** providers.
- Features: streaming, circuit-breaker retry, prompt caching, thinking budgets, vision fallback cascade, scope/privacy gating.

**STT (speech-to-text)**
- Local Whisper (ONNX), Deepgram, OpenAI, ElevenLabs, Google Speech (service account), Soniox, NativelyPro, generic REST.

**Embeddings / Rerank (RAG)**
- Ollama embeddings, local ONNX reranker (`LocalReranker`), `sqlite-vec` vector store; HuggingFace transformers (`Xenova`) models bundled in `models/` / `resources/models/`.

---

## Setup & Build

### Prerequisites
- **Node.js** 20+ (uses `typescript7`, `node --test`).
- **Rust toolchain** (for the native module; installed automatically via NAPI-RS / `@napi-rs/cli`) — required for `postinstall` native rebuild.
- **Platform SDKs**: on macOS, Xcode Command Line Tools (CoreAudio / Screen Capture Kit). On Windows, Build Tools for C++ (WASAPI).
- **(Optional)** Ollama for fully-local AI; or API keys for cloud providers (see `.env.example`).

### Install
```bash
# 1. Clone
git clone <repo> && cd natively-cluely-ai-assistant-main

# 2. Install dependencies (postinstall rebuilds the native Rust module,
#    downloads ONNX/HF models, ensures sqlite-vec, patches electron plist)
npm install

# 3. Configure environment (copy and fill in keys you intend to use)
cp .env.example .env
```

> The `postinstall` script runs: `patch-package` → rebuild `sharp` → rebuild native Electron module → `download-models` → `ensure-sqlite-vec` → patch plist → verify native arch.

### Develop (hot-reload renderer + Electron)
```bash
npm run app:dev        # Vite dev server on :5180 + Electron main
# or
npm start              # alias for app:dev
```

### Build (production)
```bash
npm run build          # tsc + vite build (renderer)
npm run build:electron # esbuild bundle of electron/main
npm run app:build      # full packaged app (build + native + package)
npm run app:build:signed  # signed macOS build + upload release
```

### Run the desktop app directly (after build)
```bash
npm run electron:dev   # build + launch Electron in dev
npm run electron:build # build + launch Electron in production
```

### Native module only
```bash
npm run rebuild:native # rebuild Rust NAPI module for current arch
npm run build:native   # scripts/build-native.js
```

### Browser extension
```bash
cd natively-browser
npm install
npm run build          # esbuild → loadable MV3 extension
npm run typecheck
npm test
```

---

## Configuration (.env)

Copy `.env.example` → `.env`. Key groups:

| Variable | Purpose |
|----------|---------|
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth (calendar/account features). |
| `GROQ_API_KEY`, `OPENAI_API_KEY`, `CLAUDE_API_KEY`, `GEMINI_API_KEY` | Cloud LLM providers. |
| `GOOGLE_APPLICATION_CREDENTIALS` | Google Speech service-account JSON (only if using Google STT). |
| `DEEPGRAM_API_KEY`, `ELEVENLABS_API_KEY`, `AZURE_SPEECH_KEY/REGION`, `IBM_WATSON_*` | Optional STT providers. |
| `USE_OLLAMA`, `OLLAMA_MODEL`, `OLLAMA_URL` | Local LLM (fully offline mode). |
| `DEFAULT_MODEL` | Default vision/chat model (e.g. `gemini-3-flash-preview`). |
| `HINDSIGHT_*` | Optional long-term memory server (default disabled). |

Secrets are also storable at runtime via the Settings UI (persisted with `keytar` / `electron-store`).

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` / `build` | Vite dev / production build of the renderer. |
| `npm run build:electron` | Bundle Electron main/preload via esbuild. |
| `npm run app:dev` | Dev loop: Vite + Electron. |
| `npm run app:build` / `app:build:signed` | Package the full app (incl. native + models). |
| `npm run rebuild:native` | Rebuild the Rust native module for the host arch. |
| `npm test` | Electron service/lib/llm/audio/rag unit tests. |
| `npm run test:intelligence` / `test:services` / `test:meeting-notes` | Targeted intelligence/service suites. |
| `npm run test:e2e` | Playwright end-to-end. |
| `npm run benchmark:profile` / `benchmark:vision` / `benchmark:wta` | Profile-intelligence / vision / "what-to-answer" benchmarks. |
| `npm run doctor` | `react-doctor` sanity check. |

(See `package.json` for the full script catalog, including CI tiers `ci:tier1..4` and release gating.)

---

## Testing

- **Unit/integration (Node):** `node --test` based suites under `electron/**/__tests__`, `scripts/__tests__`, `src/lib/**/__tests__`.
- **E2E:** Playwright specs under `tests/e2e` (`npm run test:e2e`).
- **Extension:** `node --test` under `natively-browser/src/__tests__`.
- **Benchmarks/evals:** profile-intelligence and vision-benchmark harnesses under `benchmarks/` and `electron/visionBenchmark/`.

Run the full CI gate locally with:
```bash
npm run typecheck:electron && npm run build && npm test && npm run test:intelligence && npm run test:lib && npm run test:scripts
```

---

## License

Proprietary — see `LICENSE`. Companion modules (`native-module`, `natively-browser`) carry `SEE LICENSE IN LICENSE`.
