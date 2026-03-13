import OpenAI from 'openai';

const apiKey = process.env.GROQ_API_KEY || process.env.OPENROUTER_API_KEY || '';
const baseURL = process.env.GROQ_API_KEY 
  ? 'https://api.groq.com/openai/v1' 
  : 'https://openrouter.ai/api/v1';

const model = process.env.GROQ_API_KEY ? 'llama3-8b-8192' : 'google/gemini-pro';

const openai = new OpenAI({
  apiKey,
  baseURL,
});

export async function generateSummary(transcript: string) {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a professional video summariser. Provide a concise summary, bulleted key points, and final insights.',
        },
        {
          role: 'user',
          content: `Summarise the following video transcript:\n\n${transcript}\n\nFormat the output as JSON with three keys: "short_summary", "bullet_points" (array), and "key_insights" (array).`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('No content returned from AI');

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}
