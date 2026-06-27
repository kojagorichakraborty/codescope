import { useState } from "react";

function App() {

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "100px auto",
        textAlign: "center",
        padding: "30px",
        border: "1px solid lightgray",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
      }}
    >
      <h1>CodeScope</h1>

      <p>Repository Analysis Platform</p>

      <br />

      <input
        type="file"
        accept=".zip"
        onChange={handleFileChange}
      />

      <br />
      <br />

      <button>
        Upload
      </button>

      <br />
      <br />

      {selectedFile && (
        <p>
          Selected File: <strong>{selectedFile.name}</strong>
        </p>
      )}
    </div>
  );
}

export default App;