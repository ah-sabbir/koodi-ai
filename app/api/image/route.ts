import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
//import { Configuration, OpenAIApi } from "openai";
import { join } from "path";
import OpenAI from "openai"

import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

//const configuration = new Configuration({
//  apiKey: process.env.OPENAI_API_KEY,
//});

// import Replicate from "replicate";


// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN,
// });


//const openai = new OpenAIApi(configuration);


// const openrouter = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY,
//   defaultHeaders: {
//     "HTTP-Referer": process.env.YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
//     "X-Title": process.env.YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
//   },
//   // dangerouslyAllowBrowser: true,
// })

// const instructionMessage: any = {
//   role: "system",
//   content: "You are a graphics designer. You must design any graphics or image. Use stable diffusion."
// };


const getTemplate = (prompt:Zod.ZodString)=> {
  return JSON.stringify({
    inputs: `<s>[INST]Please ignore all previous instructions. I want you to only answer in English. Please answer the following question about the opened page content to the best of your ability and provided context. Be precise and helpful. Do not hallucinate and do not come up with facts you are not sure about. elaborate the answer as much possible. [CONTEXT]: You are a graphics designer. You must design any graphics or image. Use stable diffusion.. [COMMAND]:${prompt}[/INST]`,
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



export async function POST(
  req: Request,
  res: NextResponse
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

// console.log('[USER_ID]',userId)
  // const guser = await fetch(`https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/google`)

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
// console.log('[PROMPT]', prompt)


const response = await fetch(
  // 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0', 
  'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2', 
  //   // url: "https://api-inference.huggingface.co/models/EleutherAI/gpt-neox-20b",
  //   // url: "https://api-inference.huggingface.co/models/google/gemma-2b-it",
  //   url: "https://api-inference.huggingface.co/models/google/gemma-7b-it",
  //   // url: "https://api-inference.huggingface.co/models/codellama/CodeLlama-70b-Instruct-hf",
  //   // url: "https://api-inference.huggingface.co/models/openchat/openchat-3.5-0106",
  //   // url: "https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-33b-instruct",
  //   // url: "https://ahsabbir104-openchat-openchat-3-5-0106.hf.space/run/predict",
  {
  method: 'POST',
  // body:getTemplate(prompt),
  body:JSON.stringify({inputs:`<s>[INST]You must design any graphics or image. Use stable diffusion. [PROMPT]:${prompt}.[/INST]`}),
  headers: {
    'content-type': 'application/json',
    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    responseType: 'arraybuffer',
  }
});

const blob  = await response.blob();
let bytes = await blob.arrayBuffer();
const buffer = Buffer.from(bytes).toString("base64");
const path = join('/', 'tmp', "generated")


    return NextResponse.json({status:200, img:`data:image/jpeg;base64, ${buffer}`});
  } catch (error) {
    console.log('[IMAGE_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
