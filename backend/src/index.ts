import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import installRoutes from './routes/install';
import messageRoutes from './routes/message';
import { loadAndSchedule } from './scheduler';

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET || 'dev', resave: false, saveUninitialized: true }));

app.use('/', installRoutes);
app.use('/api', messageRoutes);

// on start: load scheduled messages
loadAndSchedule(async (token, teamId, channel, text) => {
  const axios = (await import('axios')).default;
  const resp = await axios.post('https://slack.com/api/chat.postMessage', { channel, text }, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  if (!resp.data.ok) throw new Error('send failed');
  return resp.data;
});

app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
