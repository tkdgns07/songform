import type { NextRequest } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  try {
    const response_wakeup = await axios.get('http://127.0.0.1:8000/wcalendar-values/cronjob');
    const response_labor = await axios.get('http://127.0.0.1:8000/lcalendar-values/cronjob');
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
