import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN as string;

const REFRESH_URL = 'https://oauth2.googleapis.com/token';

const MAX_DELAY = 30000; // 최대 지연 시간 30초

// Delay function to introduce a delay between API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await axios.post(REFRESH_URL, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: 'refresh_token',
    });

    const newAccessToken = response.data.access_token;
    return newAccessToken;
  } catch (error) {
    console.error('Failed to refresh access token', error);
    return null;
  }
}

async function createPlaylist(
  accessToken: string,
  title: string,
  description: string,
): Promise<string | null> {
  try {
    const response = await axios.post(
      'https://www.googleapis.com/youtube/v3/playlists?part=snippet,status',
      {
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus: 'unlisted',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.id;
  } catch (error) {
    console.error('Failed to create playlist', error);
    return null;
  }
}

async function addVideoToPlaylist(
  accessToken: string,
  playlistId: string,
  videoId: string,
  delayMs: number,
): Promise<void> {
  try {
    // If delay is greater than MAX_DELAY, throw an error
    if (delayMs > MAX_DELAY) {
      throw new Error(`Delay time exceeded 30 seconds. Delay was ${delayMs}ms`);
    }

    // Wait for the delay time before making the API call
    await delay(delayMs);

    await axios.post(
      'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet',
      {
        snippet: {
          playlistId: playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId: videoId,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error(`Failed to add video ${videoId} to playlist`, error);
  }
}

export async function POST(req: NextRequest) {
  const { videoIds, playlistTitle, playlistDescription } = await req.json();

  if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0) {
    return NextResponse.json(
      { message: 'No video IDs provided' },
      { status: 400 },
    );
  }

  const accessToken = await refreshAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { message: 'Failed to refresh access token' },
      { status: 500 },
    );
  }

  const playlistId = await createPlaylist(
    accessToken,
    playlistTitle,
    playlistDescription,
  );
  if (!playlistId) {
    return NextResponse.json(
      { message: 'Failed to create playlist' },
      { status: 500 },
    );
  }

  let delayMs = 1000;
  for (const videoId of videoIds) {
    await addVideoToPlaylist(accessToken, playlistId, videoId, delayMs);
    delayMs += 2; // 지연 시간을 두 배로 늘림 (Exponential Backoff)
  }

  return NextResponse.json({
    success: true,
    playlistId,
  });
}
