// WorkflowCanvas.tsx
import React, { useCallback, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import LogicConfigDialog from '../workflow/dialogs/LogicConfigDialog';
import FormConfigDialog from '../workflow/dialogs/FormConfigDialog';

const initialNodes = [
  {
    id: '1',
    type: 'logicNode',
    data: { label: 'Logic Node', config: {} },
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    type: 'formNode',
    data: { label: 'Form Node', config: {} },
    position: { x: 400, y: 200 },
  },
];

const initialEdges = [];

function LogicNode({ data }) {
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);

  return (
    <div onClick={handleClick} style={{
      background: '#eef',
      border: '1px solid #99c',
      borderRadius: 8,
      padding: 8,
      width: 180,
      position: 'relative',
      cursor: 'pointer'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: 6 }}>{data.label}</div>
      <div style={{ fontSize: '0.8rem' }}>Logic details...</div>
      <Handle type="source" position={Position.Right} style={{ top: '50%' }} />
      <Handle type="target" position={Position.Left} style={{ top: '50%' }} />
      {open && <LogicConfigDialog open={open} config={data.config} onClose={() => setOpen(false)} />}
    </div>
  );
}

function FormNode({ data }) {
  const handleEdit = () => {
    // Navigate to Form Builder (replace with your routing/navigation)
    alert('Navigating to Form Builder...');
  };

  return (
    <div style={{
      background: '#efe',
      border: '1px solid #9c9',
      borderRadius: 8,
      padding: 8,
      width: 180,
      position: 'relative',
      cursor: 'pointer'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: 6 }}>{data.label}</div>
      <div style={{ fontSize: '0.8rem' }}>Form details...</div>
      <Button size="small" onClick={handleEdit} style={{ position: 'absolute', top: 4, right: 4 }}>
        Edit
      </Button>
      <Handle type="source" position={Position.Right} style={{ top: '50%' }} />
      <Handle type="target" position={Position.Left} style={{ top: '50%' }} />
      {/*
        Additional node–specific elements (e.g. for service or custom code nodes, add extra controls)
      */}
    </div>
  );
}

// You can define additional custom node types for ServiceNode, CodeExecutionNode, StartNode, EndNode, TriggerNode, etc.

const nodeTypes = {
  logicNode: LogicNode,
  formNode: FormNode,
  // serviceNode: ServiceNode,
  // codeExecutionNode: CodeExecutionNode,
  // startNode: StartNode,
  // endNode: EndNode,
  // triggerNode: TriggerNode,
};

function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Sample: function to add a new node (logic node)
  const addLogicNode = () => {
    const newId = Date.now().toString();
    setNodes((nds) => [
      ...nds,
      {
        id: newId,
        type: 'logicNode',
        data: { label: 'New Logic', config: {} },
        position: { x: Math.random() * 400 + 100, y: Math.random() * 200 + 100 },
      },
    ]);
  };

  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <button
          onClick={addLogicNode}
          style={{
            position: 'absolute',
            zIndex: 10,
            top: 10,
            left: 10,
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Add Logic Node
        </button>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          style={{ width: '100%', height: '100%' }}
        >
          <Background variant="dots" gap={16} size={1} />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

export default WorkflowCanvas;