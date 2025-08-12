import React from 'react';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = encodeURIComponent(import.meta.env.VITE_REDIRECT_URI || '');
const SCOPES = encodeURIComponent('chat:write,conversations:read');

export default function ConnectSlack() {
  const url = `https://slack.com/oauth/v2/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}`;
  return (
    <div className="card">
      <h2>Connect Slack</h2>
      <p>Click the button to install the app into your workspace (opens Slack consent).</p>
      <a className="button" href={url}>Add to Slack</a>
    </div>
  );
}
