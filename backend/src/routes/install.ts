import { Router } from 'express';
import crypto from 'crypto';
import { exchangeCodeForToken } from '../auth';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/auth/slack', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  (req.session as any).oauthState = state;
  const scope = encodeURIComponent('chat:write,conversations:read');
  const redirect = encodeURIComponent(process.env.SLACK_REDIRECT_URI || '');
  const url = `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=${scope}&redirect_uri=${redirect}&state=${state}`;
  res.redirect(url);
});

router.get('/auth/slack/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code) return res.status(400).send('Missing code');
  if (!state || (req.session as any).oauthState !== state) return res.status(400).send('Invalid state');
  try {
    const data = await exchangeCodeForToken(String(code), String(process.env.SLACK_REDIRECT_URI));
    if (!data.ok) return res.status(500).json(data);
    const teamId = data.team?.id || data.team_id || 'unknown';
    const id = uuidv4();
    const access = data.access_token;
    const refresh = data.refresh_token || null;
    const expires_in = data.expires_in || null;
    const expires_at = expires_in ? Date.now() + expires_in * 1000 : null;

    db.prepare('INSERT OR REPLACE INTO tokens (id, team_id, access_token, refresh_token, expires_at) VALUES (?, ?, ?, ?, ?)')
      .run(id, teamId, access, refresh, expires_at);

    res.send('Slack installed! You can close this window. Back to app.');
  } catch (err) {
    console.error(err);
    res.status(500).send('OAuth failed');
  }
});

export default router;
