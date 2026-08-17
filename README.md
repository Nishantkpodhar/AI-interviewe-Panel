AI-Interviewe-Pane — Free Local-First AI Interview Assistant

<p align="center">   <img src="assets/icon.png" width="120" alt="AI-Interviewe-Pane"> </p>

<p align="center">
  <strong>⚡ 100% Free · Local-First · AI-Powered · Responsive Desktop Interview Workspace</strong>
</p>

<p align="center">
  <em>Prepare, practice, analyze, and organize technical interviews from one beautiful desktop application.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Cost-Free-22c55e?style=for-the-badge" alt="Free">
  <img src="https://img.shields.io/badge/React-TypeScript-61dafb?style=for-the-badge" alt="React TypeScript">
  <img src="https://img.shields.io/badge/Electron-Desktop-47848f?style=for-the-badge" alt="Electron">
  <img src="https://img.shields.io/badge/MongoDB-Local-47A248?style=for-the-badge" alt="MongoDB">
  <img src="https://img.shields.io/badge/Rust-Native-F74C00?style=for-the-badge" alt="Rust">
</p>

✨ Why AI-Interviewe-Pane?

AI-Interviewe-Pane is completely free to use.

The application is designed as a local-first AI workspace for interview preparation, technical discussions, meetings, learning, and professional workflows.

What you get

🚀

Capability



🎙️

Real-time audio

Native Rust audio pipeline

🧠

AI assistance

Multiple LLM providers + local AI

📝

Speech-to-text

Cloud and local STT options

🖥️

Screen context

Screenshot and OCR analysis

🔎

RAG memory

Semantic retrieval from stored context

📚

Interview history

Sessions, transcripts and summaries

📄

Reference files

PDF, DOCX and TXT context

🎯

Interview modes

Technical, behavioral and custom personas

💾

Local persistence

MongoDB on localhost

📱

Responsive UI

Adaptive desktop and narrow-window layouts

⚡

Native performance

Electron + Rust + N-API

🎨 Interface Philosophy

AI-Interviewe-Pane should feel like a modern developer tool, not an ordinary form-based desktop application.

Visual goals

Clean dark-first interface

Glass / layered panels where appropriate

Strong visual hierarchy

Compact professional typography

Consistent spacing and radius tokens

Responsive sidebar

Keyboard-friendly navigation

Smooth transitions without excessive animation

Clear loading, empty, error and success states

No horizontal overflow

No fixed layouts that break on smaller windows

Target layout

┌──────────────────────────────────────────────────────────────────┐
│  AI-Interviewe-Pane                              ● Ready   ⚙    │
├───────────────┬──────────────────────────────────────────────────┤
│               │                                                  │
│  🏠 Overview  │              Main Workspace                     │
│  🎤 Interview │                                                  │
│  💬 Assistant │     ┌──────────────────────────────────────┐     │
│  📚 History   │     │  Current Question / Transcript       │     │
│  🧠 Knowledge │     │                                      │     │
│  📄 Files     │     │  AI response / context / code        │     │
│  ⚙ Settings   │     │                                      │     │
│               │     └──────────────────────────────────────┘     │
│               │                                                  │
│               │     ┌──────────────────────────────────────┐     │
│               │     │ Ask AI · Voice · Screenshot · Send  │     │
│               │     └──────────────────────────────────────┘     │
└───────────────┴──────────────────────────────────────────────────┘

Responsive behavior

Desktop
Sidebar ───────► Main Workspace ───────► Context Panel

Tablet
Compact Sidebar ─────────► Main Workspace

Narrow Window
Menu / Drawer ───────────► Main Workspace
Bottom actions remain accessible



<p align="center">   <strong>Real-time AI assistance for meetings, presentations, learning, and professional workflows.</strong> </p>

<p align="center">   React · TypeScript · Vite · Electron · Rust · Tailwind CSS · MongoDB · RAG </p>

Overview

AI-Interviewe-Pane is a free desktop AI interview assistant designed for live situations such as:

Meetings

Presentations

