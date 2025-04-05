import React from "react";
import FileManager from "./components/FileManager";

const App = () => {
  // 🔧 Hardcode test user to skip login redirect
  localStorage.setItem("username", "test-user");

  return (
    <div className="App">
      <h1>🔐 Bypassed Login Mode (test-user)</h1>
      <FileManager />
    </div>
  );
};

export default App;