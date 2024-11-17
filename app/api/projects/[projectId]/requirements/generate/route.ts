import { NextResponse } from 'next/server';
import { generateRequirements, type RequirementPrompt } from '@/lib/openai';

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    const prompt = body as RequirementPrompt;

    const questions = await generateRequirements(prompt);
    return NextResponse.json({ questions });

  } catch (error) {
    console.error('Error generating requirements:', error);
    return NextResponse.json(
      { error: 'Failed to generate requirements', details: (error as Error).message },
      { status: 500 }
    );
  }
}

