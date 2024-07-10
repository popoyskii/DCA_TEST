import openai, { checkRun } from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { thread_id } = await request.json();
  try {
    const response = await openai.beta.threads.messages.list(thread_id);

    return NextResponse.json(response);
  } catch (error: any) {
    throw new Error(`[generateSummary] => ${error}`);
  }
}
