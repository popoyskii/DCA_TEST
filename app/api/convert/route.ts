import { NextResponse } from "next/server";
import ConvertAPI from "convertapi";
import fetch from "node-fetch";

interface ConvertAPIResponse {
  Files: { Url: string }[];
}

export async function POST(request: Request) {
  try {
    const { url, type } = await request.json();
    const convertapi = new ConvertAPI("secret_w3TpeKhTGWMJhe8n");

    if (!url || !type) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file from URL: ${url}`);
    }

    let fileType = "pdf";

    // Perform the conversion
    if (type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || type === "application/vnd.ms-excel") {
      fileType = "xlsx";
    } else if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || type === "application/msword") {
      fileType = "doc";
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const result = await convertapi.convert("pdf", { File: url }, fileType) as unknown as { response: ConvertAPIResponse };

    if (!result || !result.response || !result.response.Files || !result.response.Files.length) {
      throw new Error("Conversion API did not return expected result");
    }

    const pdfUrl = result.response.Files[0].Url;
    console.log(`Converted PDF available at: ${pdfUrl}`);
    
    return NextResponse.json({ pdf: pdfUrl });
  } catch (error) {
    console.error("Conversion failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
