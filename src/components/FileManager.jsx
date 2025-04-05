// ✅ FileManager.jsx
import React, { useEffect, useState } from "react";

const API_URL = "/api/generate-presigned-url";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);

  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchFileList();
  }, []);

  const fetchFileList = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list", username }),
      });

      const data = await response.json();
      console.log("📁 File list:", data.files);
      setFiles(data.files || []);
    } catch (error) {
      console.error("❌ Failed to fetch file list", error);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upload",
          username,
          filename: uploadFile.name,
        }),
      });

      const data = await response.json();
      const uploadUrl = data.upload_url;

      await fetch(uploadUrl, {
        method: "PUT",
        body: uploadFile,
      });

      setUploadFile(null);
      fetchFileList();
    } catch (error) {
      console.error("❌ Upload failed:", error);
    }
  };

  const handleFileDownload = async (filename) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "download",
          username,
          filename,
        }),
      });

      const data = await response.json();
      const downloadLink = document.createElement("a");
      downloadLink.href = data.download_url;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("❌ Download failed:", error);
    }
  };

  return (
    <div>
      <h2>📁 File Manager</h2>

      <input type="file" onChange={(e) => setUploadFile(e.target.files[0])} />
      <button onClick={handleFileUpload}>Upload</button>

      <ul>
        {files.map((file) => (
          <li key={file}>
            {file} <button onClick={() => handleFileDownload(file)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileManager;