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
    chapterTitle?: string,
    excludeVideoIds: string[] = [],
  ): Promise<YoutubeVideo | null> {
    try {
      const difficultyQueries: Record<string, string> = {
        beginner: 'beginner tutorial for beginners step by step',
        intermediate: 'intermediate tutorial learn',
        advanced: 'advanced expert level in-depth deep dive',
      };

      const query = encodeURIComponent(
        `${chapterTitle ? `${chapterTitle} ` : ''}${searchTerm} ${courseTitle} ${difficultyQueries[difficulty] || difficulty} tutorial`,
      );
      const maxResults = Math.min(excludeVideoIds.length + 1, 10);
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=${maxResults}&videoDefinition=high&key=${this.apiKey}`;

      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`YouTube error: ${res.status} — ${body}`);
      }

      const data = await res.json();
      if (!data.items?.length) {
        this.logger.warn(`No YouTube results for query: ${query}`);
        return null;
      }

      const excluded = new Set(excludeVideoIds);
      for (const item of data.items) {
        const videoId = item?.id?.videoId;
        if (!videoId || excluded.has(videoId)) continue;

        const title = item?.snippet?.title;
        const thumbnails = item?.snippet?.thumbnails;
        const thumbnail = thumbnails?.maxres?.url ?? thumbnails?.high?.url ?? thumbnails?.medium?.url;
        if (!title || !thumbnail) {
          this.logger.warn(`YouTube result missing fields: videoId=${!!videoId}, title=${!!title}, thumbnail=${!!thumbnail}`);
          continue;
        }

        return { videoId, title, thumbnail, url: `https://www.youtube.com/watch?v=${videoId}` };
      }

      this.logger.warn(`No new YouTube results for query (all ${data.items.length} already used): ${query}`);
      return null;
    } catch (error) {
      this.logger.error(`YouTube search failed: ${error?.message || error}`);
      return null;
    }
  }
}
