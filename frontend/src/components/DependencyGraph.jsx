import ReactFlow, {
  Background,
  Controls,
  MiniMap
} from "reactflow";

import "reactflow/dist/style.css";

function DependencyGraph({ dependencies }) {

  const nodes = [];
  const edges = [];

  let yPosition = 0;

  Object.keys(dependencies).forEach((file, index) => {

    nodes.push({
      id: file,
      data: { label: file },
      position: {
        x: 0,
        y: yPosition
      }
    });

    yPosition += 100;

    dependencies[file].forEach((dependency, depIndex) => {

      if (
        !nodes.find(node => node.id === dependency)
      ) {

        nodes.push({
          id: dependency,
          data: { label: dependency },
          position: {
            x: 350,
            y: depIndex * 100
          }
        });

      }

      edges.push({
        id: `${file}-${dependency}`,
        source: file,
        target: dependency,
        animated: true
      });

    });

  });

  return (

    <div
      style={{
        width: "100%",
        height: "600px",
        backgroundColor: "#111",
        borderRadius: "25px",
        marginTop: "30px"
      }}
    >

      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >

        <MiniMap />
        <Controls />
        <Background />

      </ReactFlow>

    </div>

  );

}

export default DependencyGraph;