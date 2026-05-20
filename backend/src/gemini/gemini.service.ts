import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeneratedLesson {
  title: string;
  content: string;
  duration_minutes: number;
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private async generateText(prompt: string, retries = 3): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      const isRateLimited =
        error?.status === 429 ||
        error?.message?.includes('429') ||
        error?.message?.includes('Too many requests');

      if (isRateLimited) {
        // Daily quota exhausted (limit: 0) — retrying is pointless
        const isDailyQuotaExhausted = error?.message?.includes('limit: 0');
        if (isDailyQuotaExhausted) {
          this.logger.error(
            'Daily Gemini quota exhausted. Try again tomorrow or use a new API key.',
          );
          throw new Error(
            'AI service daily limit reached. Please try again later.',
          );
        }

        // Per-minute rate limit — retry makes sense
        if (retries > 0) {
          const retryInfo = error?.errorDetails?.find(
            (d: any) =>
              d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo',
          );
          const match = retryInfo?.retryDelay?.match(/(\d+)s/);
          const parsedDelay = match ? parseInt(match[1]) * 1000 : null;

          // retryDelay of 0s means hard limit — don't retry
          if (parsedDelay === 0) {
            this.logger.error('Gemini quota fully exhausted.');
            throw new Error(
              'AI service daily limit reached. Please try again later.',
            );
          }

          const isProd = this.config.get('NODE_ENV') === 'production';
          const fallbackDelay = isProd
            ? 35000
            : 10000 * Math.pow(2, 3 - retries);
          const waitTime = parsedDelay ?? fallbackDelay;

          this.logger.warn(
            `Rate limited, retrying in ${waitTime / 1000}s... (${retries} left)`,
          );
          await new Promise((res) => setTimeout(res, waitTime));
          return this.generateText(prompt, retries - 1);
        }
      }

      this.logger.error('Gemini call failed', error?.message || error);
      throw error;
    }
  }

  // generates the chapter titles for the course
  async generateChapterTitles(
    courseTitle: string,
    chaptersCount: number,
    difficulty: string,
    description?: string,
  ): Promise<string[]> {
    const prompt = `
      You are a course creator. Generate ${chaptersCount} chapter titles
      for a ${difficulty} level course on "${courseTitle}".
      ${description ? `Context: ${description}` : ''}
      Each chapter title should represent a major topic of the course.
      Return ONLY a valid JSON array of strings. No explanation, no markdown, no backticks.
      Example: ["Introduction to Python", "Variables and Data Types"]
    `;

    try {
      const raw = await this.generateText(prompt);
      try {
        return JSON.parse(raw);
      } catch {
        const cleaned = raw.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (error: any) {
      this.logger.error(
        'Chapter title generation failed',
        error?.message || error,
      );
      this.logger.warn('Using fallback chapter titles.');
      return Array.from(
        { length: chaptersCount },
        (_, i) => `Chapter ${i + 1}`,
      );
    }
  }

  // generates a short description for a chapter (shown under chapter title in UI)
  async generateChapterDescription(
    courseTitle: string,
    chapterTitle: string,
    difficulty: string,
  ): Promise<string> {
    const prompt = `
      Write a single short sentence (max 15 words) describing what a learner will learn
      in a chapter titled "${chapterTitle}" in a ${difficulty} course about "${courseTitle}".
      Return plain text only. No quotes, no markdown.
      Example: "Get started with Python and set up your development environment."
    `;

    try {
      return await this.generateText(prompt);
    } catch (error: any) {
      this.logger.error(
        'Chapter description generation failed',
        error?.message || error,
      );
      return `Learn the key concepts of ${chapterTitle}.`;
    }
  }

  // generates lessons for a chapter — each lesson is a specific subtopic with content
  async generateLessons(
    courseTitle: string,
    chapterTitle: string,
    difficulty: string,
    lessonsCount: number = 3,
  ): Promise<GeneratedLesson[]> {
    const prompt = `
      You are a course creator. Generate exactly ${lessonsCount} lessons for a chapter titled "${chapterTitle}"
      in a ${difficulty} level course about "${courseTitle}".

      CRITICAL rules for lesson titles:
      - Each title must be a SPECIFIC concept, not generic
      - Good: "What is Python and why use it", "Installing Python on Windows and Mac", "Writing your first Hello World program"
      - Bad: "Introduction", "Lesson 1", "Overview", "Getting Started"
      - Titles must be specific enough that searching them on YouTube returns ONE relevant video

      Return ONLY a valid JSON array. No markdown, no backticks, no explanation.
      Each item must have exactly these fields:
      - title: specific and searchable lesson title (string)
      - content: full educational content covering introduction, key concepts, practical example, and summary (string)
      - duration_minutes: realistic estimated time to complete this lesson as a number between 5 and 15 (number)

      Example:
      [
        { "title": "What is Python and why use it", "content": "Python is a high-level...", "duration_minutes": 5 },
        { "title": "Installing Python on Windows and Mac", "content": "To install Python...", "duration_minutes": 10 }
      ]
    `;

    try {
      const raw = await this.generateText(prompt);
      try {
        return JSON.parse(raw);
      } catch {
        const cleaned = raw.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (error: any) {
      this.logger.error('Lesson generation failed', error?.message || error);
      this.logger.warn('Using fallback lessons.');
      return Array.from({ length: lessonsCount }, (_, i) => ({
        title: `Lesson ${i + 1}`,
        content: `Content for lesson ${i + 1} of ${chapterTitle}.`,
        duration_minutes: 10,
      }));
    }
  }
}
