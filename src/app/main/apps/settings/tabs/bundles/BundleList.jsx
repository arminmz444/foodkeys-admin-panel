import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { Step, StepContent, StepLabel } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Divider from "@mui/material/Divider";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import { IoMdTime } from "react-icons/io";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import Error404Page from "src/app/main/404/Error404Page";
import AddBundle from "./AddBundle";
import BundleCard from "./BundleCard";

function BundleList() {
	const bankBundles = [
		{
			title: "بانک تولیدکنندگان",
			updatedAt: "1403/05/22 - 22:15",
			bundles: {
				list: [
					{
						title: "پلن تست رایگان",
						duration: "2 ماه",
						isActive: true,
						price: "0",
					},
					{
						title: "پلن عادی",
						duration: "3 ماه",
						isActive: true,
						price: "3000000",
					},
					{
						title: "پلن پیشرفته",
						duration: "3 ماه",
						isActive: false,
						price: "6500000",
					},
				],
				totalActive: 5,
			},
			order: 1,
		},
		{
			title: "بانک ماشین آلات",
			updatedAt: "1403/05/22 - 22:15",
			bundles: {
				list: [
					{
						title: "پلن تست رایگان",
						duration: "2 ماه",
						isActive: true,
						price: "6500000",
					},
				],
				totalActive: 2,
			},
			order: 2,
		},
		{
			title: "بانک ملزومات بسته‌بندی",
			updatedAt: "1403/05/22 - 22:15",
			bundles: {
				list: [
					{
						title: "پلن تست رایگان",
						duration: "2 ماه",
						isActive: true,
						price: 6500000,
					},
				],
				totalActive: 3,
			},
			order: 3,
		},
	];

	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
	const theme = useTheme();
	const pageLayout = useRef(null);
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
	const [currentStep, setCurrentStep] = useState(0);
	const routeParams = useParams();
	const { courseId } = routeParams;
	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);

	// const currentStep = 0;

	// const currentStep = course?.progress?.currentStep || 0;

	function updateBank(index) {
		return bankBundles[index];
	}

	function updateCurrentStep(index) {
		if (bankBundles && (index > bankBundles.length || index < 0)) {
			return;
		}

		setCurrentStep(index);
	}

	function handleNext() {
		// setCurrentStep(currentStep + 1);
		updateCurrentStep(currentStep + 1);
	}

	function handleBack() {
		// setCurrentStep(currentStep - 1);
		updateCurrentStep(currentStep - 1);
	}

	function handleStepChange(index) {
		console.log(index);
		setCurrentStep(index + 1);
	}

	const activeStep = currentStep !== 0 ? currentStep : 1;

	// if (isLoading) {
	// 	return <FuseLoading />;
	// }

	if (!bankBundles) {
		return <Error404Page />;
	}

	return (
		<FusePageSimple
			content={
				<div className="w-full">
					<Hidden lgUp>
						<Paper
							className="flex sticky top-0 z-10 items-center w-full px-16 py-8 border-b-1 shadow-0"
							square
						>
							<IconButton to="/apps/settings/bundle-setting" component={Link}>
								<FuseSvgIcon>
									{theme.direction === "ltr"
										? "heroicons-outline:arrow-sm-left"
										: "heroicons-outline:arrow-sm-right"}
								</FuseSvgIcon>
							</IconButton>

							<Typography className="text-13 font-medium tracking-tight mx-10">
								{bankBundles[currentStep].title}
							</Typography>
						</Paper>
					</Hidden>

					<SwipeableViews
						index={activeStep - 1}
						enableMouseEvents
						// onChangeIndex={handleStepChange}
					>
						{bankBundles.map((bank, index) => (
							<div
								className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64"
								key={index}
							>
								<Paper className="w-full max-w-lg mx-auto sm:my-8 lg:mt-16 p-24 sm:p-40 sm:py-48 rounded-16 shadow overflow-hidden">
									<div
										className="prose prose-sm dark:prose-invert w-full max-w-full"
										// eslint-disable-next-line react/no-danger
										// dangerouslySetInnerHTML={{ __html: step.title }}
										dir={theme.direction}
									>
										<AddBundle />
										<div key={index} className="flex flex-col gap-20">
											{bank.bundles.list.map((bundle, index) => (
												<BundleCard
													amount={bundle.price}
													isActive={bundle.isActive}
													title={bundle.title}
												/>
											))}
										</div>
									</div>
								</Paper>
							</div>
						))}
					</SwipeableViews>

					<Hidden lgDown>
						<div className="flex justify-center w-full sticky bottom-0 p-16 pb-32 z-10">
							<ButtonGroup
								variant="contained"
								aria-label=""
								className="rounded-full"
								color="secondary"
							>
								<Button
									className="min-h-56 rounded-full"
									size="large"
									startIcon={
										<FuseSvgIcon>
											heroicons-outline:arrow-narrow-right
										</FuseSvgIcon>
									}
									onClick={handleBack}
								>
									قبلی
								</Button>
								<Button
									className="pointer-events-none min-h-56"
									size="large"
								>{`${activeStep}/${bankBundles.length}`}</Button>
								<Button
									className="min-h-56 rounded-full"
									size="large"
									endIcon={
										<FuseSvgIcon>
											heroicons-outline:arrow-narrow-left
										</FuseSvgIcon>
									}
									onClick={handleNext}
								>
									بعدی
								</Button>
							</ButtonGroup>
						</div>
					</Hidden>

					<Hidden lgUp>
						<Box
							sx={{ backgroundColor: "background.paper" }}
							className="flex sticky bottom-0 z-10 items-center w-full p-16 border-t-1"
						>
							<IconButton
								onClick={() => setLeftSidebarOpen(true)}
								aria-label="open left sidebar"
								size="large"
							>
								<FuseSvgIcon>heroicons-outline:view-list</FuseSvgIcon>
							</IconButton>

							<Typography className="mx-8">{`${activeStep}/${bankBundles.length}`}</Typography>

							<IconButton onClick={handleBack}>
								<FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>
							</IconButton>

							<IconButton onClick={handleNext}>
								<FuseSvgIcon>heroicons-outline:arrow-narrow-right</FuseSvgIcon>
							</IconButton>
						</Box>
					</Hidden>
				</div>
			}
			leftSidebarOpen={leftSidebarOpen}
			leftSidebarOnClose={() => {
				setLeftSidebarOpen(false);
			}}
			leftSidebarWidth={350}
			leftSidebarContent={
				<>
					<div className="p-32">
						<Button
							to="/apps/settings/bundle-setting"
							component={Link}
							className="mb-24"
							color="secondary"
							variant="text"
							startIcon={
								<FuseSvgIcon size={20}>
									{theme.direction === "ltr"
										? "heroicons-outline:arrow-sm-left"
										: "heroicons-outline:arrow-sm-right"}
								</FuseSvgIcon>
							}
						>
							بازگشت به لیست بانک ها
						</Button>
						<div>
							<Typography variant="h6" className="font-800">
								پلن‌های بانک اطلاعات صنایع غذایی
							</Typography>

							<div className="flex gap-5 ">
								<IoMdTime size={20} />
								<Typography variant="caption">
									اخرین بروزرسانی : 22:10 - 1403/02/30
									{/* اخرین بروزرسانی : {updatedTime} - {updatedDate} */}
								</Typography>
							</div>
						</div>
						{/* <CourseInfo course={course} /> */}
					</div>
					<Divider />
					<Stepper
						classes={{ root: "p-32" }}
						activeStep={activeStep - 1}
						orientation="vertical"
						nonLinear
					>
						{bankBundles.map((step, index) => {
							return (
								<Step
									key={index}
									sx={{
										"& .MuiStepLabel-root, & .MuiStepContent-root": {
											cursor: "pointer!important",
										},
										"& .MuiStepContent-root": {
											color: "text.secondary",
											fontSize: 13,
										},
									}}
									onClick={() => handleStepChange(index)}
									expanded
								>
									<StepLabel
										className="font-medium"
										sx={{
											"& .MuiSvgIcon-root": {
												color: "background.default",
												"& .MuiStepIcon-text": {
													fill: (_theme) => _theme.palette.text.secondary,
												},
												"&.Mui-completed": {
													color: "secondary.main",
													"& .MuiStepIcon-text ": {
														fill: (_theme) =>
															_theme.palette.secondary.contrastText,
													},
												},
												"&.Mui-active": {
													color: "secondary.main",
													"& .MuiStepIcon-text ": {
														fill: (_theme) =>
															_theme.palette.secondary.contrastText,
													},
												},
											},
										}}
									>
										{step.title}
									</StepLabel>
									<StepContent>
										<span className="flex items-center gap-5 flex-nowrap">
											<IoMdTime size={16} />
											<Typography variant="caption">
												آخرین بروزرسانی:
											</Typography>
											{step.updatedAt}
										</span>
										<div className="flex gap-5 text-green-500">
											<RiVerifiedBadgeFill size={20} />
											<Typography variant="caption">
												تعداد پلن‌های فعال : {step.bundles.totalActive}
												{/* تعداد پلن‌های فعال : {activeCount} */}
											</Typography>
										</div>
									</StepContent>
								</Step>
							);
						})}
					</Stepper>
				</>
			}
			scroll="content"
			ref={pageLayout}
		/>
	);
}

export default BundleList;
