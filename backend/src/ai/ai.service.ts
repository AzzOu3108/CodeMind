import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Groq } from 'groq-sdk';
import { jsonrepair } from 'jsonrepair';

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

  private readonly difficultyMatrix: Record<string, { assumes: string; focus: string; code: string; skip: string }> = {
    beginner: {
      assumes: 'no prior knowledge of this topic',
      focus: 'concepts, what it is, how to set it up, simple isolated examples',
      code: 'copy-paste ready snippets, one concept at a time, minimal lines, lots of comments',
      skip: 'nothing — explain everything from scratch',
    },
    intermediate: {
      assumes: 'knows the framework basics and common patterns',
      focus: 'real-world integration, error handling, testing, common mistakes, project structure',
      code: 'structured project files with error handling, configuration, multiple related pieces',
      skip: 'basic setup steps, definitions of the technology, what-is explanations',
    },
    advanced: {
      assumes: 'production experience with this framework',
      focus: 'performance optimization, security edge cases, internals, custom implementations',
      code: 'production-grade with error boundaries, logging, validations, edge case handling',
      skip: 'anything introductory, conceptual explanations, basic setup',
    },
  };

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
        temperature: 0.3,
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
    const matrix = this.difficultyMatrix[difficulty] || this.difficultyMatrix.beginner;

    const prompt = `
      You are a course creator. Generate ${chaptersCount} chapter titles
      for a ${difficulty} level course on "${courseTitle}".
      ${description ? `Context: ${description}` : ''}
      ${techStack ? `CRITICAL — The course uses ONLY ${techStack}. The description may mention other technologies, but you MUST IGNORE them and use ${techStack} exclusively. Include "${techStack}" in chapter titles when relevant (e.g. "JWT Authentication with Spring Boot Security").` : ''}
      DIFFICULTY LEVEL: ${difficulty}
      LEARNER ASSUMES: ${matrix.assumes}
      CONTENT FOCUS: ${matrix.focus}
      CODE EXAMPLES: ${matrix.code}
      EXPLICITLY SKIP: ${matrix.skip}
      Keep each title under 8 words. Be specific and avoid generic labels like "Introduction" or "Overview".
      Return ONLY a valid JSON array of strings. No explanation, no markdown, no backticks.
      Example: ["Python Variables and Data Types", "NestJS Module System Deep Dive"]
    `;

    try {
      const raw = await this.generateText(prompt);
      return JSON.parse(jsonrepair(raw.replace(/```json|```/g, '').trim()));
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
    const matrix = this.difficultyMatrix[difficulty] || this.difficultyMatrix.beginner;

    const prompt = `
      Write a single short sentence (max 15 words) describing what a learner will learn
      in a chapter titled "${chapterTitle}" in a ${difficulty} course about "${courseTitle}".
      ${techStack ? `CRITICAL — The course uses ONLY ${techStack}. Ignore any other technologies mentioned elsewhere. Reference ${techStack} in the description.` : ''}
      DIFFICULTY LEVEL: ${difficulty}
      LEARNER ASSUMES: ${matrix.assumes}
      CONTENT FOCUS: ${matrix.focus}
      CODE EXAMPLES: ${matrix.code}
      EXPLICITLY SKIP: ${matrix.skip}
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
    const matrix = this.difficultyMatrix[difficulty] || this.difficultyMatrix.intermediate;

    const codeExamples = `
      Each lesson content must contain:
      - Copy-paste code examples in fenced blocks with language tags
      - CLI/terminal commands in bash blocks (e.g. npm install, pip install)
      - Show outputs, errors, config files where relevant
      - Official download links for any tool or package mentioned
      - Only use official domains (github.com, npmjs.com, python.org, etc.)
      CRITICAL — Every code and command block MUST start with triple backticks and a language tag (e.g. \`\`\`typescript, \`\`\`bash).
      Never write bare language names like "typescript" or "bash" alone — always wrap them in triple backticks.`;

    const techStackInstruction = techStack
      ? `\nTECHNOLOGY STACK: The course uses ONLY ${techStack} — ignore any conflicting technologies mentioned in the course description. ALL code examples, commands, installation instructions, and configuration MUST use this technology.\n- Use the appropriate language, framework, package manager, and ecosystem for ${techStack}.\n- Include framework-specific setup, patterns, and best practices.`
      : '';

    const prompt = `
      You are a course creator. Generate exactly ${lessonsCount} lessons for a chapter titled "${chapterTitle}"
      in a ${difficulty} level course about "${courseTitle}".${techStackInstruction}

      DIFFICULTY LEVEL: ${difficulty}
      LEARNER ASSUMES: ${matrix.assumes}
      CONTENT FOCUS: ${matrix.focus}
      CODE EXAMPLES: ${matrix.code}
      EXPLICITLY SKIP: ${matrix.skip}

      TITLE RULES:
      - Specific, searchable concept under 8 words
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
      return JSON.parse(jsonrepair(raw.replace(/```json|```/g, '').trim()));
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
      const setupCommands: Record<string, string> = {
        python: 'python --version\\npip --version',
        java: 'java --version\\nmvn --version',
        javascript: 'node --version\\nnpm --version',
        go: 'go version',
        dart: 'dart --version',
      };

      const fallbackLessonTemplates = [
        { title: `Understanding ${chapterTitle}` },
        { title: `Working with ${chapterTitle}` },
        { title: `${chapterTitle} in Practice` },
        { title: `Advanced ${chapterTitle}` },
        { title: `${chapterTitle} Best Practices` },
      ];
      return fallbackLessonTemplates.slice(0, lessonsCount).map((l, i) => ({
        ...l,
        content: `## ${l.title}\\n\\n### Overview\\n\\n${
          l.title
        } explores ${chapterTitle.toLowerCase()} in the context of ${courseTitle} using ${tech}. This is${
          i === 0 ? ' your starting point for understanding the fundamental concepts.' :
          i === 1 ? ' where you will dive deeper into practical implementations and patterns.' :
          i === 2 ? ' focused on applying the concepts in real-world scenarios.' :
          i === 3 ? ' for mastering advanced techniques and optimizations.' :
          ' where you learn industry-standard approaches and common pitfalls to avoid.'
        }\\n\\n### Prerequisites\\n\\n- Basic familiarity with ${tech}\\n- Development environment ready for ${lang}\\n\\n\`\`\`bash\\n${
          setupCommands[lang] || setupCommands.javascript
        }\\n\`\`\`\\n\\n### What You'll Learn\\n\\n- Core principles of ${chapterTitle.toLowerCase()} with ${tech}\\n- How to implement and integrate it in your projects\\n- Common patterns, best practices, and debugging tips\\n\\n### Key Points\\n\\n- Start with small examples to build understanding\\n- Follow official ${tech} documentation for details\\n- Test each implementation before moving forward\\n\\n### Next Steps\\n\\nProceed to the next lesson to expand on these concepts with practical examples and hands-on exercises.`,
      }));
    }
  }
}
