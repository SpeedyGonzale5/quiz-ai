// import { NextRequest, NextResponse } from "next/server";
// import {getResult} from "../getResult";

// export async function GET(req: NextRequest) {
//   // Convert the URL string to a URL object
//   const url = new URL(req.url, `http://${req.headers.get('host')}`);

//   // Now you can safely use `searchParams` on the URL object
//   const jobId = url.searchParams.get("jobId");

//   const result = await getResult(jobId);

//   if (!result) {
//     return NextResponse.json({ status: 'processing' }, { status: 202 });
//   }

//   return NextResponse.json({ result }, { status: 200 });
// }