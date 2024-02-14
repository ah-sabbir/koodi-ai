import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
//import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import OpenAI from "openai"
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

//const configuration = new Configuration({
//  apiKey: process.env.OPENAI_API_KEY,
//});

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
    "X-Title": process.env.YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
  },
  // dangerouslyAllowBrowser: true,
})

//const openai = new OpenAIApi(configuration);

const instructionMessage: any = {
  role: "system",
  content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
};

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages  } = body;

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

    const response = await openrouter.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages]
    });

    if (!isPro) {
      await incrementApiLimit();
    }
    //console.log('[CODE_API_RESPONSE]', response)
    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
