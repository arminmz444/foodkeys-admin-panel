// src/app/excel-templates/components/ExcelTemplateContent.jsx
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

function ExcelTemplateContent() {
  return (
    <div className="w-full p-24 md:p-32">
      {/* <ToastContainer position="top-center" /> */}
      <Outlet />
    </div>
  );
}

export default ExcelTemplateContent;