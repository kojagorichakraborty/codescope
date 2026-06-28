import React from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

function DependencyGraph({ dependencies }) {

  const nodes = [];
  const edges = [];

  let xPosition = 100;

  Object.keys(dependencies).forEach((file, index) => {

    nodes.push({
      id: file,
      data: { label: file },
      position: {
        x: xPosition,
        y: index * 100
      }
    });

    dependencies[file].forEach((dependency) => {

      edges.push({
        id: `${file}-${dependency}`,
        source: file,
        target: dependency
      });

    });

  });

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        border: "1px solid lightgray",
        marginTop: "30px"
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
      />
    </div>
  );
}

export default DependencyGraph;