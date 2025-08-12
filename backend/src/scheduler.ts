    import schedule from 'node-schedule';
    import db from './db';
    import axios from 'axios';
    import dayjs from 'dayjs';

    // load scheduled messages from DB and schedule them
    export function loadAndSchedule(sendMessageFn: (token: string, teamId: string, channel: string, text: string) => Promise<any>) {
      const rows = db.prepare('SELECT * FROM scheduled_messages WHERE status = ?').all('scheduled');
      for (const r of rows) {
        scheduleJobForRow(r, sendMessageFn);
      }
    }

export function scheduleJobForRow(row: any, sendMessageFn: (token: string, teamId: string, channel: string, text: string) => Promise<any>) {
  const sendDate = new Date(row.send_at);
  if (sendDate.getTime() <= Date.now()) {
    // overdue: send immediately
    sendNow(row, sendMessageFn);
    return;
  }
  schedule.scheduleJob(row.id, sendDate, async () => {
    await sendNow(row, sendMessageFn);
  });
}

async function sendNow(row: any, sendMessageFn: (token: string, teamId: string, channel: string, text: string) => Promise<any>) {
  try {
    const tokenRow = db.prepare('SELECT * FROM tokens WHERE team_id = ?').get(row.team_id);
    if (!tokenRow) throw new Error('No token for team');
    await sendMessageFn(tokenRow.access_token, row.team_id, row.channel, row.text);
    db.prepare('UPDATE scheduled_messages SET status = ? WHERE id = ?').run('sent', row.id);
  } catch (err) {
    console.error('Failed to send scheduled message', err);
  }
}
