import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN as string;

const REFRESH_URL = 'https://oauth2.googleapis.com/token';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/playlists';

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

async function deletePlaylist(playlistId: string, accessToken: string): Promise<boolean> {
  try {
    const response = await axios.delete(`${YOUTUBE_API_URL}?id=${playlistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204) {
      console.log('Playlist deleted successfully');
      return true;
    } else {
      console.error('Failed to delete playlist', response.status, response.data);
      return false;
    }
  } catch (error) {
    console.error('Error deleting playlist', error);
    return false;
  }
}

// Main API handler
export async function DELETE(request: NextRequest) {
  const { playlistId } = await request.json(); // Expecting playlistId from the request body

  if (!playlistId) {
    return NextResponse.json({ error: 'Playlist ID is required' }, { status: 400 });
  }

  // Step 1: Refresh access token
  const accessToken = await refreshAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: 'Failed to refresh access token' }, { status: 500 });
  }

  // Step 2: Delete the playlist
  const isDeleted = await deletePlaylist(playlistId, accessToken);
  if (isDeleted) {
    return NextResponse.json({ message: 'Playlist deleted successfully' }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Failed to delete playlist' }, { status: 500 });
  }
}
