"use client";

import { ArrowRight } from "lucide-react";
// import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";


import { tools } from "@/constants";
import { any } from "zod";
import { getModels } from "@/app/actions/getModels";
import ModelCard from "@/components/modelCard";

export default async function HomePage() {
//   const router = useRouter();
  const [modelState, setModelState] = useState([])
//   const INITIAL_NUMBER_OF_USERS:number = 10
//   const initialUsers = await getModels( 0, INITIAL_NUMBER_OF_USERS)

  const getModels = async()=>{
    const res = await fetch("https://huggingface.co/api/models",{
      method:"GET"
    })

    const models = await res.json();
    return models;
  }

  useEffect(()=>{
    const res = getModels().then((data=> setModelState(data)));
  },[])

  useEffect(()=>{
    console.log(typeof modelState)
    console.log("this is model data",modelState)
  },[modelState])

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Chat with the smartest AI - Experience the power of AI
        </p>
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {modelState && modelState.map((model:any, id:any) => (
            <ModelCard key={id} model={model} />
        ))}
      </div>
    </div>
  );
}
