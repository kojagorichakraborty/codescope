import { useState } from "react";
import axios from "axios";

function App() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {

    if (!selectedFile) {
      alert("Please select a ZIP file.");
      return;
    }

    const formData = new FormData();

    formData.append("file", selectedFile);

    try {

      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      setAnalysisResult(response.data);

    } catch (error) {

      console.error(error);

      alert("Upload failed.");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "100px auto",
        textAlign: "center",
        padding: "30px",
        border: "1px solid lightgray",
        borderRadius: "10px"
      }}
    >
      <h1>CodeScope</h1>

      <p>Repository Analysis Platform</p>

      <input
        type="file"
        accept=".zip"
        onChange={handleFileChange}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload
      </button>

      <br /><br />

      {selectedFile && (
        <p>
          Selected File: {selectedFile.name}
        </p>
      )}

      {loading && <p>Analyzing repository...</p>}

      {analysisResult && (
        <div
          style={{
            textAlign: "left",
            marginTop: "30px"
          }}
        >
          <h2>Analysis Result</h2>

          <pre>
            {JSON.stringify(
              analysisResult,
              null,
              2
            )}
          </pre>

        </div>
      )}
    </div>
  );
}

export default App;