import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY as string;

interface YoutubeInfo {
    thumbnail: string;
    title: string;
    link: string;
}

const getYoutubeVideoId = (url: string): string | null => {
    try {
        const urlObj = new URL(url);

        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }

        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            return urlObj.searchParams.get('v');
        }

        return null;
    } catch (e) {
        return url;
    }
};

const fetchVideoDetails = async (videoIds: string[]): Promise<YoutubeInfo[]> => {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
            part: 'snippet',
            id: videoIds.join(','),
            key: YOUTUBE_API_KEY,
        },
    });

    if (response.data.items.length === 0) {
        throw new Error('No video found for the given IDs');
    }

    return response.data.items.map((item: any) => {
        const videoData = item.snippet;
        const maxresThumbnail = videoData.thumbnails.maxres
            ? videoData.thumbnails.maxres.url
            : videoData.thumbnails.high.url;

        return {
            title: videoData.title,
            thumbnail: maxresThumbnail,
            link: `https://www.youtube.com/watch?v=${item.id}`,
        };
    });
};

// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const videoUrls = searchParams.getAll('videoUrl[]').length > 0
            ? searchParams.getAll('videoUrl[]')
            : searchParams.getAll('videoUrl');

        if (videoUrls.length === 0) {
            return NextResponse.json({ message: 'No video URLs provided' }, { status: 400 });
        }

        const videoIds = videoUrls.map(url => getYoutubeVideoId(url)).filter(id => id !== null) as string[];

        if (videoIds.length === 0) {
            return NextResponse.json({ message: 'No valid YouTube IDs found' }, { status: 400 });
        }

        const videoDetailsList = await fetchVideoDetails(videoIds);

        // 비디오가 하나일 경우 객체로, 여러 개일 경우 배열로 반환
        if (videoDetailsList.length === 1) {
            return NextResponse.json(videoDetailsList[0]);  // 단일 객체 반환
        }

        return NextResponse.json(videoDetailsList);  // 배열 반환
    } catch (error) {
        console.error('Error fetching video details:', error);
        return NextResponse.json({ message: 'Failed to fetch video details' }, { status: 500 });
    }
}
