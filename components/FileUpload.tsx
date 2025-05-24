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
