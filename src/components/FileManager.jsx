import React, { useEffect, useState } from "react";

const API_URL = "https://4l8tttgqqj.execute-api.us-west-2.amazonaws.com/dev/generate-presigned-url";

// TEMP: Hardcoded test user for now
const TEST_USERNAME = "test-user";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    fetchFileList();
  }, []);

  const fetchFileList = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "list",
          username: TEST_USERNAME
        })
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
          username: TEST_USERNAME,
          filename: uploadFile.name
        })
      });

      const data = await response.json();
      const uploadUrl = data.upload_url;

      await fetch(uploadUrl, {
        method: "PUT",
        body: uploadFile
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
          username: TEST_USERNAME,
          filename
        })
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
