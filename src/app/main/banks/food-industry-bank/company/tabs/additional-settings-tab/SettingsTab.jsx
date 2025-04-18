import FusePageSimple from "@fuse/core/FusePageSimple";
import Sidebar from "./Sidebar";
import DataSourceTable from "./DataSourceTable";
import FusePageCardedSidebar from "@fuse/core/FusePageCarded/FusePageCardedSidebar";
import { useRef, useState } from "react";

function SettingsTab() {
  const leftSidebarRef = useRef(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);

  return (
    <FusePageSimple
      // header={
      //   <div className="flex flex-col items-center justify-center p-16">
      //     <h1 className="text-2xl font-semibold mb-6">Users & Permissions</h1>
      //   </div>
      // }
      content={
        <>
        <FusePageCardedSidebar
                className="flex min-h-screen"
								position="right"
								variant="permanent"
								ref={leftSidebarRef}
								open={true} 
								onClose={() => setLeftSidebarOpen(false)}
							>
								<Sidebar />
							</FusePageCardedSidebar>
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Users & Permissions</h1>
          <DataSourceTable />
        </div>
        </>
      }
    />
  );
}

export default SettingsTab;
