import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
//import { Configuration, OpenAIApi } from "openai";

import OpenAI from "openai"

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

//const configuration = new Configuration({
//  apiKey: process.env.OPENAI_API_KEY,
//});

import Replicate from "replicate";


const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});


//const openai = new OpenAIApi(configuration);


const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
    "X-Title": process.env.YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
  },
  // dangerouslyAllowBrowser: true,
})

const instructionMessage: any = {
  role: "system",
  content: "You are a graphics designer. You must design any graphics or image. Use stable diffusion."
};


export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

console.log('[USER_ID]',userId)
  const guser = await fetch(`https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/google`)

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY && !process.env.OPENROUTER_API_KEY) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    //const response = await openrouter.createImage({
    //  prompt,
    //  n: parseInt(amount, 10),
   //   size: resolution,
   // });


  //const completion = await openrouter.images.generate({
  //  model: "gpt-3.5-turbo",
  //  messages: [instructionMessage, ...prompt]
  //})

  //const completion = await openrouter.images.generate({
  //  model: "GPT-3.5-Turbo",
  //  prompt: [instructionMessage, ...prompt],
  //  n: parseInt(amount,10),
 //   size: resolution
 // })

//console.log('[IMAGE-GENERATOR]', response)
console.log('[PROMPT]', prompt)


    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json({status:200});
  } catch (error) {
    console.log('[IMAGE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
