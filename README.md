# Backend Assignment - Node.js + Express.js

## Overview
Express.js backend that implements lead scoring via rules + AI reasoning. Endpoints:
- POST /offer
- POST /leads/upload
- POST /score
- GET /score/results
- GET /score/results/export

## Quick Start
1. `npm install`
2. `npm run dev` (requires nodemon) or `npm start`
3. Access `http://localhost:8000`

## AI Integration
Set `OPENAI_API_KEY` in `.env` to enable OpenAI scoring. Otherwise fallback heuristic is used.

## Sample CSV
`sample_data/leads.csv` provided for testing upload.
