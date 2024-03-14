import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function ModelCard({ model }: any) {
    return (
        <Card onClick={() => console.log("you've clicked")} className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
        <div className="flex items-center gap-x-4">
          <div className={cn("p-2 w-fit rounded-md bg-violet-500/10")}>
            {/* <tool.icon className={cn("w-8 h-8 bg-violet-500/10")} /> */}
          </div>
          <div className="font-semibold">
            {model?.id}
          </div>
        </div>
        <ArrowRight className="w-5 h-5" />
      </Card>
    )
  }