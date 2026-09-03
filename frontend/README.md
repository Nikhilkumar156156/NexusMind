# @nexusmind/frontend

The client web interface for **NexusMind**, built with Next.js 15 App Router, React 19, Tailwind CSS, and Zustand.

---

## Directory Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages and layouts
│   ├── components/
│   │   └── ui/              # Reusable atomic UI components (buttons, dialogs, inputs)
│   ├── features/            # Domain-bounded UI features
│   │   ├── chat/            # Streaming AI conversation components & citation drawer
│   │   ├── graph/           # Interactive knowledge graph canvas
│   │   └── ingestion/       # Document upload and status monitors
│   ├── hooks/               # Shared React custom hooks
│   ├── lib/                 # Utility functions and API clients
│   └── stores/              # Zustand global client stores
├── public/                  # Static assets and icons
├── package.json
└── tsconfig.json
```

---

## Development Instructions

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run static type checking
npm run typecheck

# Run unit tests
npm run test
```