Classes and learning

Professional conversations

Coding and technical workflows

The application combines real-time speech-to-text, screen/document understanding, contextual AI responses, rolling conversation memory, local RAG, and a desktop Electron interface.

The architecture is local-first: application data and credentials are intended to remain on the user's machine unless a selected cloud AI/STT provider is explicitly used.

Core Capabilities

CapabilityDescription



Real-time audio

Native audio capture through Rust

Speech-to-text

Multiple cloud and local STT providers

AI providers

Gemini, OpenAI, Anthropic, Groq, Ollama and compatible endpoints

Screen analysis

Screenshot and OCR-based context

RAG

Semantic retrieval from meetings and reference material

Meeting history

Persistent sessions, transcripts and summaries

Reference files

PDF, DOCX and TXT context

Personas / modes

Context-specific AI behavior

Desktop UI

Electron + React

Local database

MongoDB

Native performance

Rust + N-API

Responsive UI

Adaptive desktop, tablet and narrow-window layouts

🏗️ Architecture

┌─────────────────────────────────────────────────────────────┐
│                     Electron Application                    │
├──────────────────────────────┬──────────────────────────────┤
│                              │                              │
│        React Renderer        │       Electron Main          │
│                              │                              │
│  ┌──────────────────────┐    │   ┌────────────────────────┐ │
│  │ Dashboard            │    │   │ IPC Handlers           │ │
│  │ Meeting UI           │    │   │ AI Services            │ │
│  │ Chat / Overlay       │    │   │ Audio Services         │ │
│  │ Settings             │    │   │ RAG / Embeddings       │ │
│  │ History              │    │   │ Database Services      │ │
│  └──────────────────────┘    │   └───────────┬────────────┘ │
│             │                │               │              │
│             ▼                │               ▼              │
│        Preload API           │       Service Layer          │
│             │                │               │              │
└─────────────┼────────────────┴───────────────┼──────────────┘
              │                                │
              ▼                                ▼
        Secure IPC                    Repository Layer
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │    MongoDB      │
                                      │ localhost:27017 │
                                      └─────────────────┘

Runtime Flow

User
  │
  ├── Voice / System Audio
  ├── Microphone
  ├── Screenshot
  ├── Text
  └── Reference Documents
          │
          ▼
     Electron Main
          │
          ├── Rust Audio Capture
          ├── STT
          ├── OCR
          ├── Context Manager
          └── RAG / Embedding Pipeline
                    │
                    ▼
             AI Provider Router
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Gemini    OpenAI     Claude
          │         │         │
          └─────────┼─────────┘
                    ▼
                AI Response
                    │
                    ▼
              React Renderer
                    │
                    ▼
                 MongoDB

🧩 Technology Stack

Frontend

React

TypeScript

Vite

Tailwind CSS

Responsive CSS/layout system

Desktop

Electron

Electron IPC

Secure preload bridge

Native

Rust

N-API

Native audio capture

Zero-copy buffer transfer where supported

Backend / Application Layer

The Electron main process acts as the local application backend.

Responsibilities include:

IPC

AI provider orchestration

Speech processing

RAG

Embedding management

File processing

Database access

Native module integration

Database

MongoDB

Development connection:

mongodb://localhost:27017/

Recommended environment configuration:

MONGODB_URI=mongodb://localhost:27017/
MONGODB_DATABASE=natively

MongoDB is accessed from the Electron main process through the database/service layer.

The React renderer must never connect directly to MongoDB.

🗄️ Database Architecture

React Renderer
      │
      ▼
Preload / contextBridge
      │
      ▼
IPC
      │
      ▼
Application Services
      │
      ▼
Repositories
      │
      ▼
MongoDatabaseManager
      │
      ▼
MongoDB

Main Data Domains

The exact collections should follow the application's implementation.

Typical domains include:

sessions
conversations
messages
meetings
chunks
summaries
documents
embeddings
settings
provider-configurations
application-state

Database Rules

Reuse a shared MongoDB connection.

Do not create a new database connection for every request.

