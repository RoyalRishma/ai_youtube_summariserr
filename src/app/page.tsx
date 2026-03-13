"use client";

import { useState } from 'react';
import { Search, Loader2, Sparkles, Youtube } from 'lucide-react';
import { cn } from '@/lib/utils';
import SummaryResult from '@/components/SummaryResult';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSummarise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/summarise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: url }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="text-center mb-16 animate-float">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border text-accent text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Powered by Llama 3 & Gemini Pro
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          YouTube Summaries <br /> Simplified.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get key insights and bullet points from any YouTube video in seconds.
          Stop scrolling, start learning.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-20">
        <form onSubmit={handleSummarise} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
          <div className="relative flex items-center glass border rounded-2xl p-2 pl-6">
            <Youtube className="w-6 h-6 text-muted-foreground mr-4" />
            <input
              type="text"
              placeholder="Paste YouTube video URL here..."
              className="flex-1 bg-transparent border-none outline-none py-4 text-lg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              disabled={loading || !url}
              className={cn(
                "px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2",
                loading || !url 
                  ? "bg-muted text-muted-foreground cursor-not-allowed" 
                  : "bg-primary text-white hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
              )}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Summarise"}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      </div>

      {result && <SummaryResult result={result} />}
    </div>
  );
}
