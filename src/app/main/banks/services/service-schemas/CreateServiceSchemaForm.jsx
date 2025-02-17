import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple/FusePageSimple.jsx';
import CustomSidebarContent from 'app/shared-components/CustomSidebarContent/CustomSidebarContent.jsx';
import DynamicFieldGenerator from 'app/shared-components/dynamic-field-generator/DynamicFieldGenerator.jsx';
import CommandMenu from 'app/shared-components/command-menu/CommandMenu.jsx';
import useThemeMediaQuery from '../../../../../@fuse/hooks/useThemeMediaQuery.js';
import ServiceSchemaNavigation from './ServiceSchemaNavigation.js';

const Root = styled(FusePageSimple)(() => ({
	'& .FusePageCarded-header': {},
	'& .FusePageCarded-sidebar': {},
	'& .FusePageCarded-leftSidebar': {}
}));

/**
 * The Create Service Schema Form.
 */
function CreateServiceSchemaForm() {
	const location = useLocation();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);
	useEffect(() => {
		if (isMobile) {
			setLeftSidebarOpen(false);
		}
	}, [location, isMobile]);
	const onSubmit = (e) => {
		alert(`Your service schema is :\n\n ${JSON.stringify(e)}\n`);
	};
	return (
		<Root
			content={
				<div className="flex-auto p-12 md:p-32 lg:p-48">
					<DynamicFieldGenerator
						initialValue={{}}
						onSubmit={onSubmit}
					/>
					<CommandMenu />
				</div>
			}
			// leftSidebarOpen={leftSidebarOpen}
			// leftSidebarOnClose={() => {
			// 	setLeftSidebarOpen(false);
			// }}
			// leftSidebarContent={
			// 	<CustomSidebarContent
			// 		title="مدیریت ساختار خدمات"
			// 		navigation={ServiceSchemaNavigation}
			// 		onSetSidebarOpen={setLeftSidebarOpen}
			// 	/>
			// }
			// leftSidebarWidth={350}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
	// <FusePageCarded
	//
	//
	// 	// header={<ServiceSchemaFormHeader />}
	// 	rightSidebarContent={rightSidebarContent}
	// 	rightSidebarOpen={rightSidebarOpen}
	// 	content={
	// 		<DynamicFieldGenerator
	// 			initialValue={{}}
	// 			onSubmit={onSubmit}
	// 		/>
	// 	}
	// />
}

export default CreateServiceSchemaForm;

// {
// 	/* // <Grid */
// }
// 	container
// 	rowSpacing={1}
// 	columnSpacing={{ xs: 1, sm: 2, md: 3 }}
// 	className="pt-8 px-32"
// >
// 	<Controller
// 		name="category"
// 		control={control}
// 		render={({ field }) => (
// 			<FormControl className="mt-8 mb-16 w-full">
// 				<InputLabel id="categorySelect">دسته بندی</InputLabel>
// 				<Select
// 					labelId="categorySelect"
// 					id="categorySelect1"
// 					value={AGRICULTURE_INDUSTRY_CATEGORIES}
// 					label="دسته بندی"
// 					onChange={handleChange}
// 					fullWidth
// 					required
// 				>
// 					{AGRICULTURE_INDUSTRY_CATEGORIES.map((cat, catIndex) => (
// 						<MenuItem
// 							key={cat}
// 							value={catIndex}
// 						>
// 							{cat}
// 						</MenuItem>
// 					))}
// 				</Select>
// 			</FormControl>
// 			// <TextField
// 			// 	{...field}
// 			// 	className="mt-8 mb-16 sm:mx-4"
// 			// 	error={!!errors.category}
// 			// 	required
// 			// 	helperText={errors?.category?.message}
// 			// 	label="دسته بندی"
// 			// 	id="category"
// 			// 	variant="outlined"
// 			// 	fullWidth
// 			// />
// 		)}
// 	/>
// 	<Grid xs={6}>
// 		<Controller
// 			name="companyName"
// 			control={control}
// 			render={({ field }) => (
// 				<TextField
// 					{...field}
// 					className="mt-8 mb-16 me-4"
// 					required
// 					label="نام شرکت"
// 					autoFocus
// 					id="companyName"
// 					variant="outlined"
// 					fullWidth
// 					error={!!errors.companyName}
// 					helperText={errors?.companyName?.message}
// 				/>
// 			)}
// 		/>
// 	</Grid>
// 	<Grid xs={6}>
// 		<Controller
// 			name="companyNameEn"
// 			control={control}
// 			render={({ field }) => (
// 				<TextField
// 					{...field}
// 					className="mt-8 mb-16 ms-4"
// 					required
// 					label="نام شرکت به انگلیسی"
// 					autoFocus
// 					id="companyNameEn"
// 					variant="outlined"
// 					fullWidth
// 					error={!!errors.companyNameEn}
// 					helperText={errors?.companyNameEn?.message}
// 				/>
// 			)}
// 		/>
// 	</Grid>
//
// 	<Controller
// 		name="description"
// 		control={control}
// 		render={({ field }) => (
// 			<TextField
// 				{...field}
// 				className="mt-8 mb-16"
// 				id="description"
// 				label="Description"
// 				type="text"
// 				multiline
// 				rows={5}
// 				variant="outlined"
// 				fullWidth
// 			/>
// 		)}
// 	/>
//
// 	<Controller
// 		name="categories"
// 		control={control}
// 		defaultValue={[]}
// 		render={({ field: { onChange, value } }) => (
// 			<Autocomplete
// 				className="mt-8 mb-16"
// 				multiple
// 				freeSolo
// 				options={[]}
// 				value={value}
// 				onChange={(event, newValue) => {
// 					onChange(newValue);
// 				}}
// 				renderInput={(params) => (
// 					<TextField
// 						{...params}
// 						placeholder="Select multiple categories"
// 						label="CategoriesOutlet"
// 						variant="outlined"
// 						InputLabelProps={{
// 							shrink: true
// 						}}
// 					/>
// 				)}
// 			/>
// 		)}
// 	/>
//
// 	<Controller
// 		name="tags"
// 		control={control}
// 		defaultValue={[]}
// 		render={({ field: { onChange, value } }) => (
// 			<Autocomplete
// 				className="mt-8 mb-16"
// 				multiple
// 				freeSolo
// 				options={[]}
// 				value={value}
// 				onChange={(event, newValue) => {
// 					onChange(newValue);
// 				}}
// 				renderInput={(params) => (
// 					<TextField
// 						{...params}
// 						placeholder="Select multiple tags"
// 						label="Tags"
// 						variant="outlined"
// 						InputLabelProps={{
// 							shrink: true
// 						}}
// 					/>
// 				)}
// 			/>
// 		)}
// 	/>
// </Grid>
