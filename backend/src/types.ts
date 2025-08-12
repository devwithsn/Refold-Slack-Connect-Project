    export type TokenRecord = {
      id: string;
      team_id: string;
      access_token: string;
      refresh_token?: string;
      expires_at?: number | null; // epoch ms
    };

export type ScheduledMessage = {
      id: string;
      team_id: string;
      channel: string;
      text: string;
      send_at: number; // epoch ms
      status: 'scheduled' | 'sent' | 'cancelled';
    };
