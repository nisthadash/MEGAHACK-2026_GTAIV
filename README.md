# ⚡ ExplainMyCode IDE

ExplainMyCode is a premium, AI-powered coding IDE and learning platform designed to help programmers understand, debug, and improve their code faster. It combines the power of modern developer tools with AI mentoring to create an interactive learning and coding environment.

The platform merges ideas from tools like **VS Code, GitHub Copilot, and ChatGPT** into a single cohesive developer experience.

---

## 🚀 Features

### 🤖 AI Mentor Panel
An intelligent AI assistant that helps programmers understand and optimize their code.
- **Comments (Real-time)**: Line-by-line comments generated automatically within 800ms of typing pauses, powered by **`gemini-2.0-flash-lite`** for high-speed responsiveness.
- **Summary**: A concise paragraph overview explaining what the entire file accomplishes.
- **Explanation**: A section-by-section breakdown of the program's logic.
- **Bugs**: Identifies syntax issues, logical bugs, and potential runtime errors.
- **Assumptions**: Highlights hidden assumptions (e.g. data types, sorting requirements).
- **Optimize**: Provides performance, readability, and structural improvement suggestions.
- **Interactive AI Chat**: Let's you ask follow-up questions directly about the file.

### 📝 Monaco Code Editor
A modern, scrollable coding environment supporting syntax highlighting, line numbers, cursor selection, and active line tracking for Python, JavaScript, C++, C, and Java.

### 💻 Integrated Terminal
A terminal console to run python programs locally via FastAPI subprocess execution, returning outputs and traceback stderr.

### 📊 AI Analysis Dashboard
Visual analytics including total lines of code, function counts, loops, conditional counts, cyclomatic complexity, and quality metrics using AST-based analysis and Recharts.

### 🔮 Algorithm Visualizer
Interactive step-by-step animations for algorithm execution (e.g., Bubble Sort, Binary Search, Graph Traversal).

---

## 🧠 Technology Stack

### Frontend
- **React & TypeScript**
- **Vite** (build system)
- **Tailwind CSS**
- **Monaco Editor**
- **Framer Motion** & **Radix UI**
- **Recharts**

### Backend
- **FastAPI** & **Python**
- **Google Gemini API** (using `gemini-2.5-flash` for deep analysis and `gemini-2.0-flash-lite` for real-time comments)
- **SQLAlchemy** with **SQLite** database
- **Python AST** (for static code analysis metrics)

---

## 📁 Project Structure

```text
MEGAHACK-2026_GTAIV/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx
│   │   │   ├── routes.ts
│   │   │   └── components/       # UI components (Editor, Terminal, AI Mentor, etc.)
│   │   ├── styles/
│   │   └── main.tsx            # Application entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── postcss.config.mjs
│
├── backend/
│   ├── docs/                   # API reference, architecture, & guide docs
│   ├── database/               # SQLite DB configuration
│   ├── models/                 # SQLAlchemy schemas
│   ├── routers/                # FastAPI routing paths (AI, execute, files)
│   ├── schemas/                # Pydantic data schemas
│   ├── services/               # AI & compiler integration layer
│   ├── main.py                 # FastAPI launch file
│   ├── config.py               # Env parsing & settings
│   ├── requirements.txt
│   ├── test_root.py
│   └── .env.example
│
├── guidelines/                 # UI Specifications & prompts
│   ├── Guidelines.md
│   ├── explain-my-code-prompt.md
│   └── explainmycode-ui-spec.md
│
├── .gitignore
├── ATTRIBUTIONS.md
├── package.json                # Root monorepo dev runner
└── start.bat                   # Windows quick launcher
```

---

## ⚙️ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/explainmycode.git
cd MEGAHACK-2026_GTAIV
```

### 2. Configure Environment Variables
Copy the template and fill in your keys:
```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and update:
```env
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET_KEY=generate_a_long_secret_key
```

### 3. Install Dependencies
```bash
# Install root orchestrator
npm install

# Install Frontend dependencies
cd frontend && npm install && cd ..

# Install Backend dependencies
cd backend && pip install -r requirements.txt && cd ..
```

### 4. Run the Dev Servers

#### Option A — Single terminal (recommended)
```bash
npm start
```
Starts both the frontend and backend in sync.

#### Option B — Windows double-click
Run **`start.bat`** from the file explorer. It automatically tests prerequisites and opens separate backend/frontend shells.

---

## 🔗 Core API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/execute` | `POST` | Executes code snippet and returns output/stderr. |
| `/api/ai/comments` | `POST` | Real-time debounced per-line code comments. |
| `/api/ai/explain` | `POST` | Main code explanation (populates summary, explanation, bugs, etc.) |
| `/api/ai/mentor` | `POST` | Conversational query to the mentor assistant. |
| `/api/analysis` | `POST` | Performs AST complexity and quality analysis. |

---

## 📜 License
This project is licensed under the MIT License. See [ATTRIBUTIONS.md](file:///c:/Users/nisth/MEGAHACK-2026_GTAIV/ATTRIBUTIONS.md) for open-source details.
