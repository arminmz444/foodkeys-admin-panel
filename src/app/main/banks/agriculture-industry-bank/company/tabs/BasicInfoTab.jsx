import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { MenuItem } from '@mui/material';
import { useState } from 'react';
import { AGRICULTURE_INDUSTRY_CATEGORIES } from '@/core/constants/agriculture-industry-constants.js';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;
	const [category, setCategory] = useState('');
	const handleChange = (event) => {
		setCategory(event.target.value);
	};
	return (
		<div>
			<Controller
				name="category"
				control={control}
				render={({ field }) => (
					<FormControl className="mt-8 mb-16 w-full">
						<InputLabel id="categorySelect">دسته بندی</InputLabel>
						<Select
							labelId="categorySelect"
							id="categorySelect1"
							value={category}
							label="دسته بندی"
							onChange={handleChange}
							fullWidth
							required
						>
							{AGRICULTURE_INDUSTRY_CATEGORIES.map((cat, catIndex) => (
								<MenuItem
									key={cat}
									value={catIndex}
								>
									{cat}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					// <TextField
					// 	{...field}
					// 	className="mt-8 mb-16 sm:mx-4"
					// 	error={!!errors.category}
					// 	required
					// 	helperText={errors?.category?.message}
					// 	label="دسته بندی"
					// 	id="category"
					// 	variant="outlined"
					// 	fullWidth
					// />
				)}
			/>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="coName"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.coName}
							required
							helperText={errors?.coName?.message}
							label="نام شرکت"
							autoFocus
							id="coName"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="coNameEn"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.coNameEn}
							required
							helperText={errors?.coNameEn?.message}
							label="نام شرکت به انگلیسی"
							id="coNameEn"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="brandName"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.brandName}
							required
							helperText={errors?.brandName?.message}
							label="نام تجاری (برند) اصلی"
							id="brandName"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="brandNameEn"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.brandNameEn}
							required
							helperText={errors?.brandNameEn?.message}
							label="نام تجاری (برند) اصلی به انگلیسی"
							id="brandNameEn"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="coType"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.coType}
							helperText={errors?.coType?.message}
							label="نوع شرکت"
							id="coType"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="establishmentDate"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							type="number"
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.establishmentDate}
							helperText={errors?.establishmentDate?.message || '(مثال: 1389)'}
							label="تاریخ تأسیس"
							id="establishmentDate"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="activityType"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.activityType}
							helperText={
								errors?.activityType?.message || '(مثال : تولیدکننده، واردکننده، فروشنده، پرورش دهنده)'
							}
							label="نوع فعالیت"
							id="activityType"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="activityCapacity"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.activityCapacity}
							helperText={errors?.activityCapacity?.message}
							label="ظرفیت فعالیت"
							id="activityCapacity"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<Controller
				name="activitySubject"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 sm:mx-4"
						error={!!errors.activitySubject}
						helperText={errors?.activitySubject?.message}
						label="موضوع فعالیت"
						id="activitySubject"
						variant="outlined"
						fullWidth
						multiline
					/>
				)}
			/>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="landArea"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.landArea}
							helperText={errors?.landArea?.message}
							label="متراژ زمین"
							id="landArea"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="buildingArea"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.buildingArea}
							helperText={errors?.buildingArea?.message}
							label="متراژ بنا"
							id="buildingArea"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<div className="flex sm:flex-row flex-col -mx-4">
				<Controller
					name="ceoName"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.ceoName}
							helperText={errors?.ceoName?.message}
							label="نام و نام خانوادگی مدیرعامل"
							id="ceoName"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="ceoPhoneNumber"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							type="number"
							className="mt-8 mb-16 sm:mx-4"
							error={!!errors.ceoPhoneNumber}
							helperText={errors?.ceoPhoneNumber?.message || '(مثال: 09123456789)'}
							label="تلفن همراه مدیر عامل"
							id="ceoPhoneNumber"
							variant="outlined"
							fullWidth
						/>
					)}
				/>
			</div>
			<Controller
				name="shareholders"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16 sm:mx-4"
						error={!!errors.shareholders}
						helperText={errors?.shareholders?.message}
						label="نام مالک یا سهامداران"
						id="shareholders"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<Controller
				name="productsTitle"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						id="productsTitle"
						label="عنوان محصولات (یا خدمات)"
						type="text"
						multiline
						rows={3}
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			<Controller
				name="keywords"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						className="mt-8 mb-16"
						multiple
						freeSolo
						options={[]}
						value={value}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder="چندین کلمه کلیدی را انتخاب کنید"
								label="کلمات کلیدی"
								variant="outlined"
								InputLabelProps={{
									shrink: true
								}}
							/>
						)}
					/>
				)}
			/>

			<Controller
				name="tags"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						className="mt-8 mb-16"
						multiple
						freeSolo
						options={[]}
						value={value}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder="چندین برچسب را انتخاب کنید"
								label="برچسب ها"
								variant="outlined"
								InputLabelProps={{
									shrink: true
								}}
							/>
						)}
					/>
				)}
			/>
		</div>
		// <Grid
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
	);
}

export default BasicInfoTab;
