# ExplainMyCode IDE

ExplainMyCode is an **AI-powered coding IDE and learning platform** designed to help programmers understand, debug, and improve their code faster.
It combines the power of modern developer tools with AI mentoring to create an interactive learning and coding environment.

The platform merges ideas from tools like **VS Code, GitHub Copilot, and ChatGPT** into a single developer experience.

---

# 🚀 Features

## AI Mentor

An intelligent AI assistant that helps programmers understand their code.

Capabilities include:

* Code summary
* Line-by-line explanation
* Bug detection
* Assumption detection
* Optimization suggestions
* Interactive AI chat

---

## Code Editor

Built using **Monaco Editor**, providing a modern coding environment.

Features:

* Syntax highlighting
* Line numbers
* Active line highlighting
* Scrollable editor
* Multiple language support

Supported languages:

* Python
* JavaScript
* C++
* Java
* C

---

## Terminal

Integrated terminal for executing code directly from the IDE.

Capabilities:

* Run code
* Display output
* Show error logs
* Clear terminal

Code execution is handled by the **FastAPI backend using Python subprocess execution**.

---

## AI Analysis Dashboard

Displays insights about the code structure and quality.

Metrics include:

* Total lines of code
* Number of functions
* Loops
* Conditional statements
* Code quality score
* Algorithm detection

Visual elements include charts and metric cards.

---

## Algorithm Visualization

Interactive animations to understand algorithms step-by-step.

Supported visualizations:

* Bubble Sort
* Binary Search
* Recursion Trees
* Graph Traversal

Controls:

* Play
* Pause
* Step
* Reset

---

# 🧠 Technology Stack

## Frontend

The frontend is built using modern web technologies.

* React
* TypeScript
* Vite
* Tailwind CSS
* Monaco Editor
* Recharts
* Radix UI
* Framer Motion

---

## Backend

The backend powers AI processing and code execution.

* FastAPI
* Python
* Gemini API
* Python AST (code analysis)
* Python subprocess (code execution)

---

# 📁 Project Structure

```text
DESIGN-EXPLAINMYCODE-IDE
│
├── frontend
│   ├── src
│   ├── node_modules
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── postcss.config.mjs
│   └── .vite
│
├── backend
│   ├── main.py
│   ├── routers
│   │   ├── ai.py
│   │   ├── execute.py
│   │   └── analysis.py
│   │
│   ├── services
│   │   ├── gemini_service.py
│   │   ├── compiler_service.py
│   │   └── analysis_service.py
│   │
│   ├── schemas
│   ├── utils
│   ├── requirements.txt
│   ├── .env
│   ├── .venv
│   └── test_root.py
│
├── guidelines
│
├── ATTRIBUTIONS.md
└── README.md
```

---

# ⚙️ Installation Guide

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/explainmycode.git
cd explainmycode
```

---

# 🔧 Backend Setup

Navigate to the backend folder.

```bash
cd backend
```

Install dependencies.

```bash
pip install -r requirements.txt
```

---

## Configure Environment Variables

Create a `.env` file inside the backend folder.

```
GEMINI_API_KEY=your_gemini_api_key
```

---

## Start Backend Server

```bash
uvicorn main:app --reload
```

Backend will run at:

```
http://localhost:8000
```

You can test APIs here:

```
http://localhost:8000/docs
```

---

# 💻 Frontend Setup

Navigate to the frontend folder.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Run development server.

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# 🔗 API Endpoints

## Run Code

```
POST /api/execute
```

Runs Python code and returns output.

---

## AI Code Explanation

```
POST /api/ai/explain
```

Returns:

* Code summary
* Explanation
* Bugs
* Assumptions
* Optimization suggestions

---

## AI Mentor Chat

```
POST /api/ai/mentor
```

Allows the user to ask questions about their code.

---

## Code Analysis

```
POST /api/analysis
```

Returns:

* Total lines
* Functions
* Loops
* Conditions
* Quality score

---

# ▶️ Running the Full Project

Start backend:

```bash
cd backend
uvicorn main:app --reload
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open the application:

```
http://localhost:5173
```

---

# 🏗 System Architecture

```
React Frontend
      │
      ▼
FastAPI Backend
      │
      ├ Gemini API → AI explanations
      ├ Python subprocess → code execution
      └ Python AST → code analysis
```

---

# ⚠ Known Limitations

* Currently supports **Python code execution only**
* File persistence is limited
* AI analysis depends on API availability

---

# 🔮 Future Improvements

Planned improvements include:

* Multi-language code execution
* Git integration
* Collaborative coding
* Real-time AI suggestions
* Cloud deployment
* AI debugging assistant

---

# 📜 License

MIT License

---

# 🙌 Acknowledgements

Inspired by modern developer tools such as:

* VS Code
* ChatGPT
* GitHub Copilot

---

# 👨‍💻 Author

GTA IV

