"use client"
import { Typography } from "@mui/material"
import { Draggable, Droppable } from "react-beautiful-dnd"

// Component types
const componentTypes = [
  { id: "text", label: "Text", icon: "text_fields" },
  { id: "number", label: "Number", icon: "pin" },
  { id: "select", label: "Select", icon: "arrow_drop_down_circle" },
  { id: "multiselect", label: "Select Multiple", icon: "checklist" },
  { id: "checkbox", label: "Checkbox", icon: "check_box" },
  { id: "radio", label: "Radio", icon: "radio_button_checked" },
  { id: "textarea", label: "Textarea", icon: "notes" },
  { id: "date", label: "Date", icon: "calendar_today" },
  { id: "time", label: "Time", icon: "access_time" },
  { id: "email", label: "Email", icon: "email" },
  { id: "url", label: "URL", icon: "link" },
  { id: "tel", label: "Tel", icon: "phone" },
]

function ComponentPalette({ onAddComponent }) {
  return (
    <Droppable droppableId="component-palette" type="component-add" isDropDisabled={true}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className="component-palette">
          <div className="grid grid-cols-2 gap-2">
            {componentTypes.map((type, index) => (
              <Draggable key={type.id} draggableId={type.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white border border-gray-200 rounded-lg p-3 cursor-move hover:bg-gray-50 ${snapshot.isDragging ? "shadow-lg" : ""}`}
                    onClick={() => onAddComponent(type.id)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                        <span className="material-icons text-gray-600">{type.icon}</span>
                      </div>
                      <Typography variant="body2" className="text-center">
                        {type.label}
                      </Typography>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export default ComponentPalette

