# Refold-Slack-Connect-Project

Description
A Slack integration project that allows connecting workspaces, storing access tokens, and scheduling messages. Built with a Node.js backend and React frontend, it uses OAuth for authentication, SQLite for storage, and ngrok for local testing with Slack API callbacks.

Setup Instructions
1. Clone the repository
   git clone https://github.com/yourusername/refold-slack-connect-js.git
   cd refold-slack-connect-js

2. Backend Setup
   1. Navigate to the backend folder:
   cd backend
   2. Install dependencies:
   npm install
   3. Copy .env.example to .env and fill in your Slack App credentials:
   cp .env.example .env
   Update the following in .env:
    PORT=5000
    SESSION_SECRET=change_me_in_prod
    SLACK_CLIENT_ID=your_slack_client_id
    SLACK_CLIENT_SECRET=your_slack_client_secret
    SLACK_REDIRECT_URI=https://<your-ngrok-id>.ngrok.io/auth/slack/callback
    BASE_URL=http://localhost:5000
    DB_FILE=./data/sqlite.db
   4. Start the backend server:
   npm run dev

3. Frontend Setup
   1. Open a new terminal and go to the frontend folder:
   cd ../frontend
   2. Install dependencies:
   npm install
   3. Copy .env.example to .env and update:
     VITE_BACKEND_URL=http://localhost:5000
     VITE_CLIENT_ID=your_slack_client_id
     VITE_REDIRECT_URI=https://<your-ngrok-id>.ngrok.io/auth/slack/callback
   4. Start the frontend development server:
   npm run dev

4. Running ngrok
To expose your backend to Slack:
ngrok http 5000

Architectural Overview
Frontend (React + Vite)
Handles user interaction, OAuth authorization redirect, and displays Slack workspace connection status.
Backend (Node.js + Express)
  OAuth 2.0 Flow: Redirects user to Slack, exchanges authorization code for access token.
  Token Management: Stores access tokens securely in SQLite.
  Scheduled Tasks: Uses node-schedule to send messages to Slack channels at scheduled times.
Database (SQLite)
  Lightweight DB to store Slack workspace tokens and scheduled messages.
ngrok
  Exposes the local backend server to Slack for handling OAuth callbacks and event requests.
   
Challenges & Learnings
A. Challenges
1. Handling OAuth Redirects Locally
  Slack requires a public HTTPS endpoint for redirects; solved using ngrok.
2. Token Expiration & Refresh Logic
  Implemented storage with expiry timestamps to handle token validity.
3. Coordinating Frontend & Backend Env Variables
  Ensured .env values stayed consistent between both ends to avoid redirect mismatches.

B. Learnings
1. Gained hands-on experience with OAuth 2.0 in a real-world app.
2. Learned secure token storage and the importance of not exposing secrets to the frontend.
3. Improved debugging skills by testing webhooks locally using ngrok.
   
Tech Stack
1. Frontend: React, Vite, JavaScript
2. Backend: Node.js, Express
3. Database: SQLite
4. Others: ngrok, node-schedule, express-session, Slack API
