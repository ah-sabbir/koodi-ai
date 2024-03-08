"use client";

import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1 className="text-transparent bg-clip-text bg-gradient-to-b font-semibold from-[#f5f5ff] to-[#98a09b] uppercase">Build Your Own AI APP, No code.</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 pb-5">
          <TypewriterComponent
            options={{
              strings: [
                "Chatbot.",
                "Photo Generation.",
                "Blog Writing.",
                "eMail Writing.",
                "Content Writing.",
                "Marketing.",
                "Product Research.",
                "Market Research.",
                "Build More."
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="text-sm md:text-xl font-light text-zinc-100">
      Build and use with just one click for any industry needs.
      </div>
      <div>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button variant="premium" className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
            Start Now For Free
          </Button>
        </Link>
      </div>
      <div className="text-zinc-100 text-xs md:text-sm font-normal">
        No credit card required.
      </div>
    </div>
  );
};
