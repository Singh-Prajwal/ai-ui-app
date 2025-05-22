// // lib/pdfParser.ts
// import { PDFParser } from "pdf2json";
// // lib/fileProcessor.ts
// import * as mammoth from "mammoth";

// export const extractTextFromFile = async (file: Blob): Promise<string> => {
//   if (!file) return "";

//   try {
//     switch (file.type) {
//       case "application/pdf":
//         return await extractTextWithPDF2JSON(file);
//       case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
//         const result = await mammoth.extractRawText({
//           arrayBuffer: await file.arrayBuffer(),
//         });
//         return cleanResumeText(result.value);
//       case "text/plain":
//         return cleanResumeText(await file.text());
//       default:
//         // Try PDF parser as fallback for unknown types
//         try {
//           return await extractTextWithPDF2JSON(file);
//         } catch {
//           throw new Error(`Unsupported file type: ${file.type}`);
//         }
//     }
//   } catch (error) {
//     console.error("File processing error:", error);
//     throw new Error(`Failed to process ${file.name || "file"}`);
//   }
// };
// export const extractTextWithPDF2JSON = (file: Blob): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const pdfParser = new PDFParser();

//     pdfParser.on("pdfParser_dataError", (err: any) => {
//       reject(new Error(`PDF parsing error: ${err.parserError}`));
//     });

//     pdfParser.on("pdfParser_dataReady", () => {
//       try {
//         const rawText = getTextFromPDFData(pdfParser.getRawTextContent());
//         const cleanText = cleanResumeText(rawText);
//         resolve(cleanText);
//       } catch (error) {
//         reject(error);
//       }
//     });

//     // Convert Blob to buffer
//     const fileReader = new FileReader();
//     fileReader.onload = (e) => {
//       if (e.target?.result) {
//         pdfParser.parseBuffer(e.target.result as ArrayBuffer);
//       }
//     };
//     fileReader.onerror = () => reject(new Error("File reading failed"));
//     fileReader.readAsArrayBuffer(file);
//   });
// };

// // Helper to process raw PDF data
// const getTextFromPDFData = (pdfData: any): string => {
//   if (!pdfData || !pdfData.Pages) return "";

//   let fullText = "";

//   for (const page of pdfData.Pages) {
//     if (!page.Texts) continue;

//     // Group text by vertical position (y-coordinate)
//     const textLines: Record<number, string[]> = {};

//     for (const textItem of page.Texts) {
//       if (!textItem.R) continue;

//       const yPos = textItem.y;
//       const decodedText = decodeURIComponent(textItem.R[0].T);

//       if (!textLines[yPos]) {
//         textLines[yPos] = [];
//       }
//       textLines[yPos].push(decodedText);
//     }

//     // Sort lines by vertical position and join
//     const sortedLines = Object.keys(textLines)
//       .sort((a, b) => parseFloat(b) - parseFloat(a)) // Top to bottom
//       .map((yPos) => textLines[parseFloat(yPos)].join(" "));

//     fullText += sortedLines.join("\n") + "\n\n";
//   }

//   return fullText;
// };

// // Enhanced text cleaner
export function cleanResumeText(text: string): string {
  return text
    .replace(/[\r\n\t]+/g, " ") // remove newlines and tabs
    .replace(/\s{2,}/g, " ") // collapse multiple spaces
    .trim();
}

// // // resumeParser.ts
// // import * as pdfjs from "pdfjs-dist";
// // import * as mammoth from "mammoth";

// // // Initialize PDF.js worker (do this once)
// // if (typeof window !== "undefined") {
// //   pdfjs.GlobalWorkerOptions.workerSrc =
// //     "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
// // }

// // export const cleanResumeText = (text: string): string => {
// //   if (!text) return "";

// //   return text
// //     .replace(/\s+/g, " ") // Collapse multiple spaces
// //     .replace(/[•·■]/g, " ") // Remove bullet characters
// //     .replace(/[^\w\s.,\-()/]/g, "") // Remove special chars but keep some punctuation
// //     .replace(/(\r\n|\n|\r)/gm, " ") // Replace line breaks with spaces
// //     .replace(/\s+([.,])/g, "$1") // Remove spaces before punctuation
// //     .trim()
// //     .substring(0, 10000); // Limit length
// // };

// // export const extractTextFromPDF = async (file: Blob): Promise<string> => {
// //   try {
// //     const arrayBuffer = await file.arrayBuffer();
// //     const loadingTask = pdfjs.getDocument(arrayBuffer);
// //     const pdf = await loadingTask.promise;

// //     let fullText = "";

// //     for (let i = 1; i <= pdf.numPages; i++) {
// //       const page = await pdf.getPage(i);
// //       const textContent = await page.getTextContent();
// //       fullText += textContent.items.map((item) => item.str).join(" ") + "\n";
// //     }

// //     return cleanResumeText(fullText);
// //   } catch (error) {
// //     console.error("PDF extraction error:", error);
// //     throw new Error("Failed to extract text from PDF");
// //   }
// // };

// // export const extractTextFromDOCX = async (file: Blob): Promise<string> => {
// //   try {
// //     const arrayBuffer = await file.arrayBuffer();
// //     const result = await mammoth.extractRawText({ arrayBuffer });
// //     return cleanResumeText(result.value);
// //   } catch (error) {
// //     console.error("DOCX extraction error:", error);
// //     throw new Error("Failed to extract text from Word document");
// //   }
// // };

// // export const extractTextFromTXT = async (file: Blob): Promise<string> => {
// //   try {
// //     const text = await file.text();
// //     return cleanResumeText(text);
// //   } catch (error) {
// //     console.error("Text extraction error:", error);
// //     throw new Error("Failed to read text file");
// //   }
// // };

// // export const extractTextFromFile = async (file: Blob): Promise<string> => {
// //   if (!file) return "";

// //   switch (file.type) {
// //     case "application/pdf":
// //       return extractTextFromPDF(file);
// //     case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
// //       return extractTextFromDOCX(file);
// //     case "text/plain":
// //       return extractTextFromTXT(file);
// //     default:
// //       throw new Error(`Unsupported file type: ${file.type}`);
// //   }
// // };