Keep MongoDB access inside the main process.

Use indexes for frequently queried fields.

Never expose database credentials to the renderer.

Handle connection failures gracefully.

Preserve existing application data during migration.

🧠 RAG & Embedding Architecture

Meeting / Document
       │
       ▼
Text Extraction
       │
       ▼
Chunking
       │
       ▼
Embedding Generation
       │
       ▼
MongoDB
       │
       ▼
Semantic Retrieval
       │
       ▼
Relevant Context
       │
       ▼
Prompt Construction
       │
       ▼
Selected AI Model
       │
       ▼
Response

The embedding layer should remain independent from React UI components.

Recommended separation:

EmbeddingService
      │
      ▼
EmbeddingRepository
      │
      ▼
MongoDB

🤖 AI Provider Architecture

AI-Interviewe-Pane is designed around a provider abstraction.

Supported or documented providers include:

LLM

Google Gemini

OpenAI

Anthropic Claude

Groq

Ollama

OpenAI-compatible endpoints

Speech-to-Text

Google Cloud Speech-to-Text

Groq

OpenAI Whisper

Deepgram

ElevenLabs

Azure Speech

IBM Watson

Soniox

Only configure the providers you actually need.

Local AI

Ollama can be used for local inference.

Example:

ollama run llama3

Then configure:

USE_OLLAMA=true
OLLAMA_MODEL=llama3
OLLAMA_URL=http://localhost:11434

Local inference can reduce cloud dependency and keep model processing on the user's machine.

Project Structure

The final repository should follow the actual implementation, but the target architecture is:

natively/
│
├── src/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── styles/
│   ├── types/
│   └── App.tsx
│
├── electron/
│   ├── main/
│   │   ├── database/
│   │   │   ├── MongoDatabaseManager.ts
│   │   │   ├── repositories/
│   │   │   └── indexes/
│   │   ├── services/
│   │   ├── ipc/
│   │   └── main.ts
│   │
│   └── preload/
│
├── native/
│   └── rust/
│
├── scripts/
│
├── public/
│
├── assets/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example

Important: do not create duplicate folders if the repository already has an established equivalent architecture.

🎨 Responsive UI

The UI should support:

390 × 844     Narrow / mobile-sized window
768 × 1024    Tablet
1024 × 768    Small desktop
1280 × 800    Laptop
1440 × 900    Desktop
1920 × 1080   Large desktop

Layout Principles

Desktop

┌──────────────────────────────────────────────┐
│ Header                                       │
├──────────────┬───────────────────────────────┤
│ Sidebar      │ Main Content                  │
│              │                               │
│ Navigation   │ Dashboard / Meeting / Chat    │
│ History      │                               │
│ Settings     │                               │
└──────────────┴───────────────────────────────┘

Narrow Window

┌──────────────────────────┐
│ Header + Menu            │
├──────────────────────────┤
│                          │
│ Main Content             │
│                          │
│                          │
├──────────────────────────┤
│ Mobile Navigation        │
└──────────────────────────┘

The sidebar should collapse into a drawer or compact navigation on narrow widths.

The UI must avoid:

Horizontal overflow

Fixed-width panels that break layouts

Unbounded text

Broken dialogs

Hidden controls

Excessive absolute positioning

Hardcoded desktop-only dimensions

🔐 Environment Configuration

Create a local .env file from the project's supported variables.

Example:

# MongoDB
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DATABASE=natively

# AI
GEMINI_API_KEY=
OPENAI_API_KEY=
CLAUDE_API_KEY=
GROQ_API_KEY=

# Google Speech-to-Text
GOOGLE_APPLICATION_CREDENTIALS=

# Speech providers
DEEPGRAM_API_KEY=
ELEVENLABS_API_KEY=
AZURE_SPEECH_KEY=
AZURE_SPEECH_REGION=
IBM_WATSON_API_KEY=
IBM_WATSON_REGION=

# Ollama
USE_OLLAMA=true
OLLAMA_MODEL=llama3
OLLAMA_URL=http://localhost:11434

