import { Children } from "react";

export const Each = ({render, of}:any) => Children.toArray(of.map((item:any, index:any)=>render(item, index)))