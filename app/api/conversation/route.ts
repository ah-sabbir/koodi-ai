import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
// import { Configuration, OpenAIApi } from "openai";
import OpenAI from "openai"
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";


// const openrouter = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY,
//   defaultHeaders: {
//     "HTTP-Referer": process.env.YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
//     "X-Title": process.env.YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
//   },
//   // dangerouslyAllowBrowser: true,
// })

// const openrouter = new OpenAI()

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const getTemplate = (prompt:Zod.ZodString)=> {
  return JSON.stringify({
    inputs: `<s>[INST]Please ignore all previous instructions. I want you to only answer in English. Please answer the following question about the opened page content to the best of your ability and provided context. Be precise and helpful. Do not hallucinate and do not come up with facts you are not sure about. elaborate the answer as much possible. [CONTEXT]: personal assistance. [QUESTION]:${prompt}[/INST]`,
    parameters: {
        "return_full_text": false
    },
    stream: false,
    options: {
        dont_load_model: false,
        signal: {name: "koodi.ai"},
        use_cache: true,
        wait_for_model: true
    }
  })
}

// const openai = new OpenAIApi(configuration);

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
      return new NextResponse("API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   messages
    // });

    // const response = await openrouter.chat.completions.create({
    //   model: "openrouter/auto",
    //   messages
    // })

    // console.log("openai response: ", response)


    const response = await fetch(
      'https://api-inference.huggingface.co/models/google/gemma-7b-it', 
      //   // url: "https://api-inference.huggingface.co/models/EleutherAI/gpt-neox-20b",
      //   // url: "https://api-inference.huggingface.co/models/google/gemma-2b-it",
      //   url: "https://api-inference.huggingface.co/models/google/gemma-7b-it",
      //   // url: "https://api-inference.huggingface.co/models/codellama/CodeLlama-70b-Instruct-hf",
      //   // url: "https://api-inference.huggingface.co/models/openchat/openchat-3.5-0106",
      //   // url: "https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-33b-instruct",
      //   // url: "https://ahsabbir104-openchat-openchat-3-5-0106.hf.space/run/predict",
      {
      method: 'POST',
      body:getTemplate(messages.slice(-1)[0].content),
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
      }
    });
    const result = await response.json();


// Access Limit for the users
    // if (!isPro) {
    //   await incrementApiLimit();
    // }

    return NextResponse.json({role:'bot', content: result[0].generated_text});
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
