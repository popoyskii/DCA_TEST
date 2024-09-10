import { databases } from "@/appwrite";
import openai, {
  addFile,
  checkRun,
  createAndRunThread,
  createAssistant,
} from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url, id } = await request.json();
    console.log("Received file URL:", url);

    const instructions = `
      Analyze the construction project files and provide a prescriptive analysis. 
      Identify areas for improvement, optimize workflow, ensure timely completion, and improve overall efficiency. 
      Additionally, include sample materials, project cost estimations, and project timelines based on the data provided.
      The analysis should cover the following:
      1. Detailed analysis of resource allocation, task prioritization, risk management, and cost control.
      2. Sample materials required for the project.
      3. Project cost estimations based on the data provided, with all amounts in PHP (₱).
      4. A breakdown of costs for different sections such as Masonry Works, Steel Works, Painting Works, etc.
      5. Project timelines indicating the estimated start and end dates for each major task.
      6. Any assumptions made during the analysis should be explicitly stated.
      The output should include data that can be used to generate bar and pie charts for better visualization.
    `;

    const content = `
      You are an expert in construction project management with extensive experience in analyzing project files, identifying areas for improvement, and providing professional recommendations. 
      Given the files related to a construction project's to-do list, perform a prescriptive analysis to optimize the project's workflow, ensure timely completion, and improve overall efficiency. 
      Consider aspects such as resource allocation, task prioritization, risk management, cost control, and project timelines. 
      Provide actionable recommendations based on best practices in the construction industry. 

      Include the following:
      1. Detailed analysis of resource allocation, task prioritization, risk management, and cost control.
      2. Sample materials required for the project.
      3. Project cost estimations based on the data provided, with all amounts in PHP (₱).
      4. A breakdown of costs for different sections such as Masonry Works, Steel Works, Painting Works, etc.
      5. Project timelines indicating the estimated start and end dates for each major task.
      6. Any assumptions made during the analysis should be explicitly stated.
      The output should always include data that can be used to generate bar and pie charts for chart.js better visualization.
    `;

    console.log("Adding file to OpenAI...");
    const file = await addFile(url);
    console.log("File added:", file);

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLETION_ID!,
      id,
      {
        convertedData: file.id,
      }
    );

    console.log("Creating assistant...");
    const asst = await createAssistant({
      instructions,
    });
    console.log("Assistant created:", asst);

    console.log("Creating and running thread...");
    const run = await createAndRunThread({
      assistant_id: asst.id,
      content,
      file_id: file.id,
      instructions,
    });
    console.log("Thread created and run:", run);

    console.log("Checking run status...");
    const status = await checkRun(run.thread_id, run.id);
    console.log("Run status:", status);

    return NextResponse.json(status);
  } catch (error) {
    console.error(`[generateRecommendation] Error: ${error}`);
    return NextResponse.json({
      error: `[generateRecommendation] Error: ${error}`,
    });
  }
}
