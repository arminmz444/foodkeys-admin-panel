// src/components/FormBuilderV2/MiddleCanvasV2.jsx
import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

/**
 * MiddleCanvasV2
 * The main form canvas area (droppable).
 *
 * Props:
 * - fields (array): The list of fields to render
 * - selectedFieldId (string): ID of the currently selected field
 * - onSelectField (function): Called when a field is clicked
 */
const MiddleCanvasV2 = ({ fields, selectedFieldId, onSelectField }) => {
  return (
    <Droppable droppableId="middle-canvas">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="
            bg-white
            h-full
            overflow-auto
            border-r
            border-gray-300
            p-4
          "
          style={{ direction: "rtl" }}
        >
          <h2 className="text-md font-semibold mb-4">بوم فرم (Form Canvas)</h2>
          {fields.length === 0 ? (
            <p className="text-sm text-gray-600">
              هنوز فیلدی اضافه نشده است. برای اضافه‌کردن فیلد، از ستون سمت راست
              استفاده کنید.
            </p>
          ) : (
            fields.map((field, index) => (
              <Draggable key={field.id} draggableId={field.id} index={index}>
                {(providedDraggable) => {
                  const isSelected = field.id === selectedFieldId;
                  return (
                    <div
                      ref={providedDraggable.innerRef}
                      {...providedDraggable.draggableProps}
                      {...providedDraggable.dragHandleProps}
                      className={`
                        mb-2
                        p-3
                        bg-gray-50
                        border
                        rounded
                        cursor-move
                        ${isSelected ? "border-blue-500" : "border-gray-200"}
                      `}
                      onClick={() => onSelectField(field.id)}
                    >
                      <div className="font-medium text-sm">
                        {field.label} -{" "}
                        <span className="text-xs text-gray-500">
                          {field.type}
                        </span>
                      </div>
                    </div>
                  );
                }}
              </Draggable>
            ))
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default MiddleCanvasV2;
