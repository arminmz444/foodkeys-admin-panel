// src/components/FormBuilderV2/AppBarV2.jsx
import React from "react";

/**
 * AppBarV2
 * A top navigation bar with Persian labels, aligned RTL,
 * similar to your screenshot. No logic for now, just UI placeholders.
 */
const AppBarV2 = () => {
  return (
    <header
      className="
        w-full
        h-14
        bg-white
        flex
        items-center
        border-b
        border-gray-200
        text-black
        px-4
        justify-between
        "
      style={{ direction: "rtl" }}
    >
      {/* Left side: Tabs in Persian */}
      <nav className="flex items-center space-x-4 space-x-reverse">
        <button className="text-sm font-medium hover:text-blue-600">
          برگه
        </button>
        <button className="text-sm font-medium hover:text-blue-600">
          تنظیمات
        </button>
        <button className="text-sm font-medium hover:text-blue-600">
          طراحی
        </button>
        <button className="text-sm font-medium hover:text-blue-600">
          متغیرها
        </button>
        <button className="text-sm font-medium hover:text-blue-600">
          پیش‌نمایش
        </button>
        <button className="text-sm font-medium hover:text-blue-600">
          آنالیز
        </button>
        <button className="text-sm font-medium hover:text-blue-600">شکل</button>
        <button className="text-sm font-medium hover:text-blue-600">
          ارسال‌ها
        </button>
        <button className="text-sm font-medium hover:text-blue-600">
          انتشار
        </button>
      </nav>

      {/* Right side: "14 Days left on Pro" placeholder, etc. */}
      <div className="flex items-center space-x-4 space-x-reverse">
        <span className="text-xs text-gray-500">
          ۱۴ روز باقی‌مانده از طرح حرفه‌ای
        </span>
        <button className="border border-gray-300 text-sm px-2 py-1 rounded hover:bg-gray-100">
          ارتقا
        </button>
      </div>
    </header>
  );
};

export default AppBarV2;
