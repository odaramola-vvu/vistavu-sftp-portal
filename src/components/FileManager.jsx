import React, { useEffect, useState } from "react";

const API_URL = "/api/generate-presigned-url"; // 👈 Now uses proxy path

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);

  // TEMP: Hardcoded username for testing (remove once login is connected)
  const username = "test-user";

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
    // Step 1: Request presigned URL from Lambda
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "upload",
        username,
        filename: uploadFile.name,
        content_type: uploadFile.type, // ✅ MATCHING content-type
      }),
    });

    const data = await response.json();
    const uploadUrl = data.upload_url;

    // Step 2: PUT file to S3 using the exact same content type
    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": uploadFile.type, // ✅ MATCH signature
      },
      body: uploadFile,
    });

    setUploadFile(null);
    fetchFileList(); // Refresh list after upload
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
      window.open(data.download_url, "_blank");
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
            {file}{" "}
            <button onClick={() => handleFileDownload(file)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileManager;
