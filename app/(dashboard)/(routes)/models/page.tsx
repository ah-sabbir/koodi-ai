"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";


import { tools } from "@/constants";

export default function ModelPage() {
  const router = useRouter();
  const [modelState, setModelState] = useState<any[]>([])

  const getModels = async()=>{
    const res = await fetch("https://huggingface.co/api/models",{
      method:"GET"
    })

    const models = await res.json();
    return models;
  }

  useEffect(()=>{
    const mdb:any = localStorage.getItem('modelData')
    if(mdb!==null){
      setModelState(JSON.parse(mdb))
    }
    getModels().then((res)=>localStorage.setItem('modelData', JSON.stringify((res))));
  },[])

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
        {modelState && modelState.map((tool, index) => (
          <Card onClick={() => console.log("you've clicked", tool.id)} key={index} className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", "tool.bgColor")}>
                {/* <tool.icon className={cn("w-8 h-8", "tool.color")} /> */}
              </div>
              <div className="font-semibold flex flex-row justify-between items-center">
                <div>
                    {tool?.id}
                </div>
                <div>
                    Free
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
}
