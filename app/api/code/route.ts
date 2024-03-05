import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
//import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import OpenAI from "openai"
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

import { client } from "@gradio/client";

//const configuration = new Configuration({
//  apiKey: process.env.OPENAI_API_KEY,
//});




const openrouter = new OpenAI({
  baseURL: "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
  apiKey: process.env.HUGGINGFACE_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
    "X-Title": process.env.YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
  },
  // dangerouslyAllowBrowser: true,
})

//const openai = new OpenAIApi(configuration);

const payload: any = [{
  role: "system",
  content: "You are an expert software engineer and software developer you can solve and write clean code as per other's needs. also, you're a code generator too. You must answer only in markdown code snippets. Use code comments for explanations."
}];

// Add your token from https://huggingface.co/settings/token
// const Req_body= {
//   headers:{"Authorization": "Bearer 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"},
//   wait_for_model: true,
//   use_gpu: false,
//   method : "POST",
//   contentType : "application/json",
//   payload: ""
// };


export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages  } = body;

    const quest = {
      role: "user",
      content: [...messages]
    }

    // payload.push(payload)
    // Req_body.payload = JSON.stringify(payload)

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY && !process.env.OPENROUTER_API_KEY) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    // const response = await openrouter.chat.completions.create({
    //   model: "openrouter/auto",
    //   messages: [instructionMessage, ...messages]
    // });

    const response = await fetch("https://api-inference.huggingface.co/models/openai-community/gpt2",
        {
          headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
          method: "POST",
          body: JSON.stringify({inputs:JSON.stringify(payload)}),
        }
      )

      const result = await response.json();

    if (!isPro) {
      await incrementApiLimit();
    }
    console.log('[CODE_API_RESPONSE]', result)
    return NextResponse.json("response.choices[0].message");
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
