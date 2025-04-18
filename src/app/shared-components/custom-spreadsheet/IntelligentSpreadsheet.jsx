"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ChevronRight, ChevronDown, Edit } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SocialLinks } from "./social-links"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { evaluateFormula, getCellId, getCellReference } from "@/utils/spreadsheet"

const COLUMNS = 10
const ROWS = 20

export function IntelligentSpreadsheet() {
  const [rows, setRows] = useState(
    Array.from({ length: ROWS }, (_, rowIndex) => ({
      id: (rowIndex + 1).toString(),
      cells: Array.from({ length: COLUMNS }, (_, colIndex) => ({
        id: `${rowIndex + 1}-${colIndex + 1}`,
        value: "",
        formula: "",
      })),
    })),
  )

  const [activeCell, setActiveCell] = useState(null)
  const [cellCommandModalOpen, setCellCommandModalOpen] = useState(false)
  const [cellCommand, setCellCommand] = useState("")
  const [cellCommandLoading, setCellCommandLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")
  const [selectedCell, setSelectedCell] = useState(null)
  const inputRef = useRef(null)
  const [hoveredCell, setHoveredCell] = useState(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, error } = useChat({
    api: "/api/spreadsheet",
    onResponse: (response) => {
      if (!response.ok) {
        toast.error("Failed to process command")
      }
    },
    onFinish: (message) => {
      try {
        const action = JSON.parse(message.content)
        if (Object.keys(action).length === 0) {
          throw new Error("Empty response from AI")
        }
        executeAction(action)
        if (action.type !== "ERROR") {
          toast.success("Command executed successfully")
        }
      } catch (error) {
        console.error("Failed to parse AI response:", error)
        toast.error(`Failed to parse AI response: ${error.message}`)
      }
    },
  })

  const getCellValue = (cellReference) => {
    const cellId = getCellId(cellReference)
    const [rowIndex, colIndex] = cellId.split("-").map((num) => Number.parseInt(num) - 1)
    const cell = rows[rowIndex]?.cells[colIndex]
    return cell ? evaluateFormula(cell.formula || cell.value.toString(), getCellValue) : "#REF!"
  }

  const executeAction = (action) => {
    console.log("Executing action:", action) // Debug log
    switch (action.type) {
      case "EDIT_CELL":
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === action.payload.rowId
              ? {
                  ...row,
                  cells: row.cells.map((cell) =>
                    cell.id === action.payload.cellId
                      ? { ...cell, value: action.payload.value, formula: action.payload.value }
                      : cell,
                  ),
                }
              : row,
          ),
        )
        break
      case "ADD_DATA":
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === action.payload.rowId
              ? {
                  ...row,
                  cells: row.cells.map((cell, index) =>
                    index === action.payload.columnIndex
                      ? { ...cell, value: action.payload.value, formula: action.payload.value }
                      : cell,
                  ),
                }
              : row,
          ),
        )
        break
      case "ADD_MULTIPLE_DATA":
        setRows((prevRows) => {
          const newRows = [...prevRows]
          action.payload.forEach((rowData) => {
            const rowIndex = Number.parseInt(rowData.rowId) - 1
            if (rowIndex >= 0 && rowIndex < newRows.length) {
              newRows[rowIndex] = {
                ...newRows[rowIndex],
                cells: newRows[rowIndex].cells.map((cell, index) => ({
                  ...cell,
                  value: index < rowData.values.length ? rowData.values[index] : cell.value,
                  formula: index < rowData.values.length ? rowData.values[index] : cell.formula,
                })),
              }
            }
          })
          return newRows
        })
        break
      case "ERROR":
        toast.error(action.payload.message)
        break
      default:
        console.error("Unknown action type:", action.type)
        toast.error("Unknown action type")
    }
  }

  const handleCellClick = (cellId) => {
    setActiveCell(cellId)
    setCellCommandModalOpen(true)
    const [rowIndex, colIndex] = cellId.split("-").map((num) => Number.parseInt(num) - 1)
    const cell = rows[rowIndex]?.cells[colIndex]
    setCellCommand(cell?.formula || cell?.value?.toString() || "")
    setSelectedCell({ row: rowIndex, column: colIndex })
  }

  const handleCellChange = (cellId, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        cells: row.cells.map((cell) => (cell.id === cellId ? { ...cell, value, formula: value } : cell)),
      })),
    )
  }

  const handleMainInputSubmit = (e) => {
    e.preventDefault()
    handleSubmit(e)
  }

  const handleCellCommandSubmit = async (e) => {
    e.preventDefault()
    if (activeCell) {
      const cellReference = getCellReference(activeCell)
      const command = `For cell ${cellReference}: ${cellCommand}`

      setCellCommandLoading(true)
      setDebugInfo("")

      try {
        const response = await fetch("/api/cell-command", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ command }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const responseText = await response.text()
        setDebugInfo(`Raw response: ${responseText}`)

        try {
          const action = JSON.parse(responseText)
          if (action.type && action.payload) {
            executeAction(action)
            toast.success("Cell command executed successfully")
          } else {
            throw new Error("Invalid response format from server")
          }
        } catch (parseError) {
          throw new Error(`Failed to parse response: ${parseError.message}`)
        }
      } catch (error) {
        console.error("Failed to execute cell command:", error)
        setDebugInfo(`Error: ${error.message}`)
        toast.error(`Failed to execute cell command: ${error instanceof Error ? error.message : "Unknown error"}`)
      } finally {
        setCellCommandLoading(false)
        setCellCommandModalOpen(false)
        setCellCommand("")
      }
    }
  }

  useEffect(() => {
    if (activeCell && inputRef.current) {
      inputRef.current.focus()
    }
  }, [activeCell])

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error.message}`)
    }
  }, [error])

  // Enhanced spreadsheet with better styling and interaction
  const renderSpreadsheet = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-10 h-10 bg-gray-100 border text-center font-semibold sticky left-0 z-10"></th>
              {Array.from({ length: COLUMNS }, (_, i) => (
                <th key={i} className="w-32 h-10 bg-gray-100 border text-center font-semibold sticky top-0 z-10">
                  {String.fromCharCode(65 + i)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id}>
                <td className="w-10 h-10 bg-gray-100 border text-center font-semibold sticky left-0 z-10">
                  {rowIndex + 1}
                </td>
                {row.cells.map((cell) => {
                  const isActive = cell.id === activeCell
                  const isHovered = cell.id === hoveredCell
                  const cellValue = getCellValue(getCellReference(cell.id))
                  const hasFormula = cell.formula.startsWith("=")

                  return (
                    <td
                      key={cell.id}
                      className={`w-32 h-10 border relative cursor-pointer transition-all duration-150
                        ${isActive ? "bg-blue-50 border-blue-500 border-2" : "hover:bg-gray-50"}
                        ${isHovered ? "bg-gray-50" : ""}
                      `}
                      onClick={() => handleCellClick(cell.id)}
                      onMouseEnter={() => setHoveredCell(cell.id)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div className="w-full h-full p-2 overflow-hidden flex items-center">
                        {cellValue}
                        {hasFormula && isHovered && (
                          <div className="absolute top-0 right-0 p-1 text-xs text-blue-500">
                            <Edit size={12} />
                          </div>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto p-4">
      <motion.h1 initial={{ y: -20 }} animate={{ y: 0 }} className="text-2xl font-bold mb-4 text-center">
        Intelligent Spreadsheet
      </motion.h1>

      <SocialLinks />

      <motion.form
        onSubmit={handleMainInputSubmit}
        className="flex gap-2 mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your command (e.g., 'Add the 10 most popular Netflix movies and their stats')"
          className="flex-grow"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Execute"}
        </Button>
      </motion.form>

      <motion.div
        className="mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold mb-2 flex items-center">
          <ChevronDown className="mr-2" />
          Command History
        </h2>
        <ul className="space-y-2 max-h-40 overflow-y-auto">
          <AnimatePresence>
            {messages
              .filter((m) => m.role === "user")
              .map((m, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-muted p-2 rounded flex items-center"
                >
                  <ChevronRight className="mr-2 flex-shrink-0" />
                  <span>{m.content}</span>
                </motion.li>
              ))}
          </AnimatePresence>
        </ul>
      </motion.div>

      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="overflow-x-auto rounded-lg border shadow-lg"
      >
        {renderSpreadsheet()}
      </motion.div>

      <Dialog open={cellCommandModalOpen} onOpenChange={setCellCommandModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter command for cell {activeCell ? getCellReference(activeCell) : ""}</DialogTitle>
            <DialogDescription>
              Enter a command or formula for this cell (e.g., "Set value to 100" or "=A1+B1")
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCellCommandSubmit} className="flex flex-col gap-4">
            <Input
              ref={inputRef}
              value={cellCommand}
              onChange={(e) => setCellCommand(e.target.value)}
              placeholder="Enter formula or value"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCellCommandModalOpen(false)}
                disabled={cellCommandLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={cellCommandLoading}>
                {cellCommandLoading ? "Processing..." : "Execute"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {debugInfo && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Debug Information:</h3>
          <pre className="whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      )}
    </motion.div>
  )
}

