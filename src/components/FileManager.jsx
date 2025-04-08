import React, { useEffect, useState } from 'react';

function FileManager() {
  const [files, setFiles] = useState([]);
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/generate-presigned-url', {
          method: 'POST',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'list',
            username,
          }),
        });

        const data = await response.json();
        if (Array.isArray(data.files)) {
          setFiles(data.files);
        } else {
          console.error('Unexpected response:', data);
        }
      } catch (error) {
        console.error('Failed to fetch files:', error);
      }
    };

    fetchFiles();
  }, [token, username]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">📁 My Files</h1>
      {files.length === 0 ? (
        <p className="text-gray-600">No files found.</p>
      ) : (
        <ul className="list-disc pl-6 space-y-1">
          {files.map((file, index) => (
            <li key={index}>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {file.filename}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileManager;
