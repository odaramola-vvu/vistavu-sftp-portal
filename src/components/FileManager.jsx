import React, { useEffect, useState } from "react";

const API_URL = "/api/generate-presigned-url"; // Proxy path via Amplify

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);

  const username = "test-user"; // TEMP: hardcoded for POC

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
    if (!uploadFiles.length) return;

    for (const file of uploadFiles) {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "upload",
            username,
            filename: file.name,
          }),
        });

        const data = await response.json();
        const uploadUrl = data.upload_url;

        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
        });

        console.log(`✅ Uploaded: ${file.name}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${file.name}:`, error);
      }
    }

    setUploadFiles([]);
    fetchFileList();
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
      const link = document.createElement("a");
      link.href = data.download_url;
      link.download = filename;
      link.click();
    } catch (error) {
      console.error("❌ Download failed:", error);
    }
  };

  return (
    <div>
      <h2>📁 File Manager</h2>

      <input
        type="file"
        multiple
        onChange={(e) => setUploadFiles([...e.target.files])}
      />
      <button onClick={handleFileUpload}>Upload</button>

      <ul>
        {files.map((file) => (
          <li key={file}>
            {file}{" "}
            <button onClick={() => handleFileDownload(file)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileManager;
