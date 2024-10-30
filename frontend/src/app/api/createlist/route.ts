import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN as string;

const REFRESH_URL = 'https://oauth2.googleapis.com/token';

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
    console.error('Failed to refreㅇㅇㅇsh access token', error);
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

async function addVideosToPlaylist(
  accessToken: string,
  playlistId: string,
  videoIds: string[],
): Promise<void> {
  try {
    for (const videoId of videoIds) {
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
    }
  } catch (error) {
    console.error('Failed to add videos to playlist', error);
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
      { message: 'Failed to refresh access token' },
      { status: 500 },
    );
  }

  await addVideosToPlaylist(accessToken, playlistId, videoIds);

  return NextResponse.json({
    success: true,
    playlistId,
  });
}
