import FusePageCarded from "@fuse/core/FusePageCarded";
import { useThemeMediaQuery } from "@fuse/hooks/index.js";
import SubscriptionTable from "./SubscriptionTable";

function SubscriptionTab() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

	return (
		<SubscriptionTable />
		// <FusePageCarded
		// 	// header={<CompaniesHeader />}
		// 	content={<SubscriptionTable />}
		// 	scroll={isMobile ? "normal" : "content"}
		// />
	);
}

export default SubscriptionTab;
