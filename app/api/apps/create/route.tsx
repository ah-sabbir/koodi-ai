import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";



export async function POST(
    req: Request
){
    try {
        const { userId } = auth();
        // const appList = await prismadb.UserApp.findAll()
        
        return NextResponse.json({status:200, content: "comming soon"});
    } catch (error) {
        console.log('[CODE_ERROR]', error);
        // return NextResponse.json({message:error, status:500})
        return new NextResponse("Internal Error", { status: 500 });
    }
}