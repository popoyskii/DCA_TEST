import openai, { checkRun } from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { run_id, thread_id } = await request.json();
  try {
    const response = await checkRun(thread_id, run_id);

    return NextResponse.json(response);
  } catch (error: any) {
    throw new Error(`[generateSummary] => ${error}`);
  }
}
