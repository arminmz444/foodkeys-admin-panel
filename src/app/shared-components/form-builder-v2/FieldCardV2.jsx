// src/components/FormBuilderV2/FieldCardV2.jsx
import React from "react";

/**
 * FieldCardV2
 * Renders a single component card (icon, label, plus sign).
 *
 * Props:
 * - icon (string) : URL or path to icon
 * - displayName (string) : Label to show
 * - onAddClick (function) : Handler for when the user clicks the plus button
 */
const FieldCardV2 = ({ icon, displayName, onAddClick }) => {
  return (
    <div
      className="
        relative
        bg-white
        rounded
        shadow
        p-3
        flex
        flex-col
        items-center
        justify-center
        text-center
        border
        border-gray-200
        hover:border-blue-300
        cursor-pointer
      "
      style={{ width: "100%", minHeight: "100px", direction: "rtl" }}
    >
      {/* Plus button in top-right corner */}
      <button
        onClick={onAddClick}
        className="
          absolute
          top-1
          right-1
          bg-gray-100
          rounded-full
          p-1
          text-gray-600
          hover:bg-gray-200
          focus:outline-none
          shadow
        "
        aria-label="افزودن"
      >
        +
      </button>

      {/* Icon (inline or from URL) */}
      <div className="mb-2">
        {icon ? (
          <img src={icon} alt="" className="w-6 h-6" />
        ) : (
          /* Placeholder inline SVG for a "cube" icon */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 2.75l4.5 2m-4.5 0l-4.5 2m4.5-2v4.5m4.5-2l4.5 2m-4.5-2v4.5m0 9.75l-4.5-2m4.5 2l4.5-2m-4.5 2v-4.5m-9-11.25v12l9 4.5 9-4.5v-12l-9-4.5-9 4.5z"
            />
          </svg>
        )}
      </div>

      {/* Label */}
      <div className="text-sm font-medium text-gray-800">{displayName}</div>
    </div>
  );
};

export default FieldCardV2;
