import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  try {
    await axios.get(`${baseURL}/api/data/reset`, {
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
