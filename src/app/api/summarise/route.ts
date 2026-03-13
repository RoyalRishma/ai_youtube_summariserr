import { NextRequest, NextResponse } from 'next/server';
import { getTranscript } from '@/lib/youtube';
import { generateSummary } from '@/lib/ai';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { videoUrl } = await req.json();

    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    // 1. Extract Transcript
    const transcript = await getTranscript(videoUrl);

    // 2. Generate AI Summary
    const summaryData = await generateSummary(transcript);

    // 3. Save to Supabase (Optional: User can save manually or auto-save)
    // For now, we just return the result to the frontend
    
    return NextResponse.json({
      video_url: videoUrl,
      transcript,
      ...summaryData
    });
  } catch (error: any) {
    console.error('Summarisation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
