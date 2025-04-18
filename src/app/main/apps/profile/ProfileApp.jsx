import FusePageSimple from "@fuse/core/FusePageSimple";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useState } from "react";
import Box from "@mui/material/Box";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import AboutTab from "./tabs/about/AboutTab";
import PhotosVideosTab from "./tabs/photos-videos/PhotosVideosTab";
import TimelineTab from "./tabs/timeline/TimelineTab";
import ProfileApi from "./ProfileApi";
import CustomTimeLine from "./tabs/timeline/CustomTimeLine";
import PasswordTab from "./tabs/password/PasswordTab";

const Root = styled(FusePageSimple)(({ theme }) => ({
	"& .FusePageSimple-header": {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: "solid",
		borderColor: theme.palette.divider,
		"& > .container": {
			maxWidth: "100%",
		},
	},
}));

/**
 * The profile page.
 */

const profileInfo = {
	firstname: "آرمین",
	lastname: "مظفری",
	city: "مازندران",
	provience: "ساری",
};

function ProfileApp() {
	const [selectedTab, setSelectedTab] = useState(0);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

	const { useGetUserInfoQuery } = ProfileApi;
	useGetUserInfoQuery();
	function handleTabChange(event, value) {
		setSelectedTab(value);
	}

	return (
		<Root
			header={
				<div className="flex flex-col w-full">
					<img
						className="h-160 lg:h-320 object-cover w-full"
						src="assets/images/pages/profile/cover.jpg"
						alt="Profile Cover"
					/>

					<div className="flex flex-col flex-0 lg:flex-row items-center max-w-5xl w-full mx-auto px-32 lg:h-72">
						<div className="-mt-96 lg:-mt-88 rounded-full">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1, transition: { delay: 0.1 } }}
							>
								<Avatar
									sx={{ borderColor: "background.paper" }}
									className="w-128 h-128 border-4"
									src="assets/images/avatars/male-04.jpg"
									alt="User avatar"
								/>
							</motion.div>
						</div>

						<div className="flex flex-col items-center lg:items-start mt-16 lg:mt-0 lg:ml-32">
							<Typography className="text-2xl font-bold leading-none">
								{`${profileInfo.firstname}  ${profileInfo.lastname}`}
							</Typography>
							<Typography color="text.secondary">
								{`${profileInfo.city} . ${profileInfo.provience}`}
							</Typography>
						</div>

						<div className="hidden lg:flex h-32 mx-32 border-l-2" />

						<div className="flex flex-1 justify-end my-16 lg:my-0">
							<Tabs
								value={selectedTab}
								onChange={handleTabChange}
								indicatorColor="primary"
								textColor="inherit"
								variant="scrollable"
								scrollButtons={false}
								className="-mx-4 min-h-40"
								classes={{
									indicator: "flex justify-center bg-transparent w-full h-full",
								}}
								TabIndicatorProps={{
									children: (
										<Box
											sx={{ bgcolor: "text.disabled" }}
											className="w-full h-full rounded-full opacity-20"
										/>
									),
								}}
							>
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
									disableRipple
									label="اطلاعات کاربری"
								/>
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
									disableRipple
									label="فعالیت‌ها"
								/>
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
									disableRipple
									label="رمز عبور"
								/>
							</Tabs>
						</div>
					</div>
				</div>
			}
			content={
				<div className="flex flex-auto justify-center w-full max-w-5xl mx-auto p-24 sm:p-32">
					{selectedTab === 0 && <AboutTab />}
					{selectedTab === 1 && <CustomTimeLine />}
					{selectedTab === 2 && <PasswordTab />}
				</div>
			}
			scroll={isMobile ? "normal" : "page"}
		/>
	);
}

export default ProfileApp;
