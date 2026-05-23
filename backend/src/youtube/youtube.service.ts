import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface YoutubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  url: string;
}

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);
  private readonly apiKey: string;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('YOUTUBE_API_KEY');
    if (!apiKey) {
      throw new Error('YOUTUBE_API_KEY is not configured');
    }

    this.apiKey = apiKey;
  }

  async searchVideo(
    searchTerm: string,
    courseTitle: string,
    difficulty: string,
    courseDescription?: string
  ): Promise<YoutubeVideo | null> {
    try {
      const difficultyQueries: Record<string, string> = {
        beginner: 'beginner tutorial for beginners step by step',
        intermediate: 'intermediate tutorial learn',
        advanced: 'advanced expert level in-depth deep dive',
      };

      const difficultyDuration: Record<string, string> = {
        beginner: 'medium',
        intermediate: 'medium',
        advanced: 'long',
      };

      const query = encodeURIComponent(
        `${courseTitle} ${searchTerm} ${difficultyQueries[difficulty] || difficulty}`
      );
      const duration = difficultyDuration[difficulty] || 'any';
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&videoDuration=${duration}&videoDefinition=high&key=${this.apiKey}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`YouTube error: ${res.status}`);

      const data = await res.json();
      if (!data.items?.length) return null;

      const video = data.items[0];
      const videoId = video?.id?.videoId;
      const title = video?.snippet?.title;
      const thumbnail = video?.snippet?.thumbnails?.medium?.url;
      if (!videoId || !title || !thumbnail) return null;

      return {
        videoId,
        title,
        thumbnail,
        url: `https://www.youtube.com/watch?v=${videoId}`
      };

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`YouTube search failed: ${message}`);
      return null;
    }
  }
}