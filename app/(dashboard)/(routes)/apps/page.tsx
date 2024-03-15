"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";


import { tools } from "@/constants";
import { AppCard } from "@/components/app-card";

export default function AppPage() {
  const router = useRouter();

  // const getModels = async()=>{
  //   const res = await fetch("https://huggingface.co/api/models",{
  //     method:"GET"
  //   })

  //   const models = await res.json();
  //   return models;
  // }

  // useEffect(()=>{
  //   getModels().then((res)=>{console.log(res)});
  // },[])

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          Explore the power of AI
        </h2>
        {/* <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          Chat with the smartest AI - Experience the power of AI
        </p> */}
      </div>
      <div className="px-4 md:px-20 lg:px-32 space-y-4 flex flex-wrap gap-3">
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
        <AppCard/>
      </div>
    </div>
  );
}
