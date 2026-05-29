export const TECH_STACKS = [
  { value: 'spring-boot', label: 'Spring Boot (Java)' },
  { value: 'django', label: 'Django (Python)' },
  { value: 'flask', label: 'Flask (Python)' },
  { value: 'fastapi', label: 'FastAPI (Python)' },
  { value: 'express', label: 'Express (Node.js)' },
  { value: 'nestjs', label: 'NestJS (Node.js/TypeScript)' },
  { value: 'nextjs', label: 'Next.js (React/Full Stack)' },
  { value: 'aspnet', label: 'ASP.NET Core (C#)' },
  { value: 'laravel', label: 'Laravel (PHP)' },
  { value: 'rails', label: 'Ruby on Rails' },
  { value: 'go', label: 'Go (Golang)' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'flutter', label: 'Flutter (Dart)' },
  { value: 'react-native', label: 'React Native' },
] as const;

export type TechStack = typeof TECH_STACKS[number]['value'];
