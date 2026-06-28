import { useState } from "react";
import axios from "axios";
import DependencyGraph from "./components/DependencyGraph";
import "./App.css";

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

        if (error.response) {

          alert(
            "Backend error occurred while analyzing repository."
          );

        } else {

          alert(
            "Could not connect to backend server."
          );

        }

      } finally {

      setLoading(false);

    }
  };

  return (

    <div className="container">

      <div className="hero">

        <h1 className="title">
          <span className="gradient-text">
            CodeScope
          </span>
        </h1>

        <p className="subtitle">
          Analyze repositories. Detect architectural issues.
          Visualize dependencies. Improve code quality.
        </p>

        <div className="upload-section">

          <input
            className="file-input"
            type="file"
            accept=".zip"
            onChange={handleFileChange}
          />

          <button
            className="upload-button"
            onClick={handleUpload}
          >
            Analyze Repository
          </button>

        </div>

        {selectedFile && (
          <p className="selected-file">
            Selected File: {selectedFile.name}
          </p>
        )}

        {loading && (
          <p className="loading-text">
            Analyzing repository...
          </p>
        )}

      </div>

      {analysisResult && (

        <div className="section">

          <h2 className="section-title">
            Analysis Results
          </h2>

          <p className="project-name">
            Project: {analysisResult.project_name}
          </p>

          <div className="cards-grid">

            <div className="card">
              <h3>Total Python Files</h3>
              <p>
                {analysisResult.analysis.summary.total_python_files}
              </p>
            </div>

            <div className="card">
              <h3>Health Score</h3>
              <p>
                {analysisResult.analysis.summary.health_score}
              </p>
            </div>

            <div className="card">
              <h3>Cycles Found</h3>
              <p>
                {analysisResult.analysis.summary.total_cycles}
              </p>
            </div>

            <div className="card">
              <h3>Unused Modules</h3>
              <p>
                {analysisResult.analysis.summary.total_unused_modules}
              </p>
            </div>

          </div>

          <div className="issue-box">

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

          <div className="graph-container">

            <h3>Dependency Graph</h3>

            <DependencyGraph
              dependencies={
                analysisResult.analysis.dependencies
              }
            />

          </div>

        </div>

      )}

    </div>
  );
}

export default App;