Do not commit real credentials.

💚 Free of Cost

AI-Interviewe-Pane does not require a paid subscription.

You can run the application locally with:

AI-Interviewe-Pane
      │
      ├── React / Electron UI
      ├── MongoDB localhost
      ├── Optional Ollama local AI
      └── Optional BYOK cloud providers

Cost options

Setup

Cost

Local MongoDB

Free

Local Ollama

Free

Application itself

Free

Cloud LLM

Provider usage charges may apply

Cloud STT

Provider usage charges may apply

The software itself is free. If you choose external AI or speech APIs, those providers may charge according to their own pricing.

🚀 Installation

Prerequisites

Node.js 20+

npm

Git

Rust

Cargo

MongoDB

API credentials for at least one AI/STT provider, unless using local Ollama

1. Clone

git clone https://github.com/AI-Interviewe-Pane-AI-assistant/natively-cluely-ai-assistant.git
cd natively-cluely-ai-assistant

2. Install dependencies

npm install

3. Start MongoDB

MongoDB must be available at:

mongodb://localhost:27017/

Verify:

mongosh

Then:

show dbs

4. Configure environment

Create:

.env

and configure the required providers.

5. Build native module

npm run build:native

6. Start development

npm start

📦 Production Build

npm run dist

The production pipeline should perform the required frontend, TypeScript, native-module and Electron packaging steps defined by the repository.

🔍 MongoDB Verification

After starting the application:

mongosh

Then:

show dbs
use natively
show collections

Example inspection:

db.sessions.find().limit(5)
db.conversations.find().limit(5)
db.messages.find().limit(5)
db.documents.find().limit(5)

Use the actual collection names created by the application.

Development Commands

Inspect the available scripts before running commands:

npm run

Typical commands include:

npm install
npm start
npm run build:native
npm run dist

Use the exact scripts defined in package.json.

🔄 SQLite → MongoDB Migration Strategy

The database migration should be performed incrementally.

Phase 1 — Foundation

Existing DatabaseManager API
          │
          ▼
Verified MongoDB Layer
          │
          ▼
MongoDB

Keep the existing public API where practical so existing callers do not need to be rewritten simultaneously.

Phase 2 — Core Runtime

Prioritize:

Meetings

Chunks

Summaries

Embeddings

RAG retrieval

Main IPC paths

Phase 3 — Remaining Modules

After the core runtime is verified:

Knowledge graph / OKF

Modes

Less frequently used persistence domains

Remaining SQLite-specific code

Phase 4 — Cleanup

Only after verification:

Remove obsolete SQLite dependencies

Remove dead database code

Remove unused adapters

Update tests

Verify build

Verify runtime

Migration Safety

The migration must prioritize:

Existing application behavior

Data preservation

Incremental changes

Type safety

Runtime verification

Test coverage

Rollback capability

Do not perform a wholesale rewrite of every database caller unless necessary.

🧪 Testing & Validation

Run the project's actual validation scripts.

At minimum verify:

[ ] TypeScript compilation
[ ] Lint
[ ] Unit tests
[ ] Database tests
[ ] MongoDB connection
[ ] IPC tests
[ ] Embedding tests
[ ] RAG retrieval
[ ] Meeting persistence
[ ] Electron startup
[ ] Native module
[ ] Production build
[ ] Responsive UI

For the migration specifically verify:

Create meeting
      ↓
MongoDB

Create transcript/chunk
      ↓
MongoDB

Generate embedding
      ↓
MongoDB

Retrieve semantic context
      ↓
RAG

Generate AI response
      ↓
Persist response

🔒 Security

The application should follow Electron security best practices.

Recommended configuration:

contextIsolation: true
nodeIntegration: false

where compatible with the application's existing architecture.

Never expose:

MongoDB connection strings

API keys

Service-account credentials

Node.js filesystem APIs

Database clients

directly to the renderer.

🛡️ Privacy

The application is designed around local-first processing.

Users should be able to control:

Which AI provider is enabled

