import openai, {
  addFile,
  checkRun,
  createAndRunThread,
  createAssistant,
} from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { url } = await request.json();
  console.log(url);

  const instructions = "Analyze the construction project files and provide a prescriptive analysis. Identify areas for improvement, optimize workflow, ensure timely completion, and improve overall efficiency. Additionally, include sample materials and project cost estimations based on the data provided.";

  const content = `
  You are an expert in construction project management with extensive experience in analyzing project files, identifying areas for improvement, and providing professional recommendations. Given the files related to a construction project's to-do list, perform a prescriptive analysis to optimize the project's workflow, ensure timely completion, and improve overall efficiency. Consider aspects such as resource allocation, task prioritization, risk management, and cost control. Provide actionable recommendations based on best practices in the construction industry. 

  Include the following:
  1. Detailed analysis of resource allocation, task prioritization, and risk management.
  2. Sample materials required for the project.
  3. Project cost estimations based on the data provided, with all amounts in PHP (₱).
  `;

  try {
    const file = await addFile(url);
    const asst = await createAssistant({
      instructions,
    });

    const run = await createAndRunThread({
      assistant_id: asst.id,
      content,
      file_id: file.id,
      instructions,
    });

    console.log(run);

    const status = await checkRun(run.thread_id, run.id);

    return NextResponse.json(status);
  } catch (error) {
    throw new Error(`[generateRecommendation] => ${error}`);
  }
}
