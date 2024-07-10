import { NextResponse } from "next/server";
import ConvertAPI from "convertapi";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  const { url, type } = await request.json();
  const convertapi = new ConvertAPI("hFNKwVZfRCPMachh");

  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  let fileType = "pdf";

  // Read the XLSX file
  //   if (
  //     type ===
  //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
  //     type === "application/vnd.ms-excel"
  //   ) {
  //     const workbook = XLSX.read(data, { type: "buffer" });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  //     // Create a new PDF document
  //     const doc = new jsPDF();

  //     // Add data to the PDF
  //     sheetData.forEach((row: any, rowIndex: number) => {
  //       row.forEach((cell: any, cellIndex: number) => {
  //         doc.text(String(cell), 10 + cellIndex * 20, 10 + rowIndex * 10);
  //       });
  //     });

  //     // Convert the PDF to a base64 string
  //     pdfBase64 = doc.output("dataurlstring");
  //   }

  try {
    // Perform the conversion
    if (
      type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      type === "application/vnd.ms-excel"
    ) {
      fileType = "xlsx";
    } else if (
      type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      type === "application/msword"
    ) {
      fileType = "doc";
    }
    const result = await convertapi.convert(
      "pdf",
      {
        File: url,
      },
      fileType
    );

    // Save the result to a file
    const pdfFile = result.response as any;

    console.log(pdfFile);

    // const fileData = await pdfFile.file;

    // fs.writeFileSync(outputFilePath, fileData);
    return NextResponse.json({ pdf: pdfFile?.Files[0].Url });
    // console.log(`Converted PDF saved to ${pdfFile}`);
  } catch (error) {
    console.error("Conversion failed:", error);
  }
}
