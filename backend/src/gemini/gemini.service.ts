import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
          this.logger.error('Daily Gemini quota exhausted. Try again tomorrow or use a new API key.');
          throw new Error('AI service daily limit reached. Please try again later.');
        }

        // Per-minute rate limit — retry makes sense
        if (retries > 0) {
          const retryInfo = error?.errorDetails?.find(
            (d: any) => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
          );
          const match = retryInfo?.retryDelay?.match(/(\d+)s/);
          const parsedDelay = match ? parseInt(match[1]) * 1000 : null;

          // retryDelay of 0s means hard limit — don't retry
          if (parsedDelay === 0) {
            this.logger.error('Gemini quota fully exhausted.');
            throw new Error('AI service daily limit reached. Please try again later.');
          }

          const isProd = this.config.get('NODE_ENV') === 'production';
          const fallbackDelay = isProd ? 35000 : 10000 * Math.pow(2, 3 - retries);
          const waitTime = parsedDelay ?? fallbackDelay;

          this.logger.warn(`Rate limited, retrying in ${waitTime / 1000}s... (${retries} left)`);
          await new Promise(res => setTimeout(res, waitTime));
          return this.generateText(prompt, retries - 1);
        }
      }

      this.logger.error('Gemini call failed', error?.message || error);
      throw error;
    }
  }

  async generateChapterTitles(
    title: string,
    chaptersCount: number,
    difficulty: string,
    description?: string
  ): Promise<string[]> {
    const prompt = `
      You are a course creator. Generate ${chaptersCount} chapter titles
      for a ${difficulty} level course on "${title}".
      ${description ? `Context: ${description}` : ''}
      Return ONLY a valid JSON array of strings. No explanation, no markdown, no backticks.
      Example: ["Chapter 1 title", "Chapter 2 title"]
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
      const isDevFallback = process.env.NODE_ENV !== 'production';
      this.logger.error('Gemini chapter title generation failed', error?.message || error);
      if (isDevFallback) {
        this.logger.warn('Using fallback chapter titles for local testing.');
        return Array.from({ length: chaptersCount }, (_, i) => `Chapter ${i + 1}`);
      }
      throw error;
    }
  }

  async generateChapterContent(
    courseTitle: string,
    chapterTitle: string,
    difficulty: string,
    chapterIndex: number
  ): Promise<string> {
    const prompt = `
      You are a course creator. Write educational content for chapter ${chapterIndex + 1}
      titled "${chapterTitle}" in a ${difficulty} level course about "${courseTitle}".
      
      Structure:
      - Introduction (2-3 sentences)
      - Key Concepts (3-5 points)
      - Practical Example
      - Summary (1-2 sentences)

      Be clear, concise and educational.
    `;

    try {
      return await this.generateText(prompt);
    } catch (error: any) {
      const isDevFallback = process.env.NODE_ENV !== 'production';
      this.logger.error('Gemini chapter content generation failed', error?.message || error);
      if (isDevFallback) {
        this.logger.warn('Using fallback chapter content for local testing.');
        return `This is placeholder content for chapter ${chapterIndex + 1} titled "${chapterTitle}" in a ${difficulty} course about "${courseTitle}".`;
      }
      throw error;
    }
  }
}