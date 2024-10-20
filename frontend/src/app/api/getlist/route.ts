import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// 인터페이스 정의
interface YouTubeApiResponse {
  items: {
    contentDetails: {
      videoId: string;
    };
  }[];
  nextPageToken?: string;
}

// GET 메서드를 명시적으로 export
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const playlistId = searchParams.get('playlistId');
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  if (!playlistId) {
    return NextResponse.json({ error: 'Invalid playlist ID' }, { status: 400 });
  }

  const videoIds: string[] = [];
  let nextPageToken: string | null = null;

  try {
    do {
      // YouTube API로 요청 보내기
      const response: { data: YouTubeApiResponse } =
        await axios.get<YouTubeApiResponse>(
          'https://www.googleapis.com/youtube/v3/playlistItems',
          {
            params: {
              part: 'contentDetails',
              maxResults: 50,
              playlistId: playlistId,
              pageToken: nextPageToken,
              key: apiKey,
            },
          },
        );

      const items = response.data.items;
      items.forEach((item) => {
        videoIds.push(item.contentDetails.videoId);
      });

      nextPageToken = response.data.nextPageToken || null;
    } while (nextPageToken);

    return NextResponse.json({ videoIds });
  } catch (error) {
    console.error('Failed to fetch video IDs from playlist', error);
    return NextResponse.json(
      { error: 'Failed to fetch video IDs from playlist' },
      { status: 500 },
    );
  }
}
