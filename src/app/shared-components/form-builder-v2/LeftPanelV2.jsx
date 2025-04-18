// src/components/FormBuilderV2/LeftPanelV2.jsx
import React from "react";

/**
 * LeftPanelV2
 * Shows either a live preview of the form or
 * the edit form for a selected field (with a back-arrow button).
 * For now, this is a placeholder.
 */
const LeftPanelV2 = () => {
  return (
    <div
      className="
        bg-gray-50
        h-full
        overflow-auto
        border-r
        border-gray-300
        p-4
      "
      style={{ direction: "rtl" }}
    >
      {/* Placeholder content */}
      <h2 className="text-md font-semibold mb-4">
        پیش‌نمایش فرم (Live Preview)
      </h2>
      <p className="text-sm text-gray-600">
        اینجا پیش‌نمایش یا فرم ویرایش فیلدها نشان داده می‌شود.
      </p>
    </div>
  );
};

export default LeftPanelV2;
