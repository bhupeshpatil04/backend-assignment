Backend Engineer Hiring Assignment – Node.js + Express.js
📌 Overview

A backend service that:

Accepts Offer details (/offer)

Uploads Lead CSVs (/leads/upload)

Scores leads using:

Rule-based logic (max 50 pts)

AI reasoning (max 50 pts, via OpenAI or fallback)

Provides results as JSON (/score/results) or CSV (/score/results/export)

⚙️ Tech Stack

Node.js + Express.js

Multer + csv-parser (CSV handling)

Axios (AI API calls)

dotenv (env variables)

Docker (deployment)

🛠️ Setup
git clone <repo_url>
cd backend-assignment-node
npm install
cp .env.sample .env   # add your OPENAI_API_KEY
npm run dev           # or npm start


Server runs at http://localhost:8000

Run with Docker:

docker build -t backend-assignment .
docker run -p 8000:8000 backend-assignment

🔌 API Endpoints
1. POST /offer
{ "name": "AI Outreach", "value_props": ["24/7 outreach"], "ideal_use_cases": ["B2B SaaS mid-market"] }

2. POST /leads/upload

Upload CSV (file field). Example CSV: sample_data/leads.csv

3. POST /score

Runs scoring. → { "results_id": 1696000, "count": 3 }

4. GET /score/results

Returns scored leads JSON.

5. GET /score/results/export

Exports results as CSV.

🧮 Scoring Logic

Role relevance: decision maker +20, influencer +10

Industry match: exact ICP +20, adjacent +10

Data completeness: +10 if all fields present

AI layer: High=50, Medium=30, Low=10

Final Score = rule_score + ai_points

📊 Example Result
{
  "name": "Ava Patel",
  "role": "Head of Growth",
  "company": "FlowMetrics",
  "intent": "High",
  "score": 85,
  "reasoning": "Rule score=35; AI: Fits ICP SaaS mid-market and role is decision maker."
}

🚀 Deployment

Push to GitHub

Deploy on Render/Railway/Heroku

Add env vars (OPENAI_API_KEY)

Start command: npm start
