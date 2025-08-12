import React from 'react';
import ConnectSlack from './components/ConnectSlack';
import Composer from './components/Composer';
import ScheduledList from './components/ScheduledList';

export default function App() {
  return (
    <div className="container">
      <h1>Refold — Slack Connect</h1>
      <ConnectSlack />
      <Composer />
      <ScheduledList />
    </div>
  );
}
