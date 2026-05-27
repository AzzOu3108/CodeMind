import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Groq } from 'groq-sdk';

export interface GeneratedLesson {
  title: string;
  content: string;
  duration_minutes?: number;
}

export interface GeneratedChapter {
  title: string;
  content: string;
  lessons: { title: string; content: string }[];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private groq: Groq;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('GROQ_API_KEY');
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }
    this.groq = new Groq({ apiKey });
  }

  private async generateText(prompt: string, retries = 3): Promise<string> {
    try {
      const completion = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content:
              'You are a course creator. Return only valid JSON or plain text as instructed. No markdown, no backticks, no extra commentary.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error: any) {
      const isRateLimited =
        error?.status === 429 ||
        error?.message?.includes('429') ||
        error?.message?.includes('Too many requests');

      if (isRateLimited && retries > 0) {
        const retryAfter = error?.headers?.['retry-after'];
        const waitTime = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.min(10000 * Math.pow(2, 3 - retries), 60000);

        this.logger.warn(
          `Groq rate limited, retrying in ${waitTime / 1000}s... (${retries} left)`,
        );
        await new Promise((res) => setTimeout(res, waitTime));
        return this.generateText(prompt, retries - 1);
      }

      this.logger.error(
        `Groq call failed: status=${error?.status}, message=${error?.message}`,
      );
      throw error;
    }
  }

  async generateChapterTitles(
    courseTitle: string,
    chaptersCount: number,
    difficulty: string,
    description?: string,
  ): Promise<string[]> {
    const chapterTitleStyle: Record<string, string> = {
      beginner:
        'Use accessible language. Focus on fundamentals and getting-started topics.',
      intermediate:
        'Use practical terminology. Focus on real-world patterns and best practices.',
      advanced:
        'Use technical terminology. Focus on advanced concepts, internals, and expert-level topics.',
    };

    const prompt = `
      You are a course creator. Generate ${chaptersCount} chapter titles
      for a ${difficulty} level course on "${courseTitle}".
      ${description ? `Context: ${description}` : ''}
      Each chapter title must be appropriate for ${difficulty} level learners.
      ${chapterTitleStyle[difficulty] || ''}
      Keep each title under 8 words. Be specific and avoid generic labels like "Introduction" or "Overview".
      Return ONLY a valid JSON array of strings. No explanation, no markdown, no backticks.
      Example: ["Python Variables and Data Types", "NestJS Module System Deep Dive"]
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

  async generateChapterDescription(
    courseTitle: string,
    chapterTitle: string,
    difficulty: string,
  ): Promise<string> {
    const descriptionStyle: Record<string, string> = {
      beginner: 'Use accessible language.',
      intermediate:
        'Use moderate technical depth. Assume learners know the basics.',
      advanced: 'Use technical depth.',
    };

    const prompt = `
      Write a single short sentence (max 15 words) describing what a learner will learn
      in a chapter titled "${chapterTitle}" in a ${difficulty} course about "${courseTitle}".
      The tone and vocabulary must match ${difficulty} level.
      ${descriptionStyle[difficulty] || ''}
      Be specific to the chapter content — avoid generic phrases like "Learn the key concepts".
      Return plain text only. No quotes, no markdown.
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

  async generateLessons(
    courseTitle: string,
    chapterTitle: string,
    difficulty: string,
    lessonsCount: number = 3,
    existingTitles: string[] = [],
  ): Promise<GeneratedLesson[]> {
    const difficultyInstructions: Record<string, string> = {
      beginner:
        'Use simple welcoming language. Titles should start with "What is...", "How to...", "Understanding...". '
        + 'Focus on foundational concepts and basic syntax. Avoid jargon.',
      intermediate:
        'Introduce moderate technical depth. Titles should reference real-world patterns, '
        + 'best practices, and common tools. Assume learners know the basics.',
      advanced:
        'Use precise technical terminology. Titles should reference specific advanced concepts '
        + '(e.g. "metaclasses", "descriptors", "GIL internals", "decorator factories"). '
        + 'Focus on internals, optimization, and expert-level patterns.',
    };

    const instruction =
      difficultyInstructions[difficulty] || difficultyInstructions.intermediate;

    const prompt = `
      You are a course creator. Generate exactly ${lessonsCount} lessons for a chapter titled "${chapterTitle}"
      in a ${difficulty} level course about "${courseTitle}".

      CRITICAL rules for lesson titles:
      - Each title must be a SPECIFIC and SEARCHABLE concept, not generic
      - Keep each title under 8 words
      - The titles MUST reflect the ${difficulty} level of the course — do NOT mix levels
      - ${instruction}
      - Bad: "Introduction", "Lesson 1", "Overview", "Getting Started"
      - Titles must be specific enough that searching them on YouTube returns ONE relevant video at the ${difficulty} level
      - NEVER reuse any of these already-used lesson titles: ${JSON.stringify(existingTitles)}

      CRITICAL rules for lesson content:
      - Vary sentence structure. Bad patterns to avoid:
        * "In this lesson, we will..."
        * "This lesson covers..."
        * "By the end of this lesson..."
        * "We will explore/learn/discuss..."
        * "Let's consider a practical example..."
      - Write naturally, as if explaining to a peer developer over a whiteboard
      - Use active voice and direct statements instead of "will" future tense

      Return ONLY a valid JSON array. No markdown, no backticks, no explanation.
      Each item must have exactly these fields:
      - title: specific, searchable, difficulty-appropriate lesson title (string, under 8 words)
      - content: full educational content covering introduction, key concepts, practical example, and summary (string)

      Example format (the titles below are just format references, NOT appropriate for ${difficulty} level):
      [
        { "title": "Lesson concept title here", "content": "Full lesson content here..." }
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
      const fallbackLessonTemplates = [
        { title: `Understanding ${chapterTitle}` },
        { title: `Working with ${chapterTitle}` },
        { title: `${chapterTitle} Best Practices` },
        { title: `Advanced ${chapterTitle} Patterns` },
        { title: `${chapterTitle} in ${courseTitle}` },
      ];
      return fallbackLessonTemplates.slice(0, lessonsCount).map(l => ({
        ...l,
        content: `Comprehensive guide to ${l.title}. Covers key concepts, practical examples, and best practices for ${courseTitle}.`,
      }));
    }
  }
}
