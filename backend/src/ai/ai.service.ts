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
              'You are a course creator. Return only valid JSON or plain text as instructed. When using markdown, only use fenced code blocks with language tags (```language) and inline code. No extra commentary.',
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
    techStack?: string,
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
      ${techStack ? `The course uses ${techStack}. Include this technology in chapter titles when relevant (e.g. "JWT Authentication with Spring Boot Security").` : ''}
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
    techStack?: string,
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
      ${techStack ? `The course uses ${techStack}. Reference this technology in the description.` : ''}
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
    techStack?: string,
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

    const codeExamples = `
      Each lesson content must contain:
      - Copy-paste code examples in fenced blocks with language tags
      - CLI/terminal commands in bash blocks (e.g. npm install, pip install)
      - Show outputs, errors, config files where relevant
      - Official download links for any tool or package mentioned
      - Only use official domains (github.com, npmjs.com, python.org, etc.)`;

    const techStackInstruction = techStack
      ? `\nTECHNOLOGY STACK: The course uses ${techStack}. ALL code examples, commands, installation instructions, and configuration MUST use this technology.\n- Use the appropriate language, framework, package manager, and ecosystem for ${techStack}.\n- Include framework-specific setup, patterns, and best practices.`
      : '';

    const prompt = `
      You are a course creator. Generate exactly ${lessonsCount} lessons for a chapter titled "${chapterTitle}"
      in a ${difficulty} level course about "${courseTitle}".${techStackInstruction}

      TITLE RULES:
      - Specific, searchable concept under 8 words
      - Reflect ${difficulty} level
      ${instruction}
      - Avoid: "Introduction", "Overview", "Getting Started"
      - Never reuse: ${JSON.stringify(existingTitles)}

      CONTENT RULES:
      - Self-contained — learn by reading only, no external searches
      - Natural peer-to-peer tone, active voice, no "In this lesson"
      ${codeExamples}
      - Start with motivation, use markdown headings (##), bullet steps, end with key takeaways
      - Escape all " inside content as \\", use \\n for newlines

      Return ONLY valid JSON array. Format:
      [
        { "title": "Title here", "content": "## Section\\n\\nExplanation.\\n\\n\`\`\`lang\\ncode\\n\`\`\`" }
      ]
    `;

    try {
      const raw = await this.generateText(prompt);
      try {
        return JSON.parse(raw);
      } catch {
        const cleaned = raw.replace(/```json|```/g, '').trim();
        try {
          return JSON.parse(cleaned);
        } catch {
          // 1. Remove trailing commas before ] or }
          const noTrailing = cleaned.replace(/,\s*([}\]])/g, '$1');
          try {
            return JSON.parse(noTrailing);
          } catch {
            // 2. Char-by-char: fix newlines + unescaped quotes inside strings
            let sanitized = '';
            let inStr = false;
            let esc = false;
            for (const ch of noTrailing) {
              if (esc) { sanitized += ch; esc = false; continue; }
              if (ch === '\\') { sanitized += ch; esc = true; continue; }
              if (ch === '"') { inStr = !inStr; sanitized += ch; continue; }
              if (inStr && ch === '\n') { sanitized += '\\n'; continue; }
              sanitized += ch;
            }
            return JSON.parse(sanitized);
          }
        }
      }
    } catch (error: any) {
      this.logger.error('Lesson generation failed', error?.message || error);
      this.logger.warn('Using fallback lessons.');
      const tech = techStack || 'the chosen technology';
      const lang = tech === 'django' || tech === 'flask' || tech === 'fastapi' ? 'python'
        : tech === 'spring-boot' ? 'java'
        : tech === 'express' || tech === 'nestjs' || tech === 'nextjs' || tech === 'react' || tech === 'vue' || tech === 'angular' ? 'javascript'
        : tech === 'go' ? 'go'
        : tech === 'flutter' ? 'dart'
        : 'javascript';
      const fallbackLessonTemplates = [
        { title: `Introduction to ${chapterTitle}` },
        { title: `${chapterTitle} Core Concepts` },
        { title: `${chapterTitle} in Practice` },
        { title: `Advanced ${chapterTitle}` },
        { title: `${chapterTitle} Best Practices` },
      ];
      return fallbackLessonTemplates.slice(0, lessonsCount).map(l => ({
        ...l,
        content: `## ${l.title}\\n\\nThis section covers ${chapterTitle.toLowerCase()} using ${tech}.\\n\\n### Key Concepts\\n\\n- Understanding the fundamentals of ${l.title}\\n- Practical implementation with ${tech}\\n- Common patterns and best practices\\n\\n### Code Example\\n\\n\`\`\`${lang}\\n// Example: ${l.title}\\n// Implement this based on your specific requirements\\n\`\`\`\\n\\n### Summary\\n\\n${l.title} is a key topic in ${courseTitle}. Practice with ${tech} to build real-world applications.`,
      }));
    }
  }
}
