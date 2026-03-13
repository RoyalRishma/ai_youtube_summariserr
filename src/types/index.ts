export interface VideoSummary {
  id: string;
  video_url: string;
  video_title: string;
  video_thumbnail?: string;
  transcript: string;
  summary_short: string;
  summary_bullets: string[];
  summary_insights: string[];
  created_at: string;
}

export interface SummaryResponse {
  short_summary: string;
  bullet_points: string[];
  key_insights: string[];
}
