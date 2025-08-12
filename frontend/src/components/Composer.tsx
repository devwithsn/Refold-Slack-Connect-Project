import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function Composer() {
  const [teamId, setTeamId] = useState('');
  const [channel, setChannel] = useState('');
  const [text, setText] = useState('');
  const [sendAt, setSendAt] = useState<Date | null>(null);

  const sendNow = async () => {
    await axios.post(`${BACKEND}/api/send`, { team_id: teamId, channel, text });
    alert('sent (or queued)');
  };

  const schedule = async () => {
    if (!sendAt) return alert('pick a date');
    await axios.post(`${BACKEND}/api/schedule`, { team_id: teamId, channel, text, send_at: sendAt.getTime() });
    alert('scheduled');
  };

  return (
    <div className="card">
      <h2>Compose Message</h2>
      <input placeholder="team_id (from install callback)" value={teamId} onChange={e => setTeamId(e.target.value)} />
      <input placeholder="channel id (e.g. #general or C123...)" value={channel} onChange={e => setChannel(e.target.value)} />
      <textarea placeholder="message" value={text} onChange={e => setText(e.target.value)} />
      <div>
        <button onClick={sendNow}>Send Now</button>
        <div style={{ display: 'inline-block', marginLeft: 12 }}>
          <DatePicker selected={sendAt} onChange={(d) => setSendAt(d)} showTimeSelect dateFormat="Pp" />
          <button onClick={schedule}>Schedule</button>
        </div>
      </div>
    </div>
  );
}
