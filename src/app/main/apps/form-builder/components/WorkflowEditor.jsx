"use client"

import { useState } from "react"
import ReactFlow, { Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState } from "reactflow"
import "reactflow/dist/style.css"
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material"
import {
  Email as EmailIcon,
  Sms as SmsIcon,
  Webhook as WebhookIcon,
  Code as CodeIcon,
  Api as ApiIcon,
  DataObject as DataObjectIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import Editor from "@monaco-editor/react"

// Action types
const actionTypes = [
  { id: "email", label: "Send Email", icon: <EmailIcon /> },
  { id: "sms", label: "Send SMS", icon: <SmsIcon /> },
  { id: "webhook", label: "Webhook", icon: <WebhookIcon /> },
  { id: "js_script", label: "JavaScript Script", icon: <CodeIcon /> },
  { id: "groovy_script", label: "Groovy Script", icon: <CodeIcon /> },
  { id: "api_call", label: "API Call", icon: <ApiIcon /> },
  { id: "data_transform", label: "Data Transform", icon: <DataObjectIcon /> },
]

// Initial nodes
const initialNodes = [
  {
    id: "1",
    type: "input",
    data: {
      label: "Form Submission",
      type: "trigger",
      config: {},
    },
    position: { x: 250, y: 5 },
  },
]

function WorkflowEditor({ workflow = { trigger: { type: "form_submission", config: {} }, actions: [] }, onChange }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedAction, setSelectedAction] = useState(null)
  const [codeDialogOpen, setCodeDialogOpen] = useState(false)
  const [scriptType, setScriptType] = useState("js")
  const [scriptCode, setScriptCode] = useState(
    '// Write your code here\n\nfunction processData(data) {\n  console.log("Processing data:", data);\n  return data;\n}\n',
  )

  // Handle adding a new action
  const handleAddAction = (actionType) => {
    const newAction = {
      id: `action_${Date.now()}`,
      type: actionType,
      config: {},
    }

    // For script types, add default code
    if (actionType === "js_script") {
      newAction.config.code =
        "// Write your JavaScript code here\n\nfunction processData(data) {\n  console.log('Processing data:', data);\n  return data;\n}\n"
    } else if (actionType === "groovy_script") {
      newAction.config.code =
        '// Write your Groovy code here\n\ndef processData(data) {\n  println "Processing data: ${data}"\n  return data\n}\n'
    }

    // Add the action to the workflow
    const updatedWorkflow = {
      ...workflow,
      actions: [...(workflow?.actions || [])],
    }

    // Add the new action
    updatedWorkflow.actions.push(newAction)

    if (onChange) {
      onChange(updatedWorkflow)
    }

    // Add a new node to the ReactFlow diagram
    const newNode = {
      id: String(nodes.length + 1),
      data: {
        label: actionTypes.find((a) => a.id === actionType)?.label || actionType,
        type: actionType,
        config: newAction.config,
      },
      position: {
        x: 250,
        y: nodes.length * 100 + 100,
      },
    }

    setNodes([...nodes, newNode])

    // Add an edge connecting the last node to the new node
    if (nodes.length > 0) {
      const newEdge = {
        id: `e${nodes.length}-${nodes.length + 1}`,
        source: String(nodes.length),
        target: String(nodes.length + 1),
        animated: true,
      }

      setEdges([...edges, newEdge])
    }

    setSelectedAction(newAction.id)
  }

  // Handle edge connections in the workflow diagram
  const onConnect = (params) => {
    setEdges((eds) => addEdge(params, eds))
  }

  // Handle opening the code editor
  const handleEditCode = (nodeId, type) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (node) {
      setScriptType(type === "js_script" ? "js" : "groovy")
      setScriptCode(node.data.config.code || "")
      setSelectedAction(nodeId)
      setCodeDialogOpen(true)
    }
  }

  // Handle saving code changes
  const handleSaveCode = () => {
    // Update the node with the new code
    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedAction) {
        return {
          ...node,
          data: {
            ...node.data,
            config: {
              ...node.data.config,
              code: scriptCode,
            },
          },
        }
      }
      return node
    })

    setNodes(updatedNodes)
    setCodeDialogOpen(false)

    // Update the workflow if it exists and has actions
    if (workflow && workflow.actions) {
      const actionIndex = workflow.actions.findIndex((a) => a.id === selectedAction)
      if (actionIndex !== -1) {
        const updatedActions = [...workflow.actions]
        updatedActions[actionIndex] = {
          ...updatedActions[actionIndex],
          config: {
            ...updatedActions[actionIndex].config,
            code: scriptCode,
          },
        }

        if (onChange) {
          onChange({
            ...workflow,
            actions: updatedActions,
          })
        }
      }
    }
  }

  return (
    <Box>
      <Box className="mb-4">
        <Typography variant="h6" className="mb-2">
          Add Actions
        </Typography>
        <div className="grid grid-cols-3 gap-3">
          {actionTypes.map((action) => (
            <Button
              key={action.id}
              variant="outlined"
              startIcon={action.icon}
              onClick={() => handleAddAction(action.id)}
              className="text-left justify-start"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </Box>

      <Box style={{ height: 400 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(event, node) => {
            if (node.data.type === "js_script" || node.data.type === "groovy_script") {
              handleEditCode(node.id, node.data.type)
            }
          }}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </Box>

      {/* Code Editor Dialog */}
      <Dialog open={codeDialogOpen} onClose={() => setCodeDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {scriptType === "js" ? "JavaScript" : "Groovy"} Editor
          <IconButton
            aria-label="close"
            onClick={() => setCodeDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div style={{ height: 400, border: "1px solid #ddd" }}>
            <Editor
              height="400px"
              language={scriptType === "js" ? "javascript" : "groovy"}
              value={scriptCode}
              onChange={(value) => setScriptCode(value || "")}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCodeDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveCode}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default WorkflowEditor

