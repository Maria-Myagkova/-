export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  }
  return (await res.json()) as T;
}

export type Quote = {
  text: string;
  author?: string | null;
};

export type TimelineEvent = {
  id: number;
  year: number;
  title: string;
  description: string;
  short_description?: string | null;
  sort_order: number;
  is_central?: boolean;
};

export type SectionListItem = {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  image_url?: string | null;
  sort_order: number;
};

export type SectionContentBlock = {
  id: number;
  heading: string;
  anchor: string;
  content: string;
  images: string[];
  documents: string[];
  sort_order: number;
};

export type SectionContent = {
  section_id: number;
  slug: string;
  title: string;
  short_description: string;
  image_url?: string | null;
  blocks: SectionContentBlock[];
};

export type QuizQuestion = {
  id: number;
  section_id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
};

export type QuizCheckResult = {
  correct: boolean;
  correct_option: number;
  explanation?: string | null;
};

export type AboutContent = {
  id: number;
  goal: string;
  mission: string;
  relevance: string;
  sources: string;
  team_members: { name: string; role: string; photo_url?: string | null }[];
};

export type Myth = {
  id: number;
  title: string;
  description: string;
  truth: string;
  category: "politics" | "tech" | "personality";
  is_true: boolean;
  votes_for_true: number;
  votes_for_false: number;
  sort_order: number;
};

