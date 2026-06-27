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

  const cardStyle = {
    border: "1px solid lightgray",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
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

        <div style={{ marginTop: "40px" }}>

          <h2>Repository Analysis</h2>

          <p>
            Project: {analysisResult.project_name}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px",
              marginTop: "20px"
            }}
          >

            <div style={cardStyle}>
              <h3>Total Python Files</h3>
              <p>
                {
                  analysisResult.analysis.summary.total_python_files
                }
              </p>
            </div>

            <div style={cardStyle}>
              <h3>Health Score</h3>
              <p>
                {
                  analysisResult.analysis.summary.health_score
                }
              </p>
            </div>

            <div style={cardStyle}>
              <h3>Cycles Found</h3>
              <p>
                {
                  analysisResult.analysis.summary.total_cycles
                }
              </p>
            </div>

            <div style={cardStyle}>
              <h3>Unused Modules</h3>
              <p>
                {
                  analysisResult.analysis.summary.total_unused_modules
                }
              </p>
            </div>

          </div>

          <div style={{ marginTop: "30px", textAlign: "left" }}>

            <h3>Cycles</h3>

            <pre>
              {JSON.stringify(
                analysisResult.analysis.issues.cycles,
                null,
                2
              )}
            </pre>

            <h3>Unused Modules</h3>

            <pre>
              {JSON.stringify(
                analysisResult.analysis.issues.unused_modules,
                null,
                2
              )}
            </pre>

          </div>

        </div>

      )}
    </div>
  );
}

export default App;