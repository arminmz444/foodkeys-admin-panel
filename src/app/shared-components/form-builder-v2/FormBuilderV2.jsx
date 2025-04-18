// src/components/FormBuilderV2/FormBuilderV2.jsx
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import AppBarV2 from "./AppBarV2";
import LeftPanelV2 from "./LeftPanelV2";
import MiddleCanvasV2 from "./MiddleCanvasV2";
import RightSidebarV2 from "./RightSidebarV2";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const FormBuilderV2 = () => {
  const [fields, setFields] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  // Add new field from the right sidebar
  const handleAddField = (type) => {
    const newField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type}`,
      placeholder: "",
    };
    setFields((prev) => [...prev, newField]);
  };

  // Reorder fields on drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = reorder(
      fields,
      result.source.index,
      result.destination.index
    );
    setFields(reordered);
  };

  // Select a field
  const handleSelectField = (fieldId) => {
    setSelectedFieldId(fieldId);
  };

  // Deselect the current field (go back to live preview)
  const handleDeselectField = () => {
    setSelectedFieldId(null);
  };

  // Update a field’s data
  const handleUpdateField = (fieldId, updates) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, ...updates } : f))
    );
  };

  return (
    <div className="w-full h-screen flex flex-col" style={{ direction: "rtl" }}>
      <AppBarV2 />

      <div className="flex flex-row flex-grow" style={{ minHeight: 0 }}>
        {/* Left Panel */}
        <div className="w-1/3" style={{ minHeight: 0 }}>
          <LeftPanelV2
            selectedFieldId={selectedFieldId}
            fields={fields}
            onDeselectField={handleDeselectField}
            onUpdateField={handleUpdateField}
          />
        </div>

        {/* Middle Canvas (DragDrop) */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="w-1/3" style={{ minHeight: 0 }}>
            <MiddleCanvasV2
              fields={fields}
              selectedFieldId={selectedFieldId}
              onSelectField={handleSelectField}
            />
          </div>
        </DragDropContext>

        {/* Right Sidebar */}
        <div className="w-1/3" style={{ minHeight: 0 }}>
          <RightSidebarV2 onAddField={handleAddField} />
        </div>
      </div>
    </div>
  );
};

export default FormBuilderV2;
