    import axios from 'axios';

    const SLACK_OAUTH_URL = 'https://slack.com/api/oauth.v2.access';

    export async function exchangeCodeForToken(code: string, redirect_uri: string) {
      const params = new URLSearchParams({ code, redirect_uri });
      const basicAuth = Buffer.from(`${process.env.SLACK_CLIENT_ID}:${process.env.SLACK_CLIENT_SECRET}`).toString('base64');
      const resp = await axios.post(SLACK_OAUTH_URL, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${basicAuth}`,
        },
      });
      return resp.data;
    }

export async function refreshAccessToken(refresh_token: string) {
  const params = new URLSearchParams({ grant_type: 'refresh_token', refresh_token });
  const basicAuth = Buffer.from(`${process.env.SLACK_CLIENT_ID}:${process.env.SLACK_CLIENT_SECRET}`).toString('base64');
  const resp = await axios.post(SLACK_OAUTH_URL, params.toString(), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
  });
  return resp.data;
}
