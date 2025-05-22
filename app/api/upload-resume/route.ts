import { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import openai from "@/lib/openaiClient";

export const config = {
  api: {
    bodyParser: false, // Required to get raw binary data
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const buffer = await getRawBody(req); // Buffer of the uploaded binary file
    const contentType = req.headers["content-type"];
    const fileName = req.headers["x-filename"] || "resume.pdf"; // You can pass this from the client

    let text: string;

    if (fileName.endsWith(".pdf") || contentType === "application/pdf") {
      const parsed = await pdfParse(buffer);
      text = parsed.text;
    } else if (
      fileName.endsWith(".docx") ||
      contentType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const parsed = await mammoth.extractRawText({ buffer });
      text = parsed.value;
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    const summaryRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Summarize this resume in bullet points focusing on tech skills and experience.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    const summary = summaryRes.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ summary });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Failed to process resume" });
  }
}

// // pages/api/upload-resume.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import formidable from "formidable";
// import fs from "fs/promises";
// import pdfParse from "pdf-parse";
// import mammoth from "mammoth";
// import openai from "@/lib/openaiClient";

// export const config = {
//   api: {
//     bodyParser: false, // Required for formidable
//   },
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const form = new formidable.IncomingForm();

//   form.parse(req, async (err, fields, files) => {
//     if (err) return res.status(500).json({ error: "File upload error" });
//     const file = files.file?.[0] || files.file;
//     console.log("files", file);

//     if (!file || !file?.filepath) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }

//     const buffer = await fs.readFile(file?.filepath);
//     let text: string;
//     console.log("buffer", buffer.byteLength);
//     try {
//       if (file?.originalFilename?.endsWith(".pdf")) {
//         const parsed = await pdfParse(buffer);
//         text = parsed.text;
//       } else if (file?.originalFilename?.endsWith(".docx")) {
//         const parsed = await mammoth.extractRawText({ buffer });
//         text = parsed.value;
//       } else {
//         return res.status(400).json({ error: "Unsupported file format" });
//       }

//       // Summarize with OpenAI
//       const summaryRes = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content: `Summarize this resume in bullet points focusing on tech skills and experience.`,
//           },
//           {
//             role: "user",
//             content: text,
//           },
//         ],
//         max_tokens: 800,
//         temperature: 0.3,
//       });

//       const summary = summaryRes.choices?.[0]?.message?.content;
//       return res.status(200).json({ summary });
//     } catch (e) {
//       console.error("Processing error:", e);
//       return res.status(500).json({ error: "File processing failed" });
//     }
//   });
// }
