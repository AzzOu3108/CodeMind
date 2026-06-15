export type CurrentUser = {
    id: number;
    name: string;
    email: string;
    avatar: string;
    create_at: string;
}

export type Course = {
  id: number;
  title: string;
  description: string;
  progress: number;
  chapiter_count: number;
  include_video: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
}