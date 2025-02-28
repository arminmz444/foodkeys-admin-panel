import FusePageSimple from "@fuse/core/FusePageSimple";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

const Root = styled(FusePageSimple)(() => ({
	"& .FusePageCarded-header": {},
	"& .FusePageCarded-sidebar": {},
	"& .FusePageCarded-leftSidebar": {},
}));

/**
 * The notes app.
 */
function CustomSettingsApp() {
	const location = useLocation();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);
	useEffect(() => {
		if (isMobile) {
			setLeftSidebarOpen(false);
		}
	}, [location, isMobile]);
	return <Outlet />;
}

export default CustomSettingsApp;
