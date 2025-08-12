import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function ScheduledList() {
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    const r = await axios.get(`${BACKEND}/api/scheduled`);
    setItems(r.data.items || []);
  };

  useEffect(() => { load(); }, []);

  const cancel = async (id: string) => {
    await axios.delete(`${BACKEND}/api/scheduled/${id}`);
    load();
  };

  return (
    <div className="card">
      <h2>Scheduled Messages</h2>
      {items.length === 0 ? <p>No scheduled messages</p> : (
        <ul>
          {items.map(it => (
            <li key={it.id}>
              <b>{it.channel}</b> — {it.text} — {dayjs(it.send_at).format('YYYY-MM-DD HH:mm')}
              <button onClick={() => cancel(it.id)}>Cancel</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
