import axios from 'axios';

const baseUrl = process.env.NEXTAUTH_URL as string;

export async function GET() {
  try {
    await axios.get(`${baseUrl}api/data/reset`, {
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
