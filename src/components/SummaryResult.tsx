"use client";

import { Check, Copy, Share2, Bookmark } from 'lucide-react';
import { useState } from 'react';

interface SummaryResultProps {
  result: {
    video_url: string;
    short_summary: string;
    bullet_points: string[];
    key_insights: string[];
  };
}

export default function SummaryResult({ result }: SummaryResultProps) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCopy = () => {
    const text = `${result.short_summary}\n\nKey Points:\n${result.bullet_points.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const resp = await fetch('/api/summaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_url: result.video_url,
          video_title: 'YouTube Video', // Simplified, could fetch title too
          summary_short: result.short_summary,
          summary_bullets: result.bullet_points,
          summary_insights: result.key_insights,
          transcript: '', // Optional: store transcript if needed
        }),
      });
      if (resp.ok) alert('Saved to dashboard!');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="glass border rounded-3xl p-10 shadow-2xl overflow-hidden relative">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-3xl font-bold">Summary</h2>
          <div className="flex gap-3">
            <button 
              onClick={handleCopy}
              className="p-3 rounded-full hover:bg-secondary transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="p-3 rounded-full hover:bg-secondary transition-colors"
              title="Save to dashboard"
            >
              <Bookmark className={saving ? "w-5 h-5 animate-pulse" : "w-5 h-5"} />
            </button>
          </div>
        </div>

        <p className="text-lg leading-relaxed text-muted-foreground mb-12 italic">
          "{result.short_summary}"
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              Key Points
            </h3>
            <ul className="space-y-4">
              {result.bullet_points.map((point, i) => (
                <li key={i} className="flex gap-4 text-muted-foreground">
                  <span className="text-primary font-bold">{i + 1}.</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-accent rounded-full"></span>
              Insights
            </h3>
            <div className="space-y-4">
              {result.key_insights.map((insight, i) => (
                <div key={i} className="p-4 rounded-2xl bg-secondary/50 border border-border/50">
                  {insight}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
