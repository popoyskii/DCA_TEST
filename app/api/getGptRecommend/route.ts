import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  //todos in the body of the POST req
  const { thread_id, msg_id } = await request.json();
  // console.log(todos);

  //prompt

  try {
    //communicate with openAI GPT
    const myThread = await openai.beta.threads.messages.retrieve(
      thread_id,
      msg_id
    );

    // console.log("DATA IS: ", response);
    // console.log(response.choices[0].message);

    return NextResponse.json(myThread);
  } catch (error: any) {
    throw new Error(`[getRecommend] => ${error}`);
  }
}
