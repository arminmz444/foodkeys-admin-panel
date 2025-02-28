// src/components/FormBuilderV2/RightSidebarV2.jsx
import React, { useState } from "react";
import FieldCardV2 from "./FieldCardV2";

const RightSidebarV2 = ({ onAddField }) => {
  // The same component list from Part 3
  const [componentList] = useState([
    { type: "text", displayName: "متن (Text)", icon: "" },
    { type: "number", displayName: "عدد (Number)", icon: "" },
    { type: "select", displayName: "انتخاب تکی (Select)", icon: "" },
    // ... (rest of your components)
    { type: "Captcha", displayName: "کپچا (Captcha)", icon: "" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredList = componentList.filter((comp) =>
    comp.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Updated handler: call onAddField from props
  const handleAddComponent = (type) => {
    if (onAddField) {
      onAddField(type);
    }
  };

  return (
    <div
      className="
        bg-gray-100
        h-full
        flex
        flex-col
      "
      style={{ direction: "rtl" }}
    >
      <div className="p-3 border-b border-gray-300">
        <input
          type="text"
          placeholder="جستجوی کامپوننت‌ها..."
          className="
            w-full
            bg-white
            border
            border-gray-300
            rounded
            px-2
            py-1
            text-sm
            focus:outline-none
          "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ direction: "rtl" }}
        />
      </div>

      <div className="flex-1 overflow-auto p-3">
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-3
          "
        >
          {filteredList.map((item) => (
            <FieldCardV2
              key={item.type}
              icon={item.icon}
              displayName={item.displayName}
              onAddClick={() => handleAddComponent(item.type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebarV2;
