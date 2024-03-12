import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
//import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import OpenAI from "openai"
import { checkSubscription } from "@/lib/subscription";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";
import axios from "axios";

//import { client } from "@gradio/client";

//const configuration = new Configuration({
//  apiKey: process.env.OPENAI_API_KEY,
//});




const client = new OpenAI({
  baseURL: "https://api-inference.huggingface.co/models/google/gemma-2b-it" || "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
  apiKey: process.env.HUGGINGFACE_API_KEY,
  // defaultHeaders: {
  //   "HTTP-Referer": process.env.YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
  //   "X-Title": process.env.YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
  // },
  // dangerouslyAllowBrowser: true,
})

//const openai = new OpenAIApi(configuration);

const getTemplate = (prompt:Zod.ZodString)=> {
  return JSON.stringify({
    inputs: `<s>[INST]Please ignore all previous instructions. I want you to only answer in English. Please answer the following question about the opened page content to the best of your ability and provided context. Be precise and helpful. Do not hallucinate and do not come up with facts you are not sure about. elaborate the answer as much possible. [CONTEXT]: programming. [QUESTION]:${prompt}[/INST]`,
    parameters: {
        "return_full_text": false
    },
    stream: false,
    options: {
        dont_load_model: false,
        signal: {name: "KramerAndRio"},
        use_cache: true,
        wait_for_model: true
    }
  })
}

const payload: any = [{
  "role": "system",
  "content": "I'm an expert software engineer and software developer I can solve and write clean code as per your needs. also, I'm a code generator too. I must answer only in markdown code snippets. I'll Use code comments for explanations."
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

    payload.push(quest)
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


  //   const data = {
  //     "inputs": {
  //       "question": "What is the capital of France?"
  //     }
  //   };

  //   const response = await fetch(
  //     "https://api-inference.huggingface.co/models/EleutherAI/gpt-neox-20b",
  //     {
  //         headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
  //         method: "POST",
  //         body: JSON.stringify({"inputs": "Can you please let us know more details about your "}),
  //     }
  // );
  // const result = await response.json();


const response = await fetch('https://api-inference.huggingface.co/models/google/gemma-7b-it', {
  method: 'POST',
  body:getTemplate(messages.slice(-1)[0].content),
  headers: {
    'content-type': 'application/json',
    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
  }
});

    // const response = await axios({
    //   method: 'post',
    //   // url: "https://api-inference.huggingface.co/models/EleutherAI/gpt-neox-20b",
    //   // url: "https://api-inference.huggingface.co/models/google/gemma-2b-it",
    //   url: "https://api-inference.huggingface.co/models/google/gemma-7b-it",
    //   // url: "https://api-inference.huggingface.co/models/codellama/CodeLlama-70b-Instruct-hf",
    //   // url: "https://api-inference.huggingface.co/models/openchat/openchat-3.5-0106",
    //   // url: "https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-33b-instruct",
    //   // url: "https://ahsabbir104-openchat-openchat-3-5-0106.hf.space/run/predict",
    //   // url: "https://huggingface.co/chat/api/conversation",
    //   headers: {Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`},
    //   // data: getTemplate(messages.slice(-1)[0].content),
    //   data: JSON.stringify({
    //     "inputs": "<s>[INST]Please ignore all previous instructions. I want you to only answer in English. Please answer the following question about the opened page content to the best of your ability and provided context. Be precise and helpful. Do not hallucinate and do not come up with facts you are not sure about. elaborate the answer as much possible. [CONTEXT]: programming. [QUESTION]:how you can help me? tell more details with examples.[/INST]",
    //     "parameters": {
    //         "return_full_text": false
    //     },
    //     "stream": false,
    //     "options": {
    //         "dont_load_model": false,
    //         "signal": {"name": "KramerAndRio"},
    //         "use_cache": true,
    //         "wait_for_model": true
    //     }
    // }),
    //   // responseType: 'stream'
    // })



    // .then((res)=>{
    //   const {data} = res;
    //   console.log("AXIOS RESPONSE: ",data);
    // })


  // return result;

      // const result = await response;
      // if(!response.ok){
      //   // return new NextResponse("Internal Error", { status: 500 });
      //   return NextResponse.json({message:response.statusText, status:response.status})
      // }

    //   client = OpenAI(
    //     base_url="<ENDPOINT_URL>" + "/v1/",  # replace with your endpoint url
    //     api_key="<HF_API_TOKEN>",  # replace with your token
    // )

      const result = await response.json();

    if (!isPro) {
      await incrementApiLimit();
    }

    // const content = result[0].generated_text.replace(`Please ignore all previous instructions. I want you to only answer in English. Please answer the following question about the opened page content to the best of your ability and provided context. Be precise and helpful. Do not hallucinate and do not come up with facts you are not sure about. Avoid mentioning context as incomplete. [CONTEXT]: programming. [QUESTION]: ${messages.slice(-1)[0].content} [ANSWER]:`,``).trim()

    console.log('[CODE_API_RESPONSE]', result)
    return NextResponse.json({role:'bot', content: "result[0].generated_text"});
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    return NextResponse.json({message:error, status:500})
    //return new NextResponse("Internal Error", { status: 500 });
     //return new NextResponse(error.toString(), {status:500});
  }
};
