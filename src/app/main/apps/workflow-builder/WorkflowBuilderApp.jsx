// import React, { useCallback } from 'react';
// import ReactFlow, {
//   MiniMap,
//   Controls,
//   Background,
//   Handle,
//   Position,
//   useNodesState,
//   useEdgesState,
//   addEdge,
// } from 'reactflow';
// import 'reactflow/dist/style.css';

// // 1) Define a custom node type that looks like your screenshot
// function CustomNode({ data }) {
//   // 'data' can contain label, placeholders, etc.
//   // We'll style it with normal React elements inside a <div> for the node
//   return (
//     <div style={{
//       background: '#fff',
//       border: '1px solid #ccc',
//       borderRadius: '8px',
//       width: 180,
//       padding: '8px',
//       boxShadow: '2px 2px 5px rgba(0,0,0,0.15)',
//       fontFamily: 'sans-serif',
//       position: 'relative',
//     }}>
//       {/* "Close" icon top-right */}
//       <div style={{ position: 'absolute', top: 4, right: 4, cursor: 'pointer' }}>
//         ✕
//       </div>
//       {/* Title row */}
//       <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>{data.label || 'Node'}</div>
//       {/* Example placeholders */}
//       <div style={{ marginBottom: 4, background: '#f2f2f2', border: '1px solid #ddd', borderRadius: 4, padding: '4px' }}>
//         + Add
//       </div>
//       <div style={{ marginBottom: 4, background: '#f2f2f2', border: '1px solid #ddd', borderRadius: 4, padding: '4px' }}>
//         Select...
//       </div>
//       <div style={{ marginBottom: 4, background: '#f2f2f2', border: '1px solid #ddd', borderRadius: 4, padding: '4px' }}>
//         Sign Here
//       </div>
//       {/* If you want to connect edges from left/right or top/bottom, add React Flow "handles" */}
//       <Handle type="source" position={Position.Right} style={{ top: '50%', borderRadius: 0 }} />
//       <Handle type="target" position={Position.Left} style={{ top: '50%', borderRadius: 0 }} />
//     </div>
//   );
// }

// const nodeTypes = { customNode: CustomNode };

// // 2) Our main ReactFlow-based workflow
// function WorkflowBuilderApp() {
//   const initialNodes = [
//     {
//       id: '1',
//       type: 'customNode',
//       data: { label: 'd' },
//       position: { x: 100, y: 100 },
//     },
//   ];
//   const initialEdges = [];

//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   // Connect new edges by dragging from a handle to another handle
//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges]
//   );

//   // Example: add a node on button click
//   const addNode = () => {
//     const newNode = {
//       id: (Date.now()).toString(),
//       type: 'customNode',
//       data: { label: 'New' },
//       position: { x: Math.random() * 400, y: Math.random() * 200 },
//     };
//     setNodes((nds) => [...nds, newNode]);
//   };

//   return (
//     <div style={{ width: '100%', height: '600px', display: 'flex' }}>
//       <div style={{ marginRight: 10 }}>
//         <button onClick={addNode}>Add Node</button>
//       </div>

//       <div style={{ flex: 1, border: '1px solid #ccc' }}>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           nodeTypes={nodeTypes}
//           fitView
//         >
//           {/* Dotted background */}
//           <Background variant="dots" gap={16} size={1} />
//           <MiniMap />
//           <Controls />
//         </ReactFlow>
//       </div>
//     </div>
//   );
// }

// export default WorkflowBuilderApp;


// WorkflowEditor.tsx
import React, { useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  MiniMap,
  Controls,
  useEdgesState,
  useNodesState,
  addEdge
} from 'reactflow';

import AnimatedDashEdge from '../../../shared-components/custom-animated-components/AnimatedDashEdgeProps.jsx'; // from step 1
import 'reactflow/dist/style.css';

// We'll define the custom edge type
const edgeTypes = {
  animatedDash: AnimatedDashEdge,
};

export default function WorkflowEditor() {
  // Sample nodes
  const initialNodes = [
    {
      id: 'nodeA',
      type: 'default',
      position: { x: 100, y: 100 },
      data: { label: 'Node A' },
    },
    {
      id: 'nodeB',
      type: 'default',
      position: { x: 400, y: 200 },
      data: { label: 'Node B' },
    },
  ];

  // Sample edges (use the new type)
  const initialEdges = [
    {
      id: 'edgeA-B',
      source: 'nodeA',
      target: 'nodeB',
      type: 'animatedDash',
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Called when user connects two nodes
  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge({ ...connection, type: 'animatedDash' }, eds));
  }, [setEdges]);

  // 1) Remove an edge by ID
  const handleRemoveEdge = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
  }, [setEdges]);

  // 2) Provide that callback to the custom edge
  // We'll do it by passing "onEdgeRemove" via "edgeProps" in ReactFlow:
  const edgeProps = {
    onEdgeRemove: handleRemoveEdge,
  };

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: 600 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: 'animatedDash' }}
          // pass extra props to edges
          edgeupdaterRadius={10}
          fitView
          // This "edgeProps" is how we pass custom props to the edge component
          // (requires React Flow v10+)
          edgeOptions={edgeProps}
        >
          <MiniMap />
          <Controls />
          <Background variant="dots" />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
