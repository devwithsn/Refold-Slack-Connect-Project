    import { Router } from 'express';
    import db from '../db';
    import { v4 as uuidv4 } from 'uuid';
    import axios from 'axios';
    import { scheduleJobForRow } from '../scheduler';

    const router = Router();

    async function sendMessage(accessToken: string, teamId: string, channel: string, text: string) {
      const resp = await axios.post('https://slack.com/api/chat.postMessage', { channel, text }, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
      });
      if (!resp.data.ok) throw new Error(JSON.stringify(resp.data));
      return resp.data;
    }

// send now
router.post('/send', async (req, res) => {
  const { team_id, channel, text } = req.body;
  if (!team_id || !channel || !text) return res.status(400).send('Missing fields');
  const tokenRow = db.prepare('SELECT * FROM tokens WHERE team_id = ?').get(team_id);
  if (!tokenRow) return res.status(400).send('Team not connected');
  try {
    await sendMessage(tokenRow.access_token, team_id, channel, text);
    res.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// schedule
router.post('/schedule', (req, res) => {
  const { team_id, channel, text, send_at } = req.body; // send_at epoch ms
  if (!team_id || !channel || !text || !send_at) return res.status(400).send('Missing');
  const id = uuidv4();
  db.prepare('INSERT INTO scheduled_messages (id, team_id, channel, text, send_at, status) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, team_id, channel, text, Number(send_at), 'scheduled');
  const row = db.prepare('SELECT * FROM scheduled_messages WHERE id = ?').get(id);
  scheduleJobForRow(row, sendMessage);
  res.json({ ok: true, id });
});

router.get('/scheduled', (req, res) => {
  const rows = db.prepare('SELECT * FROM scheduled_messages ORDER BY send_at DESC').all();
  res.json({ ok: true, items: rows });
});

router.delete('/scheduled/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE scheduled_messages SET status = ? WHERE id = ?').run('cancelled', id);
  const job = require('node-schedule').scheduledJobs[id];
  if (job) job.cancel();
  res.json({ ok: true });
});

export default router;
