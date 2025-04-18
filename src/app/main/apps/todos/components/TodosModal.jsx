import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, LinearProgress, ToggleButton, Button, TextField, Checkbox, DialogContent } from "@mui/material";
import { Plus, Eye, EyeOff, Trash2 } from "lucide-react";

export default function TodosModal(props) {
    const { defaultItems } = props;
    const [todos, setTodos] = useState(defaultItems)
  const [newTodo, setNewTodo] = useState("")
  const [showCompleted, setShowCompleted] = useState(true)

  const addTodo = (e) => {
    e.preventDefault()
    if (newTodo.trim()) {
      setTodos([{ id: Date.now(), text: newTodo, completed: false }, ...todos])
      setNewTodo("")
    }
  }

  const toggleTodo = (id) => {
    setTodos(
      todos
        .map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
        .sort((a, b) => Number(a.completed) - Number(b.completed)),
    )
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const completedCount = todos.filter((todo) => todo.completed).length
  const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0

  const activeTodos = todos.filter((todo) => !todo.completed)
  const completedTodos = todos.filter((todo) => todo.completed)

  return (
    <DialogContent className="w-full max-w-md bg-slate-800 shadow-lg border-0" sx={{ bgcolor: "transparent" }}>
        <CardContent className="text-white p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-100">وظایف شخصی شما</h1>
                <ToggleButton
                  value="check"
                  selected={showCompleted}
                  onChange={() => setShowCompleted(!showCompleted)}
                  className="bg-slate-700 hover:bg-slate-600"
                  sx={{
                    bgcolor: showCompleted ? "rgb(71, 85, 105)" : "rgb(51, 65, 85)",
                    "&:hover": { bgcolor: "rgb(71, 85, 105)" },
                    minWidth: "36px",
                    height: "36px",
                    padding: "0",
                    borderRadius: "4px",
                    border: "none",
                  }}
                >
                  {showCompleted ? (
                    <Eye className="h-4 w-4 text-slate-200" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-slate-200" />
                  )}
                </ToggleButton>
              </div>
              <div className="relative">
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  className="h-2"
                  sx={{
                    height: "8px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(226, 232, 240, 0.2)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "rgb(21, 128, 61)",
                    },
                  }}
                />
              </div>
              <p className="text-sm text-slate-300">
                {completedCount} of {todos.length} tasks completed
              </p>
            </div>

            <form onSubmit={addTodo} className="flex gap-2">
              <TextField
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="یک تسک جدید اضافه کن ..."
                className="flex-1"
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgb(51, 65, 85)",
                    color: "rgb(241, 245, 249)",
                    "& fieldset": {
                      borderColor: "rgb(71, 85, 105)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgb(56, 189, 248)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "rgb(56, 189, 248)",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgb(148, 163, 184)",
                    opacity: 1,
                  },
                }}
                InputProps={{
                  sx: { height: "40px" },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                className="bg-sky-500 hover:bg-sky-600 text-white ms-10"
                sx={{
                  minWidth: "40px",
                  width: "40px",
                  height: "40px",
                  padding: 0,
                  backgroundColor: "rgb(14, 165, 233)",
                  "&:hover": {
                    backgroundColor: "rgb(2, 132, 199)",
                  },
                }}
              >
                <Plus className="h-35 w-35" />
              </Button>
            </form>

            {/* Todo List */}
            <motion.div layout className="space-y-2">
              <AnimatePresence initial={false}>
                {activeTodos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      opacity: { duration: 0.2 },
                    }}
                  >
                    <div className="group flex items-center gap-3 p-3 rounded-lg transition-all duration-300 bg-slate-700/30 hover:bg-slate-700/50">
                      <Checkbox
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="transition-colors"
                        sx={{
                          color: "rgb(100, 116, 139)",
                          padding: "4px",
                          "&.Mui-checked": {
                            color: "rgb(100, 116, 139)",
                          },
                        }}
                      />
                      <span className="flex-1 text-slate-100">{todo.text}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Divider */}
            {showCompleted && completedTodos.length > 0 && activeTodos.length > 0 && (
              <div className="border-t border-slate-600" />
            )}

            {/* Completed Todo List */}
            {showCompleted && (
              <motion.div layout className="space-y-2">
                <AnimatePresence initial={false}>
                  {completedTodos.map((todo) => (
                    <motion.div
                      key={todo.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        opacity: { duration: 0.2 },
                      }}
                    >
                      <div className="group flex items-center gap-3 p-3 rounded-lg transition-all duration-300 bg-slate-700/50 text-slate-300/80">
                        <Checkbox
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          className="transition-colors"
                          sx={{
                            color: "rgb(148, 163, 184)",
                            padding: "4px",
                            "&.Mui-checked": {
                              color: "rgb(148, 163, 184)",
                            },
                          }}
                        />
                        <span className="flex-1">{todo.text}</span>
                        <Button
                          variant="text"
                          onClick={() => deleteTodo(todo.id)}
                          className="text-slate-400 hover:bg-transparent"
                          sx={{
                            minWidth: "32px",
                            width: "32px",
                            height: "32px",
                            padding: 0,
                            color: "rgb(148, 163, 184)",
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          <Trash2 className="h-35 w-35" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Empty State */}
            {todos.length === 0 && <div className="text-center py-6 text-slate-400">Add your first task above ✨</div>}
          </div>
        </CardContent>
      </DialogContent>
  )
}
