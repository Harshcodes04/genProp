# GenProp

GenProp is a web application featuring a bespoke, terminal-inspired dark-mode interface (Cosmovoid) and backend integration with Gemini AI for generating technical interview reports.

## Structure

- **frontend**: React-based frontend application with a minimalist, raw engineering aesthetic.
- **backend**: Node.js/Express backend integrating with MongoDB and the Gemini API for AI-powered features.

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Gemini API Key

### Installation

1. Clone the repository.
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Set up environment variables in `backend/src/.env` (e.g., `MONGO_URI`, `GEMINI_API_KEY`).

### Running the App

- Start the frontend: `npm run dev` in the `frontend` directory.
- Start the backend: `npm start` (or your dev script) in the `backend` directory.
