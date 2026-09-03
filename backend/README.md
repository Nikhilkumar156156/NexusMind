# @nexusmind/backend

The core API service, knowledge ingestion engine, hybrid RAG retriever, and AI Gateway for **NexusMind**. Built with Node.js, Fastify, TypeScript, and PostgreSQL with `pgvector`.

---

## Directory Structure (Hexagonal / Clean Architecture)

```
backend/
├── src/
│   ├── domain/               # Pure business models, entities, and domain errors
│   │   ├── models/           # Document, Chunk, GraphEdge, AgentSession
│   │   └── ports/            # Repository and external service interfaces
│   ├── application/          # Use cases, command & query handlers
│   │   ├── use-cases/        # IngestDocumentUseCase, StreamAgentChatUseCase
│   │   └── dtos/             # Data transfer objects
│   ├── infrastructure/       # Concrete adapters
│   │   ├── db/               # PostgreSQL connection & Drizzle ORM schema
│   │   ├── repositories/     # Drizzle repository implementations
│   │   ├── vector/           # pgvector HNSW search adapter
│   │   └── ai/               # Multi-provider AI Gateway (Gemini, Claude, OpenAI)
│   ├── presentation/         # HTTP controllers, SSE streams, route schemas
│   │   ├── routes/           # REST endpoints
│   │   ├── schemas/          # Zod validation schemas
│   │   └── sse/              # Server-Sent Events streaming handlers
│   └── index.ts              # Application bootstrap & dependency injection
├── drizzle.config.ts         # Drizzle Kit configuration
├── package.json
└── tsconfig.json
```

---

## Development Instructions

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start development server with hot-reload
npm run dev

# Run type checks
npm run typecheck

# Run test suite
npm run test
```