Which speech provider is enabled

Whether local models are used

Which data is persisted

Which external services receive data

Cloud provider usage should be clearly separated from local processing.

Responsible Use

AI-Interviewe-Pane is intended for:

Learning

Productivity

Accessibility

Professional assistance

Users are responsible for complying with:

Workplace policies

Academic rules

Interview guidelines

Local laws and regulations

Do not use the application to circumvent dedicated security or proctoring controls.

🛠️ Troubleshooting

MongoDB connection failed

Verify MongoDB is running:

mongosh

Verify the configured URI:

mongodb://localhost:27017/

Then restart the application.

Native module failed

Run:

npm run build:native

Then restart the development process.

AI response unavailable

Verify:

The selected provider is configured.

The API key is valid.

The provider endpoint is reachable.

The selected model is available.

Ollama unavailable

Verify:

ollama list

Then run a model:

ollama run llama3

🏗️ Architecture Principles

The project should follow these principles:

Separation of Concerns
        ↓
Renderer
        ↓
Preload
        ↓
IPC
        ↓
Services
        ↓
Repositories
        ↓
Database

Additional principles:

Type-safe interfaces

Secure IPC

Shared database connection

Explicit provider abstractions

Reusable React components

Responsive layouts

Minimal duplication

Graceful error handling

Observable runtime behavior

Incremental migration

🗺️ Roadmap

Database

MongoDB foundation

MongoDB singleton

Meetings migration

Chunks migration

Summaries migration

Embeddings migration

RAG verification

Knowledge graph migration

Modes migration

SQLite dependency removal

UI

Responsive application shell

Responsive sidebar

Responsive dashboard

Responsive meeting view

Responsive settings

Keyboard accessibility

Consistent design tokens

Overflow and sizing audit

Platform

macOS validation

Windows validation

Native module validation

Production packaging

Linux support improvements

System Requirements

Level

Requirement

Minimum

4 GB RAM

Recommended

8 GB+ RAM

Local AI

16 GB+ RAM recommended

Node.js

20+

Database

MongoDB

Native build

Rust + Cargo

Desktop

Electron

📜 License

AI-Interviewe-Pane is source-available under the AI-Interviewe-Pane Personal Use Source License v1.0.

The license permits personal, educational, research and non-commercial use subject to its terms.

Commercial use requires the appropriate written license from the project owner.

See the repository's license file for the complete legal terms.

Support and Project Links

Project website: https://github.com/AI-Interviewe-Pane/AI-Interviewe-Pane

Source repository: https://github.com/AI-Interviewe-Pane-AI-assistant/natively-cluely-ai-assistant

Releases: https://github.com/AI-Interviewe-Pane-AI-assistant/natively-cluely-ai-assistant/releases

Final Architecture

                        ┌──────────────────────┐
                        │       User           │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │   React Renderer     │
                        │  Responsive UI       │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │   Secure Preload     │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │    Electron IPC      │
                        └──────────┬───────────┘
                                   │
             ┌─────────────────────┼─────────────────────┐
             ▼                     ▼                     ▼
      ┌─────────────┐      ┌──────────────┐      ┌──────────────┐
      │ AI Services │      │ Audio / STT  │      │ RAG / OCR    │
      └──────┬──────┘      └──────┬───────┘      └──────┬───────┘
             │                    │                     │
             └────────────────────┼─────────────────────┘
                                  ▼
                         ┌───────────────────┐
                         │ Application       │
                         │ Service Layer     │
                         └─────────┬─────────┘
                                   │
                         ┌─────────▼─────────┐
                         │ Repository Layer  │
                         └─────────┬─────────┘
                                   │
                         ┌─────────▼─────────┐
                         │ MongoDB Manager   │
                         └─────────┬─────────┘
                                   │
                         ┌─────────▼─────────┐
                         │     MongoDB       │
                         │ localhost:27017   │
                         └───────────────────┘

<p align="center">   <strong>Free · Local-first · Provider-flexible · Secure IPC · Responsive · Extensible</strong> </p>
