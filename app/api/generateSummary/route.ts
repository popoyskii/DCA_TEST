import openai from "@/openai";
import { NextResponse, } from "next/server";

export async function  POST (request:Request) {
    //todos in the body of the POST req
    const{ todos } = await request.json();
    // console.log(todos);

    //prompt
    

    //communicate with openAI GPT
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        n: 1,
        stream: false,
        messages: [
            {
                role: "system",
                content: `When responding, welcome the user always as DCAmbal and say welcome to your Dashboard! also call the todos as construction projects`,
            },
            {
                role: "user",
                content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To do, in progress and done, and have a very short suggestion about the tasks then tell the user to have a productive day! Here's the data ${JSON.stringify(
                    todos
                )}`,
            },
        ],
    });


    // console.log("DATA IS: ", response);
    // console.log(response.choices[0].message);

    return NextResponse.json(response.choices[0].message);


    
}