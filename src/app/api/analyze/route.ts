import { NextRequest, NextResponse } from 'next/server';
import { ProjectInput } from '@/types/project';
import { analyzeProjectWithGemini, generateSolutionWithGemini } from '@/services/geminiService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Header override if passed from frontend secure settings
    const headerKey = req.headers.get('x-gemini-api-key');
    const effectiveApiKey = headerKey || body?.apiKey || process.env.GEMINI_API_KEY;

    // ─── Mode: Quick Solution Generation ────────────────────────
    if (body?.mode === 'generate-solution') {
      const problemStatement = body.problemStatement;
      const projectName = body.projectName || 'Project';

      if (!problemStatement || typeof problemStatement !== 'string' || problemStatement.trim().length < 10) {
        return NextResponse.json(
          { error: 'Please enter a problem statement first (at least 10 characters).' },
          { status: 400 }
        );
      }

      const result = await generateSolutionWithGemini(projectName, problemStatement.trim(), effectiveApiKey);
      return NextResponse.json({
        success: true,
        solution: result.solution,
        source: result.source,
      });
    }

    const { input, apiKey: clientApiKey } = body as { input: ProjectInput; apiKey?: string };
    const analysisApiKey = effectiveApiKey || clientApiKey;

    // 1. Validation: Project Name
    if (!input || !input.projectName || input.projectName.trim() === '') {
      return NextResponse.json(
        { error: 'Project name is required.' },
        { status: 400 }
      );
    }

    // 2. Validation: Problem Statement
    if (!input.problemStatement || input.problemStatement.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide a descriptive problem statement or idea (at least 10 characters).' },
        { status: 400 }
      );
    }

    // 3. Validation: Team Members
    if (!Array.isArray(input.teamMembers) || input.teamMembers.length === 0) {
      return NextResponse.json(
        { error: 'At least one team member must be added to distribute work.' },
        { status: 400 }
      );
    }

    // 4. Validation: Empty or Duplicate Team Member Names
    const memberNames = new Set<string>();
    for (const member of input.teamMembers) {
      const trimmed = member.name?.trim();
      if (!trimmed) {
        return NextResponse.json(
          { error: 'All team members must have a non-empty name.' },
          { status: 400 }
        );
      }
      const lower = trimmed.toLowerCase();
      if (memberNames.has(lower)) {
        return NextResponse.json(
          { error: `Duplicate team member detected: "${trimmed}". Each team member must have a unique name.` },
          { status: 400 }
        );
      }
      memberNames.add(lower);
    }

    // 5. Validation: If planned screens is YES, check they have names
    if (input.hasPlannedScreens && Array.isArray(input.plannedScreens)) {
      for (const s of input.plannedScreens) {
        if (!s.name || s.name.trim() === '') {
          return NextResponse.json(
            { error: 'Planned screens cannot be blank. Please enter screen names or remove empty entries.' },
            { status: 400 }
          );
        }
      }
    }

    // 6. Perform Analysis with Gemini
    const result = await analyzeProjectWithGemini(input, effectiveApiKey);

    return NextResponse.json({
      success: true,
      blueprint: result.blueprint,
      source: result.source,
      modelUsed: result.source === 'gemini' ? (process.env.GEMINI_MODEL || 'gemini-1.5-flash') : 'Architect Engine (Deterministic Local AI)',
    });
  } catch (error: any) {
    console.error('API /api/analyze error:', error);
    return NextResponse.json(
      {
        error: error.message || 'An unexpected error occurred during project analysis.',
      },
      { status: 500 }
    );
  }
}
