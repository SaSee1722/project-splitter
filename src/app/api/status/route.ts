import { NextResponse } from 'next/server';

export async function GET() {
  const hasEnvKey = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.trim() !== '' &&
    process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
  );

  return NextResponse.json({
    hasEnvKey,
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  });
}
