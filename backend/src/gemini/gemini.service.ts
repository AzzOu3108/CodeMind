import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeneratedLesson {
  title: string;
  content: string;
}

export interface GeneratedChapter {
  title: string;
  content: string;
  lessons: { title: string; content: string }[];
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

      this.logger.error(`Gemini call failed: status=${error?.status}, message=${error?.message}, details=${JSON.stringify(error?.errorDetails || error?.details || 'none')}`);
      throw error;
    }
  }

  // generates the chapter titles for the course
  async generateChapterTitles(
    courseTitle: string,
    chaptersCount: number,
    difficulty: string,
    description?: string
  ): Promise<string[]> {
    const chapterTitleStyle: Record<string, string> = {
      beginner: 'Use accessible language. Focus on fundamentals and getting-started topics.',
      intermediate: 'Use practical terminology. Focus on real-world patterns and best practices.',
      advanced: 'Use technical terminology. Focus on advanced concepts, internals, and expert-level topics.',
    };

    const prompt = `
      You are a course creator. Generate ${chaptersCount} chapter titles
      for a ${difficulty} level course on "${courseTitle}".
      ${description ? `Context: ${description}` : ''}
      Each chapter title must be appropriate for ${difficulty} level learners.
      ${chapterTitleStyle[difficulty] || ''}
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
      this.logger.error('Chapter title generation failed', error?.message || error);
      this.logger.warn('Using fallback chapter titles.');
      const context = courseTitle;
      const fallbackTitles = [
        `Introduction to ${context}`,
        `Core Concepts of ${context}`,
        `Building with ${context}`,
        `Advanced ${context} Techniques`,
        `${context} Best Practices`,
        `${context} Real-World Applications`,
        `${context} Performance & Optimization`,
        `${context} Deep Dive`,
      ];
      return fallbackTitles.slice(0, chaptersCount);
    }
  }

  // generates a short description for a chapter (shown under chapter title in UI)
  async generateChapterDescription(
    courseTitle: string,
    chapterTitle: string,
    difficulty: string
  ): Promise<string> {
    const descriptionStyle: Record<string, string> = {
      beginner: 'Use accessible language.',
      intermediate: 'Use moderate technical depth. Assume learners know the basics.',
      advanced: 'Use technical depth.',
    };

    const prompt = `
      Write a single short sentence (max 15 words) describing what a learner will learn
      in a chapter titled "${chapterTitle}" in a ${difficulty} course about "${courseTitle}".
      The tone and vocabulary must match ${difficulty} level.
      ${descriptionStyle[difficulty] || ''}
      Return plain text only. No quotes, no markdown.
    `;

    try {
      return await this.generateText(prompt);
    } catch (error: any) {
      this.logger.error('Chapter description generation failed', error?.message || error);
      return `Explore ${chapterTitle} in the context of ${courseTitle}.`;
    }
  }

  // generates lessons for a chapter — each lesson is a specific subtopic with content
  async generateLessons(
    courseTitle: string,
    chapterTitle: string,
    difficulty: string,
    lessonsCount: number = 3
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

    const instruction = difficultyInstructions[difficulty] || difficultyInstructions.intermediate;

    const prompt = `
      You are a course creator. Generate exactly ${lessonsCount} lessons for a chapter titled "${chapterTitle}"
      in a ${difficulty} level course about "${courseTitle}".

      CRITICAL rules for lesson titles:
      - Each title must be a SPECIFIC and SEARCHABLE concept, not generic
      - The titles MUST reflect the ${difficulty} level of the course — do NOT mix levels
      - ${instruction}
      - Bad: "Introduction", "Lesson 1", "Overview", "Getting Started"
      - Titles must be specific enough that searching them on YouTube returns ONE relevant video at the ${difficulty} level

      Return ONLY a valid JSON array. No markdown, no backticks, no explanation.
      Each item must have exactly these fields:
      - title: specific, searchable, difficulty-appropriate lesson title (string)
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

  // generates the full course structure — chapters with variable-length lessons (Gemini decides)
  async generateCourseStructure(
    courseTitle: string,
    chaptersCount: number,
    difficulty: string,
    description?: string
  ): Promise<GeneratedChapter[]> {
    const difficultyInstructions: Record<string, string> = {
      beginner:
        'Use accessible language. Focus on fundamentals and getting-started topics. '
        + 'Lessons should start with "What is...", "How to...", "Understanding...".',
      intermediate:
        'Use practical terminology. Focus on real-world patterns and best practices. '
        + 'Assume learners know the basics. Use moderate technical depth.',
      advanced:
        'Use precise technical terminology. Focus on advanced concepts, internals, and expert-level topics. '
        + 'Use technical depth.',
    };

    const prompt = `
      You are a course creator. Generate a ${chaptersCount}-chapter ${difficulty} level course on "${courseTitle}".
      ${description ? `Course context: ${description}` : ''}

      REQUIREMENTS:
      - Each chapter title must be specific and appropriate for ${difficulty} level
      - Each chapter needs a short description (max 15 words) of what the learner will learn
      - Each chapter MUST have between 2 and 6 lessons — NOT a fixed number
      - Complex/foundational chapters should have more lessons (4-6)
      - Simpler/narrower chapters should have fewer lessons (2-3)
      - Vary lesson count based on topic depth and breadth
      - Each lesson title must be a specific, searchable concept
      - Each lesson must have full educational content (intro, key concepts, example, summary)
      - ${difficultyInstructions[difficulty] || ''}

      Return ONLY a valid JSON array. No markdown, no backticks, no explanation.
      Each object:
      - title: chapter title (string)
      - content: chapter description (string, max 15 words)
      - lessons: array of { title: string, content: string }

      Example:
      [
        {
          "title": "Microservices Architecture Fundamentals",
          "content": "Learn core microservices principles and NestJS setup.",
          "lessons": [
            { "title": "What are Microservices?", "content": "Full content here..." }
          ]
        }
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
      this.logger.error('Course structure generation failed', error?.message || error);
      this.logger.warn('Using fallback course structure.');

      const displayTitle = courseTitle
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const chapterThemes = [
        { title: `Introduction to ${displayTitle}`, content: `Get started with ${displayTitle} fundamentals.` },
        { title: `${displayTitle} Core Architecture`, content: `Understand the key architectural patterns.` },
        { title: `Building with ${displayTitle}`, content: `Learn practical implementation strategies.` },
        { title: `Advanced ${displayTitle} Techniques`, content: `Master advanced topics and optimizations.` },
        { title: `${displayTitle} Best Practices`, content: `Production-ready patterns and conventions.` },
        { title: `${displayTitle} Real-World Applications`, content: `Apply concepts in real-world scenarios.` },
        { title: `${displayTitle} Performance & Optimization`, content: `Optimize performance and scalability.` },
        { title: `${displayTitle} Deep Dive`, content: `In-depth exploration of internals.` },
      ];

      const lessonSets = [
        [
          `What is ${displayTitle}?`,
          `${displayTitle} Architecture Overview`,
          `Key Concepts in ${displayTitle}`,
        ],
        [
          `Setting Up ${displayTitle}`,
          `${displayTitle} Configuration`,
          `${displayTitle} Development Workflow`,
        ],
        [
          `${displayTitle} Design Patterns`,
          `Implementing ${displayTitle}`,
          `${displayTitle} Code Examples`,
        ],
        [
          `Advanced ${displayTitle} Topics`,
          `${displayTitle} Performance Tuning`,
          `${displayTitle} Security Considerations`,
        ],
        [
          `${displayTitle} Testing Strategies`,
          `${displayTitle} Deployment Guide`,
          `${displayTitle} Monitoring & Logging`,
        ],
        [
          `${displayTitle} in Production`,
          `${displayTitle} Troubleshooting`,
          `${displayTitle} Scaling Strategies`,
        ],
      ];

      return chapterThemes.slice(0, chaptersCount).map((chapter, i) => {
        const set = lessonSets[i % lessonSets.length];
        return {
          title: chapter.title,
          content: chapter.content,
          lessons: set.map(title => ({
            title,
            content: `Comprehensive guide to ${title}. Covers key concepts, practical examples, and best practices for ${displayTitle}.`,
          })),
        };
      });
    }
  }
}