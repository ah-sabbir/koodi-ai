"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Each } from "./ui/Each";

const font = Montserrat({ weight: '400', subsets: ['latin'] });

const navItems = [
  {name:'Home', url: ''},
  {name: 'Apps', url:'apps'},
  {name: 'Pricing', url:'pricing'},
  {name: 'Features', url:'features'},
]

// ##5946CF

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <nav className="p-4 bg-[#221e3b9f] flex items-center justify-between rounded-full mt-5 drop-shadow-md">
      <Link href="/" className="flex items-center">
        <div className="relative h-12 w-12">
          <Image fill alt="Logo" src="/app-logo.png" />
        </div>
        {/* <h1 className={cn("text-2xl font-bold text-white", font.className)}>
          KOODI AI
        </h1> */}
      </Link>
      <div className="nav-items hidden sm:block md:block lg:block xl:block">
        <ul className="flex flex-row gap-x-5 text-slate-300">
          <Each of={navItems} render={(item:any)=>(
              <li className="" onClick={(e)=> console.log("clicked!")}>
                <Link href={`/${item.url}`} >{item.name}</Link> 
                {/* className=" border-2 border-[#5846cf96] rounded-md p-2" */}
              </li>
            )}/>
        </ul>      
      </div>

      <div className="flex items-center gap-x-2 ">
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out">
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  )
}