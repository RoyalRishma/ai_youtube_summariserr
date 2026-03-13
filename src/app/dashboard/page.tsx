"use client";

import { useEffect, useState } from 'react';
import { Search, Trash2, ExternalLink, Calendar, Youtube } from 'lucide-react';
import { VideoSummary } from '@/types';
import Link from 'next/link';

export default function Dashboard() {
  const [summaries, setSummaries] = useState<VideoSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const res = await fetch('/api/summaries');
      const data = await res.json();
      setSummaries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this summary?')) return;
    try {
      await fetch(`/api/summaries?id=${id}`, { method: 'DELETE' });
      setSummaries(summaries.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = summaries.filter(s => 
    s.video_title.toLowerCase().includes(search.toLowerCase()) ||
    s.summary_short.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Summaries</h1>
          <p className="text-muted-foreground text-lg">Your personal library of video insights.</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search summaries..."
            className="w-full glass border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 glass border rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((summary) => (
            <div key={summary.id} className="group glass border rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Youtube className="w-6 h-6" />
                </div>
                <button 
                  onClick={() => handleDelete(summary.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight">
                {summary.video_title}
              </h3>
              
              <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                {summary.summary_short}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(summary.created_at).toLocaleDateString()}
                </div>
                <Link 
                  href={summary.video_url} 
                  target="_blank"
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                >
                  Watch <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass border rounded-3xl border-dashed">
          <p className="text-muted-foreground text-lg">No summaries found.</p>
          <Link href="/" className="text-primary font-bold hover:underline mt-2 inline-block">
            Create your first summary
          </Link>
        </div>
      )}
    </div>
  );
}
