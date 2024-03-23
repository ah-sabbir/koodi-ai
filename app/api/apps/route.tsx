import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";



export async function GET(
    req: Request
){
    try {
        const appList = await prismadb.userApp.findAll()
        
        return NextResponse.json({status:200, content: appList});
    } catch (error) {
        console.log('[CODE_ERROR]', error);
        // return NextResponse.json({message:error, status:500})
        return new NextResponse("Internal Error", { status: 500 });
    }
}
