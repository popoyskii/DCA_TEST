import OpenAI from "openai";
import { v4 as uuidV4 } from "uuid";

const openai = new OpenAI({
  organization: "org-1hDhZPpQsratK0yBJGtIBLkT",
  project: "proj_vayRI5tE5Dv2f0850auMdh7X",
  apiKey: process.env.OPENAI_APIKEY_SECRET,
});

export const addFile = async (filepath: string) => {
  try {
    const response = await openai.files.create({
      file: await fetch(filepath),
      purpose: "assistants",
    });

    return response;
  } catch (error: any) {
    throw new Error(`[addFile] => ${error}`);
  }
};

export const createAssistant = async ({
  instructions,
  description = "",
}: {
  instructions: string;
  description?: string;
}) => {
  try {
    const response = await openai.beta.assistants.create({
      model: "gpt-3.5-turbo",
      name: `asst_${uuidV4()}`,
      instructions,
      description,
      tools: [
        {
          type: "file_search",
        },
      ],
    });

    return response;
  } catch (error: any) {
    throw new Error(`[createAssistant] => ${error}`);
  }
};

export const createThread = async ({
  content,
  file_id,
}: {
  content: string;
  file_id: string;
}) => {
  try {
    const messageThread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content,
          attachments: [{ file_id }],
        },
      ],
    });

    return messageThread;
  } catch (error: any) {
    throw new Error(`[createThread] => ${error}`);
  }
};

export const createAndRunThread = async ({
  assistant_id,
  instructions = "",
  content,
  file_id,
}: {
  assistant_id: string;
  instructions?: string;
  content: string;
  file_id: string;
}) => {
  try {
    const run = await openai.beta.threads.createAndRun({
      assistant_id,
      thread: {
        messages: [
          {
            role: "user",
            content,
            attachments: [
              {
                file_id,
                tools: [
                  {
                    type: "file_search",
                  },
                ],
              },
            ],
          },
        ],
      },
      instructions,
      model: "gpt-3.5-turbo",
    });

    return run;
  } catch (error: any) {
    throw new Error(`[createAndRunThread] => ${error}`);
  }
};

export const checkRun = async (threadId: string, runId: string) => {
  try {
    const response = await openai.beta.threads.runs.retrieve(threadId, runId);
    return response;
  } catch (error: any) {
    throw new Error(`[checkRun] => ${error}`);
  }
};

export default openai;
