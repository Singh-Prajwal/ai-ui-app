// "use client";
// import React from "react";

// interface FileUploadProps {
//   label: string;
//   onFile: (content: string) => void;
// }

// const FileUpload: React.FC<FileUploadProps> = ({ label, onFile }) => {
//   // const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const file = e.target.files?.[0];
//   //   console.log("files", file);
//   //   if (!file) return;

//   //   const fileType = file.name.split(".").pop()?.toLowerCase();

//   //   if (fileType === "txt") {
//   //     const text = await file.text();
//   //     onFile(text);
//   //   } else if (["pdf", "doc", "docx"].includes(fileType || "")) {
//   //     const formData = new FormData();
//   //     formData.append("file", file);

//   //     try {
//   //       // const res = await fetch("/api/upload-resume", {
//   //       //   method: "POST",
//   //       //   body: formData,
//   //       // });
//   //       // const file = yourFileInput.files[0];
//   //       const res = await fetch("/api/upload-resume", {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": file.type,
//   //           "x-filename": file.name, // Important for format detection
//   //         },
//   //         body: file, // Send as binary
//   //       });
//   //       if (!res.ok) {
//   //         throw new Error("Failed to parse file");
//   //       }

//   //       const data = await res.json();
//   //       onFile(data.summary || ""); // or data.content if you return full text
//   //     } catch (error) {
//   //       console.error("Upload error:", error);
//   //       onFile("Error processing file. Please try a different format.");
//   //     }
//   //   } else {
//   //     onFile(
//   //       "Unsupported file type. Please upload .txt, .pdf, or .docx files."
//   //     );
//   //   }
//   // };
//   const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const fileType = file.name.split(".").pop()?.toLowerCase();

//     if (fileType === "txt") {
//       const text = await file.text();
//       console.log("text", text);
//       onFile(text);
//     } else if (["pdf", "doc", "docx"].includes(fileType || "")) {
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await fetch("/api/upload-resume", {
//         method: "POST",
//         body: formData,
//       });
//       // try {
//       //   const res = await fetch("/api/upload-resume", {
//       //     method: "POST",
//       //     headers: {
//       //       "Content-Type": file.type,
//       //       "x-filename": file.name,
//       //     },
//       //     body: file, // Send file directly as binary
//       //   });

//       //   if (!res.ok) {
//       //     throw new Error("Failed to parse file");
//       //   }

//       //   const data = await res.json();
//       //   onFile(data.summary || "");
//       // } catch (error) {
//       //   console.error("Upload error:", error);
//       //   onFile("Error processing file. Please try a different format.");
//       // }
//     } else {
//       onFile(
//         "Unsupported file type. Please upload .txt, .pdf, or .docx files."
//       );
//     }
//   };

//   return (
//     <div className="my-4">
//       <label className="block font-medium mb-2">{label}</label>
//       <input
//         type="file"
//         accept=".pdf,.txt,.doc,.docx"
//         onChange={handleFile}
//         className="block w-full text-sm text-gray-700
//                    file:mr-4 file:py-2 file:px-4
//                    file:rounded-md file:border-0
//                    file:text-sm file:font-semibold
//                    file:bg-blue-50 file:text-blue-700
//                    hover:file:bg-blue-100"
//       />
//     </div>
//   );
// };

// export default FileUpload;

// // components/FileUpload.tsx

// import React from "react";

// interface FileUploadProps {
//   label: string;
//   onFile: (content: string) => void;
// }

// const FileUpload: React.FC<FileUploadProps> = ({ label, onFile }) => {
//   const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Create FormData and append the file
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       // Send to backend
//       const res = await fetch("http://localhost:5000/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) throw new Error(res.statusText);

//       const data = await res.json();
//       onFile(data.text);
//     } catch (err) {
//       console.error("File upload failed:", err);
//       onFile(""); // Optionally handle error state
//     }
//   };

//   return (
//     <div className="my-2">
//       <label className="block font-medium mb-1">{label}</label>
//       <input
//         type="file"
//         accept=".pdf,.txt,.doc,.docx"
//         className="file-input"
//         onChange={handleFile}
//       />
//     </div>
//   );
// };

// export default FileUpload;
// import React from "react";

// interface FileUploadProps {
//   label: string;
//   onFile: (content: string) => void;
// }

// const FileUpload: React.FC<FileUploadProps> = ({ label, onFile }) => {
//   const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("http://localhost:5000/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) throw new Error(res.statusText);

//       const data = await res.json();
//       onFile(data.text);
//     } catch (err) {
//       console.error("File upload failed:", err);
//       onFile(""); // fallback or notify user
//     }
//   };

//   return (
//     <div className="my-2">
//       <label className="block font-medium mb-1">{label}</label>
//       <input
//         type="file"
//         accept=".pdf,.txt,.doc,.docx"
//         className="file-input"
//         onChange={handleFile}
//       />
//     </div>
//   );
// };

// export default FileUpload;

import React from "react";
import { useTheme } from "next-themes";

interface FileUploadProps {
  label: string;
  onFile: (content: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onFile }) => {
  const { theme } = useTheme();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      onFile(data.text);
    } catch (err) {
      console.error("File upload failed:", err);
      onFile("");
    }
  };

  return (
    <div className="my-2">
      <label
        className={`block font-medium mb-1 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        {label}
      </label>
      <input
        type="file"
        accept=".pdf,.txt,.doc,.docx"
        className={`file-input ${
          theme === "dark" ? "bg-gray-700 text-white" : ""
        }`}
        onChange={handleFile}
      />
    </div>
  );
};

export default FileUpload;
