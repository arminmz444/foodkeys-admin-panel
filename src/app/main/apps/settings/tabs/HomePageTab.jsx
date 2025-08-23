// // import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
// // import { zodResolver } from '@hookform/resolvers/zod';
// // import _ from '@lodash';
// // import Button from '@mui/material/Button';
// // import Divider from '@mui/material/Divider';
// // import FormControlLabel from '@mui/material/FormControlLabel';
// // import InputAdornment from '@mui/material/InputAdornment';
// // import Switch from '@mui/material/Switch';
// // import TextField from '@mui/material/TextField';
// // import Typography from '@mui/material/Typography';
// // import IconButton from '@mui/material/IconButton';
// // import { useEffect } from 'react';
// // import { Controller, useForm, useFieldArray } from 'react-hook-form';
// // import { AiOutlineBgColors } from 'react-icons/ai';
// // import { BsTextLeft } from 'react-icons/bs';
// // import { LuHeading1 } from 'react-icons/lu';
// // import { MdAddLink, MdDriveFileRenameOutline, MdDelete } from 'react-icons/md';
// // import { z } from 'zod';
// // import { useGetConfigQuery, useUpdateConfigMutation, useGetSchemasQuery } from '../api/websiteConfigApi';
// // import FuseLoading from '@fuse/core/FuseLoading';
// //
// // const schema = z.object({
// // 	slider: z.object({
// // 		slides: z.array(z.object({
// // 			title: z.string().min(1, 'عنوان الزامی می‌باشد'),
// // 			description: z.string().min(1, 'توضیحات الزامی می‌باشد'),
// // 			backgroundColor: z.string().min(1, 'رنگ پس زمینه الزامی می‌باشد'),
// // 			hasButton: z.boolean(),
// // 			buttonText: z.string().optional(),
// // 			buttonLink: z.string().optional(),
// // 			imageUrl: z.string().optional(),
// // 			order: z.number().min(0, 'ترتیب باید عدد مثبت باشد')
// // 		}))
// // 	})
// // });
// //
// // function HomePageTab() {
// // 	const { data: configResponse, isLoading: configLoading, error: configError } = useGetConfigQuery('WEBSITE_HOME_PAGE_CONFIG');
// // 	const { data: schemasResponse, isLoading: schemasLoading } = useGetSchemasQuery();
// // 	const [updateConfig, { isLoading: updateLoading }] = useUpdateConfigMutation();
// //
// // 	const { control, handleSubmit, formState, reset, watch } = useForm({
// // 		defaultValues: {
// // 			slider: {
// // 				slides: []
// // 			}
// // 		},
// // 		mode: 'all',
// // 		resolver: zodResolver(schema)
// // 	});
// //
// // 	const { fields, append, remove } = useFieldArray({
// // 		control,
// // 		name: 'slider.slides'
// // 	});
// //
// // 	const { isValid, dirtyFields, errors } = formState;
// //
// // 	useEffect(() => {
// // 		// Extract the actual config data from the API response structure
// // 		const configData = configResponse?.data;
// //
// // 		if (configData) {
// // 			// Check if slider exists in the data
// // 			const sliderData = configData.slider || { slides: [] };
// //
// // 			// Ensure slides is always an array
// // 			const normalizedSlider = {
// // 				slides: Array.isArray(sliderData.slides) ? sliderData.slides : []
// // 			};
// //
// // 			reset({ slider: normalizedSlider });
// // 		}
// // 	}, [configResponse, reset]);
// //
// // 	const onSubmit = async (formData) => {
// // 		try {
// // 			// Extract schemas array from response
// // 			const schemas = schemasResponse?.data || [];
// //
// // 			// Find the correct schema
// // 			const homePageSchema = schemas.find(s => s.name === 'WEBSITE_HOME_PAGE_CONFIG_SCHEMA');
// //
// // 			if (!homePageSchema) {
// // 				console.error('Home page schema not found');
// // 				return;
// // 			}
// //
// // 			await updateConfig({
// // 				section: 'WEBSITE_HOME_PAGE_CONFIG',
// // 				configData: {
// // 					schemaId: homePageSchema.id,
// // 					configData: formData
// // 				}
// // 			}).unwrap();
// // 		} catch (error) {
// // 			console.error('Error updating home page config:', error);
// // 		}
// // 	};
// //
// // 	const addSlide = () => {
// // 		append({
// // 			title: '',
// // 			description: '',
// // 			backgroundColor: '#ffffff',
// // 			hasButton: false,
// // 			buttonText: '',
// // 			buttonLink: '',
// // 			imageUrl: '',
// // 			order: fields.length
// // 		});
// // 	};
// //
// // 	if (configLoading || schemasLoading) {
// // 		return <FuseLoading />;
// // 	}
// //
// // 	if (configError) {
// // 		return <Typography color="error">خطا در بارگذاری تنظیمات صفحه اول</Typography>;
// // 	}
// //
// // 	const configData = configResponse?.data;
// //
// // 	return (
// // 		<div className="w-full max-w-3xl">
// // 			<form onSubmit={handleSubmit(onSubmit)}>
// // 				<div className="w-full">
// // 					<Typography className="text-xl">تنظیمات صفحه اول</Typography>
// // 					<Typography color="text.secondary" className="font-300">
// // 						تنظیمات اسلایدر و محتوای صفحه اول سایت را انجام دهید.
// // 					</Typography>
// // 				</div>
// //
// // 				<div className="mt-32 w-full space-y-24">
// // 					<div className="flex items-center justify-between">
// // 						<Typography className="text-lg">اسلایدرها</Typography>
// // 						<Button
// // 							variant="contained"
// // 							color="primary"
// // 							onClick={addSlide}
// // 							startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
// // 						>
// // 							افزودن اسلاید
// // 						</Button>
// // 					</div>
// //
// // 					{fields.map((field, index) => (
// // 						<div key={field.id} className="border rounded-lg p-24 space-y-24">
// // 							<div className="flex items-center justify-between">
// // 								<Typography className="text-base font-medium">اسلاید {index + 1}</Typography>
// // 								<IconButton
// // 									color="error"
// // 									onClick={() => remove(index)}
// // 									size="small"
// // 								>
// // 									<MdDelete />
// // 								</IconButton>
// // 							</div>
// //
// // 							<div className="grid gap-24 sm:grid-cols-2">
// // 								<Controller
// // 									control={control}
// // 									name={`slider.slides.${index}.title`}
// // 									render={({ field }) => (
// // 										<TextField
// // 											{...field}
// // 											label="عنوان اسلاید"
// // 											placeholder="عنوان اسلاید را بنویسید"
// // 											error={!!errors?.slider?.slides?.[index]?.title}
// // 											helperText={errors?.slider?.slides?.[index]?.title?.message}
// // 											variant="outlined"
// // 											required
// // 											fullWidth
// // 											InputProps={{
// // 												startAdornment: (
// // 													<InputAdornment position="start">
// // 														<LuHeading1 size={20} />
// // 													</InputAdornment>
// // 												)
// // 											}}
// // 										/>
// // 									)}
// // 								/>
// //
// // 								<Controller
// // 									control={control}
// // 									name={`slider.slides.${index}.order`}
// // 									render={({ field }) => (
// // 										<TextField
// // 											{...field}
// // 											type="number"
// // 											label="ترتیب"
// // 											placeholder="ترتیب نمایش"
// // 											error={!!errors?.slider?.slides?.[index]?.order}
// // 											helperText={errors?.slider?.slides?.[index]?.order?.message}
// // 											variant="outlined"
// // 											required
// // 											fullWidth
// // 											onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
// // 										/>
// // 									)}
// // 								/>
// //
// // 								<div className="sm:col-span-2">
// // 									<Controller
// // 										control={control}
// // 										name={`slider.slides.${index}.description`}
// // 										render={({ field }) => (
// // 											<TextField
// // 												{...field}
// // 												label="توضیحات"
// // 												placeholder="توضیحات اسلاید را بنویسید"
// // 												error={!!errors?.slider?.slides?.[index]?.description}
// // 												helperText={errors?.slider?.slides?.[index]?.description?.message}
// // 												variant="outlined"
// // 												required
// // 												multiline
// // 												minRows={3}
// // 												fullWidth
// // 												InputProps={{
// // 													className: 'max-h-min h-min items-start',
// // 													startAdornment: (
// // 														<InputAdornment position="start" className="mt-16">
// // 															<BsTextLeft size={20} />
// // 														</InputAdornment>
// // 													)
// // 												}}
// // 											/>
// // 										)}
// // 									/>
// // 								</div>
// //
// // 								<Controller
// // 									control={control}
// // 									name={`slider.slides.${index}.backgroundColor`}
// // 									render={({ field }) => (
// // 										<div className="relative">
// // 											<input
// // 												className="absolute z-10 border-0 left-0 top-0 translate-x-1/2 translate-y-1/3 w-32 h-32 rounded-xl cursor-pointer"
// // 												type="color"
// // 												value={field.value || '#ffffff'}
// // 												onChange={(e) => field.onChange(e.target.value)}
// // 											/>
// // 											<TextField
// // 												value={field.value || ''}
// // 												onChange={(e) => field.onChange(e.target.value)}
// // 												label="رنگ پس زمینه"
// // 												placeholder="رنگ پس زمینه اسلاید"
// // 												error={!!errors?.slider?.slides?.[index]?.backgroundColor}
// // 												helperText={errors?.slider?.slides?.[index]?.backgroundColor?.message}
// // 												variant="outlined"
// // 												fullWidth
// // 												InputProps={{
// // 													startAdornment: (
// // 														<InputAdornment position="start">
// // 															<AiOutlineBgColors size={20} />
// // 														</InputAdornment>
// // 													)
// // 												}}
// // 											/>
// // 										</div>
// // 									)}
// // 								/>
// //
// // 								<Controller
// // 									control={control}
// // 									name={`slider.slides.${index}.imageUrl`}
// // 									render={({ field }) => (
// // 										<TextField
// // 											{...field}
// // 											label="آدرس تصویر"
// // 											placeholder="URL تصویر اسلاید"
// // 											variant="outlined"
// // 											fullWidth
// // 										/>
// // 									)}
// // 								/>
// //
// // 								<div className="sm:col-span-2">
// // 									<Controller
// // 										name={`slider.slides.${index}.hasButton`}
// // 										control={control}
// // 										render={({ field: { onChange, value } }) => (
// // 											<div className="space-y-20">
// // 												<FormControlLabel
// // 													classes={{ root: 'm-0', label: 'flex flex-1' }}
// // 													labelPlacement="start"
// // 													label="استفاده از دکمه"
// // 													control={
// // 														<Switch
// // 															onChange={(ev) => onChange(ev.target.checked)}
// // 															checked={value}
// // 														/>
// // 													}
// // 												/>
// // 												{value && (
// // 													<div className="grid gap-20 sm:grid-cols-2">
// // 														<Controller
// // 															control={control}
// // 															name={`slider.slides.${index}.buttonText`}
// // 															render={({ field }) => (
// // 																<TextField
// // 																	{...field}
// // 																	label="متن دکمه"
// // 																	placeholder="متن دکمه اسلاید"
// // 																	variant="outlined"
// // 																	fullWidth
// // 																	InputProps={{
// // 																		startAdornment: (
// // 																			<InputAdornment position="start">
// // 																				<MdDriveFileRenameOutline size={20} />
// // 																			</InputAdornment>
// // 																		)
// // 																	}}
// // 																/>
// // 															)}
// // 														/>
// // 														<Controller
// // 															control={control}
// // 															name={`slider.slides.${index}.buttonLink`}
// // 															render={({ field }) => (
// // 																<TextField
// // 																	{...field}
// // 																	label="لینک دکمه"
// // 																	placeholder="لینک دکمه اسلاید"
// // 																	variant="outlined"
// // 																	fullWidth
// // 																	InputProps={{
// // 																		startAdornment: (
// // 																			<InputAdornment position="start">
// // 																				<MdAddLink size={20} />
// // 																			</InputAdornment>
// // 																		)
// // 																	}}
// // 																/>
// // 															)}
// // 														/>
// // 													</div>
// // 												)}
// // 											</div>
// // 										)}
// // 									/>
// // 								</div>
// // 							</div>
// // 						</div>
// // 					))}
// //
// // 					{fields.length === 0 && (
// // 						<div className="border-2 border-dashed border-gray-300 rounded-lg p-40 text-center">
// // 							<Typography color="text.secondary">
// // 								هیچ اسلایدی وجود ندارد. برای شروع روی دکمه "افزودن اسلاید" کلیک کنید.
// // 							</Typography>
// // 						</div>
// // 					)}
// // 				</div>
// //
// // 				<Divider className="mb-40 mt-44 border-t" />
// // 				<div className="flex items-center justify-end gap-x-10 w-1/2">
// // 					<Button
// // 						variant="outlined"
// // 						disabled={_.isEmpty(dirtyFields)}
// // 						onClick={() => {
// // 							const data = configData?.slider || { slides: [] };
// // 							reset({
// // 								slider: {
// // 									slides: Array.isArray(data.slides) ? data.slides : []
// // 								}
// // 							});
// // 						}}
// // 						size="large"
// // 						fullWidth
// // 					>
// // 						لغو
// // 					</Button>
// // 					<Button
// // 						variant="contained"
// // 						color="secondary"
// // 						disabled={_.isEmpty(dirtyFields) || !isValid || updateLoading}
// // 						type="submit"
// // 						size="large"
// // 						fullWidth
// // 					>
// // 						{updateLoading ? 'در حال ذخیره...' : 'ذخیره'}
// // 					</Button>
// // 				</div>
// // 			</form>
// // 		</div>
// // 	);
// // }
// //
// // export default HomePageTab;
// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
// import { zodResolver } from '@hookform/resolvers/zod';
// import _ from '@lodash';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import InputAdornment from '@mui/material/InputAdornment';
// import Switch from '@mui/material/Switch';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import { useEffect } from 'react';
// import { Controller, useForm, useFieldArray } from 'react-hook-form';
// import { AiOutlineBgColors } from 'react-icons/ai';
// import { BsTextLeft } from 'react-icons/bs';
// import { LuHeading1 } from 'react-icons/lu';
// import { MdAddLink, MdDriveFileRenameOutline, MdDelete } from 'react-icons/md';
// import { z } from 'zod';
// import { useGetConfigQuery, useUpdateConfigMutation, useGetSchemasQuery } from '../api/websiteConfigApi';
// import FuseLoading from '@fuse/core/FuseLoading';
//
// const schema = z.object({
// 	slider: z.object({
// 		slides: z.array(z.object({
// 			title: z.string().min(1, 'عنوان الزامی می‌باشد'),
// 			description: z.string().min(1, 'توضیحات الزامی می‌باشد'),
// 			backgroundColor: z.string().min(1, 'رنگ پس زمینه الزامی می‌باشد'),
// 			hasButton: z.boolean(),
// 			buttonText: z.string().optional(),
// 			buttonLink: z.string().optional(),
// 			imageUrl: z.string().optional(),
// 			order: z.number().min(0, 'ترتیب باید عدد مثبت باشد')
// 		}))
// 	})
// });
//
// function HomePageTab() {
// 	const { data: configResponse, isLoading: configLoading, error: configError } = useGetConfigQuery('WEBSITE_HOME_PAGE_CONFIG');
// 	const { data: schemasResponse, isLoading: schemasLoading } = useGetSchemasQuery();
// 	const [updateConfig, { isLoading: updateLoading }] = useUpdateConfigMutation();
//
// 	const { control, handleSubmit, formState, reset, watch } = useForm({
// 		defaultValues: {
// 			slider: {
// 				slides: []
// 			}
// 		},
// 		mode: 'all',
// 		resolver: zodResolver(schema)
// 	});
//
// 	const { fields, append, remove } = useFieldArray({
// 		control,
// 		name: 'slider.slides'
// 	});
//
// 	const { isValid, dirtyFields, errors } = formState;
//
// 	useEffect(() => {
// 		// Extract the actual config data from the API response structure
// 		const configData = configResponse?.data;
//
// 		if (configData) {
// 			// Check if slider exists in the data
// 			const sliderData = configData.slider || { slides: [] };
//
// 			// Ensure slides is always an array
// 			const normalizedSlider = {
// 				slides: Array.isArray(sliderData.slides) ? sliderData.slides : []
// 			};
//
// 			reset({ slider: normalizedSlider });
// 		}
// 	}, [configResponse, reset]);
//
// 	const onSubmit = async (formData) => {
// 		try {
// 			// Extract schemas array from response
// 			const schemas = schemasResponse?.data || [];
//
// 			// Find the correct schema
// 			const homePageSchema = schemas.find(s => s.name === 'WEBSITE_HOME_PAGE_CONFIG_SCHEMA');
//
// 			if (!homePageSchema) {
// 				console.error('Home page schema not found');
// 				return;
// 			}
//
// 			await updateConfig({
// 				section: 'WEBSITE_HOME_PAGE_CONFIG',
// 				configData: {
// 					schemaId: homePageSchema.id,
// 					configData: formData
// 				}
// 			}).unwrap();
// 		} catch (error) {
// 			console.error('Error updating home page config:', error);
// 		}
// 	};
//
// 	const addSlide = () => {
// 		append({
// 			title: '',
// 			description: '',
// 			backgroundColor: '#ffffff',
// 			hasButton: false,
// 			buttonText: '',
// 			buttonLink: '',
// 			imageUrl: '',
// 			order: fields.length
// 		});
// 	};
//
// 	if (configLoading || schemasLoading) {
// 		return <FuseLoading />;
// 	}
//
// 	if (configError) {
// 		return <Typography color="error">خطا در بارگذاری تنظیمات صفحه اول</Typography>;
// 	}
//
// 	const configData = configResponse?.data;
//
// 	return (
// 		<div className="w-full max-w-3xl">
// 			<form onSubmit={handleSubmit(onSubmit)}>
// 				<div className="w-full">
// 					<Typography className="text-xl">تنظیمات صفحه اول</Typography>
// 					<Typography color="text.secondary" className="font-300">
// 						تنظیمات اسلایدر و محتوای صفحه اول سایت را انجام دهید.
// 					</Typography>
// 				</div>
//
// 				<div className="mt-32 w-full space-y-24">
// 					<div className="flex items-center justify-between">
// 						<Typography className="text-lg">اسلایدرها</Typography>
// 						<Button
// 							variant="contained"
// 							color="primary"
// 							onClick={addSlide}
// 							startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
// 						>
// 							افزودن اسلاید
// 						</Button>
// 					</div>
//
// 					{fields.map((field, index) => (
// 						<div key={field.id} className="border rounded-lg p-24 space-y-24">
// 							<div className="flex items-center justify-between">
// 								<Typography className="text-base font-medium">اسلاید {index + 1}</Typography>
// 								<IconButton
// 									color="error"
// 									onClick={() => remove(index)}
// 									size="small"
// 								>
// 									<MdDelete />
// 								</IconButton>
// 							</div>
//
// 							<div className="grid gap-24 sm:grid-cols-2">
// 								<Controller
// 									control={control}
// 									name={`slider.slides.${index}.title`}
// 									render={({ field }) => (
// 										<TextField
// 											{...field}
// 											label="عنوان اسلاید"
// 											placeholder="عنوان اسلاید را بنویسید"
// 											error={!!errors?.slider?.slides?.[index]?.title}
// 											helperText={errors?.slider?.slides?.[index]?.title?.message}
// 											variant="outlined"
// 											required
// 											fullWidth
// 											InputProps={{
// 												startAdornment: (
// 													<InputAdornment position="start">
// 														<LuHeading1 size={20} />
// 													</InputAdornment>
// 												)
// 											}}
// 										/>
// 									)}
// 								/>
//
// 								<Controller
// 									control={control}
// 									name={`slider.slides.${index}.order`}
// 									render={({ field }) => (
// 										<TextField
// 											{...field}
// 											type="number"
// 											label="ترتیب"
// 											placeholder="ترتیب نمایش"
// 											error={!!errors?.slider?.slides?.[index]?.order}
// 											helperText={errors?.slider?.slides?.[index]?.order?.message}
// 											variant="outlined"
// 											required
// 											fullWidth
// 											onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
// 										/>
// 									)}
// 								/>
//
// 								<div className="sm:col-span-2">
// 									<Controller
// 										control={control}
// 										name={`slider.slides.${index}.description`}
// 										render={({ field }) => (
// 											<TextField
// 												{...field}
// 												label="توضیحات"
// 												placeholder="توضیحات اسلاید را بنویسید"
// 												error={!!errors?.slider?.slides?.[index]?.description}
// 												helperText={errors?.slider?.slides?.[index]?.description?.message}
// 												variant="outlined"
// 												required
// 												multiline
// 												minRows={3}
// 												fullWidth
// 												InputProps={{
// 													className: 'max-h-min h-min items-start',
// 													startAdornment: (
// 														<InputAdornment position="start" className="mt-16">
// 															<BsTextLeft size={20} />
// 														</InputAdornment>
// 													)
// 												}}
// 											/>
// 										)}
// 									/>
// 								</div>
//
// 								<Controller
// 									control={control}
// 									name={`slider.slides.${index}.backgroundColor`}
// 									render={({ field }) => (
// 										<div className="relative">
// 											<input
// 												className="absolute z-10 border-0 left-0 top-0 translate-x-1/2 translate-y-1/3 w-32 h-32 rounded-xl cursor-pointer"
// 												type="color"
// 												value={field.value || '#ffffff'}
// 												onChange={(e) => field.onChange(e.target.value)}
// 											/>
// 											<TextField
// 												value={field.value || ''}
// 												onChange={(e) => field.onChange(e.target.value)}
// 												label="رنگ پس زمینه"
// 												placeholder="رنگ پس زمینه اسلاید"
// 												error={!!errors?.slider?.slides?.[index]?.backgroundColor}
// 												helperText={errors?.slider?.slides?.[index]?.backgroundColor?.message}
// 												variant="outlined"
// 												fullWidth
// 												InputProps={{
// 													startAdornment: (
// 														<InputAdornment position="start">
// 															<AiOutlineBgColors size={20} />
// 														</InputAdornment>
// 													)
// 												}}
// 											/>
// 										</div>
// 									)}
// 								/>
//
// 								<Controller
// 									control={control}
// 									name={`slider.slides.${index}.imageUrl`}
// 									render={({ field }) => (
// 										<TextField
// 											{...field}
// 											label="آدرس تصویر"
// 											placeholder="URL تصویر اسلاید"
// 											variant="outlined"
// 											fullWidth
// 										/>
// 									)}
// 								/>
//
// 								<div className="sm:col-span-2">
// 									<Controller
// 										name={`slider.slides.${index}.hasButton`}
// 										control={control}
// 										render={({ field: { onChange, value } }) => (
// 											<div className="space-y-20">
// 												<FormControlLabel
// 													classes={{ root: 'm-0', label: 'flex flex-1' }}
// 													labelPlacement="start"
// 													label="استفاده از دکمه"
// 													control={
// 														<Switch
// 															onChange={(ev) => onChange(ev.target.checked)}
// 															checked={value}
// 														/>
// 													}
// 												/>
// 												{value && (
// 													<div className="grid gap-20 sm:grid-cols-2">
// 														<Controller
// 															control={control}
// 															name={`slider.slides.${index}.buttonText`}
// 															render={({ field }) => (
// 																<TextField
// 																	{...field}
// 																	label="متن دکمه"
// 																	placeholder="متن دکمه اسلاید"
// 																	variant="outlined"
// 																	fullWidth
// 																	InputProps={{
// 																		startAdornment: (
// 																			<InputAdornment position="start">
// 																				<MdDriveFileRenameOutline size={20} />
// 																			</InputAdornment>
// 																		)
// 																	}}
// 																/>
// 															)}
// 														/>
// 														<Controller
// 															control={control}
// 															name={`slider.slides.${index}.buttonLink`}
// 															render={({ field }) => (
// 																<TextField
// 																	{...field}
// 																	label="لینک دکمه"
// 																	placeholder="لینک دکمه اسلاید"
// 																	variant="outlined"
// 																	fullWidth
// 																	InputProps={{
// 																		startAdornment: (
// 																			<InputAdornment position="start">
// 																				<MdAddLink size={20} />
// 																			</InputAdornment>
// 																		)
// 																	}}
// 																/>
// 															)}
// 														/>
// 													</div>
// 												)}
// 											</div>
// 										)}
// 									/>
// 								</div>
// 							</div>
// 						</div>
// 					))}
//
// 					{fields.length === 0 && (
// 						<div className="border-2 border-dashed border-gray-300 rounded-lg p-40 text-center">
// 							<Typography color="text.secondary">
// 								هیچ اسلایدی وجود ندارد. برای شروع روی دکمه "افزودن اسلاید" کلیک کنید.
// 							</Typography>
// 						</div>
// 					)}
// 				</div>
//
// 				<Divider className="mb-40 mt-44 border-t" />
// 				<div className="flex items-center justify-end gap-x-10 w-1/2">
// 					<Button
// 						variant="outlined"
// 						disabled={_.isEmpty(dirtyFields)}
// 						onClick={() => {
// 							const data = configData?.slider || { slides: [] };
// 							reset({
// 								slider: {
// 									slides: Array.isArray(data.slides) ? data.slides : []
// 								}
// 							});
// 						}}
// 						size="large"
// 						fullWidth
// 					>
// 						لغو
// 					</Button>
// 					<Button
// 						variant="contained"
// 						color="secondary"
// 						disabled={_.isEmpty(dirtyFields) || !isValid || updateLoading}
// 						type="submit"
// 						size="large"
// 						fullWidth
// 					>
// 						{updateLoading ? 'در حال ذخیره...' : 'ذخیره'}
// 					</Button>
// 				</div>
// 			</form>
// 		</div>
// 	);
// }
//
// export default HomePageTab;

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from '@lodash';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputAdornment from '@mui/material/InputAdornment';
import { useEffect } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { AiOutlineBgColors } from 'react-icons/ai';
import { BsTextLeft } from 'react-icons/bs';
import { LuHeading1 } from 'react-icons/lu';
import { MdAddLink, MdDelete } from 'react-icons/md';
import { HiOutlineHashtag } from 'react-icons/hi';
import { z } from 'zod';
import { useGetConfigQuery, useUpdateConfigMutation, useGetSchemasQuery } from '../api/websiteConfigApi';
import FuseLoading from '@fuse/core/FuseLoading';

const schema = z.object({
	banner: z.array(z.object({
		title: z.string().min(1, 'عنوان الزامی است'),
		slug: z.string().min(1, 'توضیحات الزامی است'),
		url: z.string().min(1, 'آدرس الزامی است')
	})),
	slider: z.array(z.object({
		title: z.string().min(1, 'عنوان الزامی است'),
		slug: z.string().min(1, 'توضیحات الزامی است'),
		url: z.string().min(1, 'آدرس تصویر الزامی است'),
		bgColor: z.string().min(1, 'رنگ پس‌زمینه الزامی است'),
		button: z.boolean(),
		type: z.number()
	})),
	logoSlider: z.array(z.object({
		brand: z.string().min(1, 'نام برند الزامی است'),
		logoImage: z.string().min(1, 'تصویر لوگو الزامی است'),
		url: z.string().min(1, 'آدرس لینک الزامی است')
	})),
	newsSlides: z.array(z.object({
		type: z.string().min(1, 'نوع الزامی است'),
		title: z.string().min(1, 'عنوان الزامی است'),
		imageUrl: z.string().min(1, 'تصویر الزامی است'),
		url: z.string().min(1, 'لینک الزامی است')
	})),
	services: z.array(z.object({
		title: z.string().min(1, 'عنوان الزامی است'),
		description: z.string().min(1, 'توضیحات الزامی است'),
		link: z.string().min(1, 'لینک الزامی است')
	})),
	ads: z.array(z.object({
		image: z.string().min(1, 'تصویر الزامی است'),
		url: z.string().min(1, 'آدرس الزامی است'),
		title: z.string().min(1, 'عنوان الزامی است'),
		content: z.string().min(1, 'محتوا الزامی است'),
		order: z.number(),
		placement: z.number()
	})),
	relatedLinks: z.array(z.object({
		url: z.string().min(1, 'آدرس الزامی است'),
		title: z.string().min(1, 'عنوان الزامی است'),
		order: z.number(),
		placement: z.number()
	})),
	statistics: z.object({
		experience: z.number(),
		activeCompanies: z.number(),
		infoBanks: z.number(),
		totalVisits: z.number(),
		content: z.string()
	}),
	footer: z.object({
		text: z.string().min(1, 'متن فوتر الزامی است'),
		logo: z.string().min(1, 'لوگو الزامی است'),
		socialMedias: z.array(z.object({
			image: z.string().min(1, 'تصویر الزامی است'),
			url: z.string().min(1, 'آدرس الزامی است'),
			alt: z.string().min(1, 'متن جایگزین الزامی است')
		})),
		sections: z.array(z.object({
			title: z.string().min(1, 'عنوان بخش الزامی است'),
			links: z.array(z.object({
				title: z.string().min(1, 'عنوان لینک الزامی است'),
				href: z.string().min(1, 'آدرس لینک الزامی است'),
				order: z.number()
			}))
		}))
	}),
	footerCard: z.object({
		title: z.string().min(1, 'عنوان الزامی است'),
		backgroundImage: z.string().optional(),
		backgroundColor: z.string().optional(),
		buttons: z.array(z.object({
			label: z.string().min(1, 'عنوان دکمه الزامی است'),
			link: z.string().min(1, 'لینک دکمه الزامی است')
		}))
	})
});

function HomePageTab() {
	const { data: configResponse, isLoading: configLoading, error: configError } = useGetConfigQuery('WEBSITE_HOME_PAGE_CONFIG');
	const { data: schemasResponse, isLoading: schemasLoading } = useGetSchemasQuery();
	const [updateConfig, { isLoading: updateLoading }] = useUpdateConfigMutation();

	const { control, handleSubmit, formState, reset, watch } = useForm({
		defaultValues: {
			banner: [],
			slider: [],
			logoSlider: [],
			newsSlides: [],
			services: [],
			ads: [],
			relatedLinks: [],
			statistics: {
				experience: 0,
				activeCompanies: 0,
				infoBanks: 0,
				totalVisits: 0,
				content: ''
			},
			footer: {
				text: '',
				logo: '',
				socialMedias: [],
				sections: []
			},
			footerCard: {
				title: '',
				backgroundImage: '',
				backgroundColor: '',
				buttons: []
			}
		},
		mode: 'all',
		resolver: zodResolver(schema)
	});

	// Field Arrays
	const { fields: bannerFields, append: appendBanner, remove: removeBanner } = useFieldArray({
		control,
		name: 'banner'
	});

	const { fields: sliderFields, append: appendSlider, remove: removeSlider } = useFieldArray({
		control,
		name: 'slider'
	});

	const { fields: logoSliderFields, append: appendLogoSlider, remove: removeLogoSlider } = useFieldArray({
		control,
		name: 'logoSlider'
	});

	const { fields: newsFields, append: appendNews, remove: removeNews } = useFieldArray({
		control,
		name: 'newsSlides'
	});

	const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
		control,
		name: 'services'
	});

	const { fields: adFields, append: appendAd, remove: removeAd } = useFieldArray({
		control,
		name: 'ads'
	});

	const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
		control,
		name: 'relatedLinks'
	});

	const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
		control,
		name: 'footer.socialMedias'
	});

	const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
		control,
		name: 'footer.sections'
	});

	const { fields: footerButtonFields, append: appendFooterButton, remove: removeFooterButton } = useFieldArray({
		control,
		name: 'footerCard.buttons'
	});

	const { isValid, dirtyFields, errors } = formState;

	useEffect(() => {
		const configData = configResponse?.data;

		if (configData) {
			reset({
				banner: configData.banner || [],
				slider: configData.slider || [],
				logoSlider: configData.logoSlider || [],
				newsSlides: configData.newsSlides || [],
				services: configData.services || [],
				ads: configData.ads || [],
				relatedLinks: configData.relatedLinks || [],
				statistics: configData.statistics || {
					experience: 0,
					activeCompanies: 0,
					infoBanks: 0,
					totalVisits: 0,
					content: ''
				},
				footer: configData.footer || {
					text: '',
					logo: '',
					socialMedias: [],
					sections: []
				},
				footerCard: configData.footerCard || {
					title: '',
					backgroundImage: '',
					backgroundColor: '',
					buttons: []
				}
			});
		}
	}, [configResponse, reset]);

	const onSubmit = async (formData) => {
		try {
			const schemas = schemasResponse?.data || [];
			const homePageSchema = schemas.find(s => s.name === 'WEBSITE_HOME_PAGE_CONFIG_SCHEMA');

			if (!homePageSchema) {
				console.error('Home page schema not found');
				return;
			}

			await updateConfig({
				section: 'WEBSITE_HOME_PAGE_CONFIG',
				configData: {
					schemaId: homePageSchema.id,
					configData: formData
				}
			}).unwrap();
		} catch (error) {
			console.error('Error updating home page config:', error);
		}
	};

	if (configLoading || schemasLoading) {
		return <FuseLoading />;
	}

	if (configError) {
		return <Typography color="error">خطا در بارگذاری تنظیمات صفحه اول</Typography>;
	}

	const configData = configResponse?.data;

	return (
		<div className="w-full max-w-5xl">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="w-full">
					<Typography className="text-xl">تنظیمات صفحه اول</Typography>
					<Typography color="text.secondary" className="font-300">
						تنظیمات کامل صفحه اول سایت را انجام دهید.
					</Typography>
				</div>

				<div className="mt-32 w-full space-y-24">

					{/* Banner Section */}
					<Accordion defaultExpanded>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className="text-lg font-medium">بنرها</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<div className="space-y-24">
								<Button
									variant="outlined"
									color="primary"
									onClick={() => appendBanner({ title: '', slug: '', url: '' })}
									startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
									size="small"
								>
									افزودن بنر
								</Button>

								{bannerFields.map((field, index) => (
									<div key={field.id} className="border rounded-lg p-20 space-y-20">
										<div className="flex items-center justify-between">
											<Typography className="text-sm font-medium">بنر {index + 1}</Typography>
											<IconButton color="error" onClick={() => removeBanner(index)} size="small">
												<MdDelete />
											</IconButton>
										</div>

										<div className="grid gap-20 sm:grid-cols-2">
											<Controller
												control={control}
												name={`banner.${index}.title`}
												render={({ field }) => (
													<TextField
														{...field}
														label="عنوان"
														variant="outlined"
														size="small"
														fullWidth
														error={!!errors?.banner?.[index]?.title}
														helperText={errors?.banner?.[index]?.title?.message}
													/>
												)}
											/>
											<Controller
												control={control}
												name={`banner.${index}.url`}
												render={({ field }) => (
													<TextField
														{...field}
														label="لینک"
														variant="outlined"
														size="small"
														fullWidth
														error={!!errors?.banner?.[index]?.url}
														helperText={errors?.banner?.[index]?.url?.message}
													/>
												)}
											/>
											<div className="sm:col-span-2">
												<Controller
													control={control}
													name={`banner.${index}.slug`}
													render={({ field }) => (
														<TextField
															{...field}
															label="توضیحات"
															variant="outlined"
															size="small"
															multiline
															minRows={2}
															fullWidth
															error={!!errors?.banner?.[index]?.slug}
															helperText={errors?.banner?.[index]?.slug?.message}
														/>
													)}
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</AccordionDetails>
					</Accordion>

					{/* Slider Section */}
					<Accordion>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className="text-lg font-medium">اسلایدر</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<div className="space-y-24">
								<Button
									variant="outlined"
									color="primary"
									onClick={() => appendSlider({
										title: '',
										slug: '',
										url: '',
										bgColor: '#ffffff',
										button: false,
										type: 1
									})}
									startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
									size="small"
								>
									افزودن اسلاید
								</Button>

								{sliderFields.map((field, index) => (
									<div key={field.id} className="border rounded-lg p-20 space-y-20">
										<div className="flex items-center justify-between">
											<Typography className="text-sm font-medium">اسلاید {index + 1}</Typography>
											<IconButton color="error" onClick={() => removeSlider(index)} size="small">
												<MdDelete />
											</IconButton>
										</div>

										<div className="grid gap-20 sm:grid-cols-2">
											<Controller
												control={control}
												name={`slider.${index}.title`}
												render={({ field }) => (
													<TextField
														{...field}
														label="عنوان"
														variant="outlined"
														size="small"
														fullWidth
														error={!!errors?.slider?.[index]?.title}
														helperText={errors?.slider?.[index]?.title?.message}
													/>
												)}
											/>
											<Controller
												control={control}
												name={`slider.${index}.url`}
												render={({ field }) => (
													<TextField
														{...field}
														label="آدرس تصویر"
														variant="outlined"
														size="small"
														fullWidth
														error={!!errors?.slider?.[index]?.url}
														helperText={errors?.slider?.[index]?.url?.message}
													/>
												)}
											/>
											<Controller
												control={control}
												name={`slider.${index}.bgColor`}
												render={({ field }) => (
													<div className="relative">
														<input
															className="absolute z-10 border-0 left-0 top-0 translate-x-1/2 translate-y-1/3 w-24 h-24 rounded cursor-pointer"
															type="color"
															value={field.value || '#ffffff'}
															onChange={(e) => field.onChange(e.target.value)}
														/>
														<TextField
															{...field}
															label="رنگ پس‌زمینه"
															variant="outlined"
															size="small"
															fullWidth
															error={!!errors?.slider?.[index]?.bgColor}
															helperText={errors?.slider?.[index]?.bgColor?.message}
														/>
													</div>
												)}
											/>
											<Controller
												control={control}
												name={`slider.${index}.type`}
												render={({ field }) => (
													<TextField
														{...field}
														type="number"
														label="نوع"
														variant="outlined"
														size="small"
														fullWidth
														onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
													/>
												)}
											/>
											<div className="sm:col-span-2">
												<Controller
													control={control}
													name={`slider.${index}.slug`}
													render={({ field }) => (
														<TextField
															{...field}
															label="توضیحات"
															variant="outlined"
															size="small"
															multiline
															minRows={2}
															fullWidth
															error={!!errors?.slider?.[index]?.slug}
															helperText={errors?.slider?.[index]?.slug?.message}
														/>
													)}
												/>
											</div>
											<div className="sm:col-span-2">
												<Controller
													name={`slider.${index}.button`}
													control={control}
													render={({ field: { onChange, value } }) => (
														<FormControlLabel
															classes={{ root: 'm-0' }}
															label="نمایش دکمه"
															control={
																<Switch
																	onChange={(ev) => onChange(ev.target.checked)}
																	checked={value}
																/>
															}
														/>
													)}
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</AccordionDetails>
					</Accordion>

					{/* Logo Slider Section */}
					<Accordion>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className="text-lg font-medium">اسلایدر لوگو</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<div className="space-y-24">
								<Button
									variant="outlined"
									color="primary"
									onClick={() => appendLogoSlider({ brand: '', logoImage: '', url: '' })}
									startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
									size="small"
								>
									افزودن لوگو
								</Button>

								{logoSliderFields.map((field, index) => (
									<div key={field.id} className="border rounded-lg p-20 space-y-20">
										<div className="flex items-center justify-between">
											<Typography className="text-sm font-medium">لوگو {index + 1}</Typography>
											<IconButton color="error" onClick={() => removeLogoSlider(index)} size="small">
												<MdDelete />
											</IconButton>
										</div>

										<div className="grid gap-20 sm:grid-cols-3">
											<Controller
												control={control}
												name={`logoSlider.${index}.brand`}
												render={({ field }) => (
													<TextField
														{...field}
														label="نام برند"
														variant="outlined"
														size="small"
														fullWidth
														error={!!errors?.logoSlider?.[index]?.brand}
														helperText={errors?.logoSlider?.[index]?.brand?.message}
													/>
												)}
											/>
											<Controller
												control={control}
												name={`logoSlider.${index}.logoImage`}
												render={({ field }) => (
													<TextField
														{...field}
														label="آدرس لوگو"
														variant="outlined"
														size="small"
														fullWidth
														error={!!errors?.logoSlider?.[index]?.logoImage}
														helperText={errors?.logoSlider?.[index]?.logoImage?.message}
													/>
												)}
											/>
											<Controller
												control={control}
												name={`logoSlider.${index}.url`}
												render={({ field }) => (
													<TextField
														{...field}
														label="لینک"
														variant="outlined"
														size="small"
														fullWidth
														error={!!errors?.logoSlider?.[index]?.url}
														helperText={errors?.logoSlider?.[index]?.url?.message}
													/>
												)}
											/>
										</div>
									</div>
								))}
							</div>
						</AccordionDetails>
					</Accordion>

					{/* Services Section */}
					<Accordion>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className="text-lg font-medium">خدمات</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<div className="space-y-24">
								<Button
									variant="outlined"
									color="primary"
									onClick={() => appendService({ title: '', description: '', link: '' })}
									startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
									size="small"
								>
									افزودن خدمت
								</Button>

								{serviceFields.map((field, index) => (
									<div key={field.id} className="border rounded-lg p-20 space-y-20">
										<div className="flex items-center justify-between">
											<Typography className="text-sm font-medium">خدمت {index + 1}</Typography>
											<IconButton color="error" onClick={() => removeService(index)} size="small">
												<MdDelete />
											</IconButton>
										</div>

										<div className="grid gap-20 sm:grid-cols-2">
											<Controller
												control={control}
												name={`services.${index}.title`}
												render={({ field }) => (
													<TextField
														{...field}
														label="عنوان"
														variant="outlined"
														size="small"
														fullWidth
														error={!!errors?.services?.[index]?.title}
														helperText={errors?.services?.[index]?.title?.message}
													/>
												)}
											/>
											<Controller
												control={control}
												name={`services.${index}.link`}
												render={({ field }) => (
													<TextField
														{...field}
														label="لینک"
														variant="outlined"
														size="small"
														fullWidth
														error={!!errors?.services?.[index]?.link}
														helperText={errors?.services?.[index]?.link?.message}
													/>
												)}
											/>
											<div className="sm:col-span-2">
												<Controller
													control={control}
													name={`services.${index}.description`}
													render={({ field }) => (
														<TextField
															{...field}
															label="توضیحات"
															variant="outlined"
															size="small"
															multiline
															minRows={3}
															fullWidth
															error={!!errors?.services?.[index]?.description}
															helperText={errors?.services?.[index]?.description?.message}
														/>
													)}
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</AccordionDetails>
					</Accordion>

					{/* Statistics Section */}
					<Accordion>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className="text-lg font-medium">آمار</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<div className="grid gap-20 sm:grid-cols-2">
								<Controller
									control={control}
									name="statistics.experience"
									render={({ field }) => (
										<TextField
											{...field}
											type="number"
											label="سال تجربه"
											variant="outlined"
											size="small"
											fullWidth
											onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
											error={!!errors?.statistics?.experience}
											helperText={errors?.statistics?.experience?.message}
										/>
									)}
								/>
								<Controller
									control={control}
									name="statistics.activeCompanies"
									render={({ field }) => (
										<TextField
											{...field}
											type="number"
											label="شرکت‌های فعال"
											variant="outlined"
											size="small"
											fullWidth
											onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
											error={!!errors?.statistics?.activeCompanies}
											helperText={errors?.statistics?.activeCompanies?.message}
										/>
									)}
								/>
								<Controller
									control={control}
									name="statistics.infoBanks"
									render={({ field }) => (
										<TextField
											{...field}
											type="number"
											label="بانک‌های اطلاعاتی"
											variant="outlined"
											size="small"
											fullWidth
											onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
											error={!!errors?.statistics?.infoBanks}
											helperText={errors?.statistics?.infoBanks?.message}
										/>
									)}
								/>
								<Controller
									control={control}
									name="statistics.totalVisits"
									render={({ field }) => (
										<TextField
											{...field}
											type="number"
											label="کل بازدیدها"
											variant="outlined"
											size="small"
											fullWidth
											onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
											error={!!errors?.statistics?.totalVisits}
											helperText={errors?.statistics?.totalVisits?.message}
										/>
									)}
								/>
								<div className="sm:col-span-2">
									<Controller
										control={control}
										name="statistics.content"
										render={({ field }) => (
											<TextField
												{...field}
												label="محتوای آمار"
												variant="outlined"
												size="small"
												multiline
												minRows={2}
												fullWidth
												error={!!errors?.statistics?.content}
												helperText={errors?.statistics?.content?.message}
											/>
										)}
									/>
								</div>
							</div>
						</AccordionDetails>
					</Accordion>

					{/* Footer Section */}
					<Accordion>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className="text-lg font-medium">فوتر</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<div className="space-y-24">
								<div className="grid gap-20 sm:grid-cols-2">
									<Controller
										control={control}
										name="footer.logo"
										render={({ field }) => (
											<TextField
												{...field}
												label="آدرس لوگو"
												variant="outlined"
												size="small"
												fullWidth
												error={!!errors?.footer?.logo}
												helperText={errors?.footer?.logo?.message}
											/>
										)}
									/>
									<div className="sm:col-span-2">
										<Controller
											control={control}
											name="footer.text"
											render={({ field }) => (
												<TextField
													{...field}
													label="متن فوتر"
													variant="outlined"
													size="small"
													multiline
													minRows={2}
													fullWidth
													error={!!errors?.footer?.text}
													helperText={errors?.footer?.text?.message}
												/>
											)}
										/>
									</div>
								</div>

								{/* Social Media */}
								<div className="space-y-16">
									<div className="flex items-center justify-between">
										<Typography className="text-base font-medium">شبکه‌های اجتماعی</Typography>
										<Button
											variant="outlined"
											color="primary"
											onClick={() => appendSocial({ image: '', url: '', alt: '' })}
											startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
											size="small"
										>
											افزودن
										</Button>
									</div>

									{socialFields.map((field, index) => (
										<div key={field.id} className="border rounded-lg p-16 space-y-16">
											<div className="flex items-center justify-between">
												<Typography variant="caption">شبکه {index + 1}</Typography>
												<IconButton color="error" onClick={() => removeSocial(index)} size="small">
													<MdDelete />
												</IconButton>
											</div>

											<div className="grid gap-16 sm:grid-cols-3">
												<Controller
													control={control}
													name={`footer.socialMedias.${index}.image`}
													render={({ field }) => (
														<TextField
															{...field}
															label="آدرس آیکون"
															variant="outlined"
															size="small"
															fullWidth
														/>
													)}
												/>
												<Controller
													control={control}
													name={`footer.socialMedias.${index}.url`}
													render={({ field }) => (
														<TextField
															{...field}
															label="لینک"
															variant="outlined"
															size="small"
															fullWidth
														/>
													)}
												/>
												<Controller
													control={control}
													name={`footer.socialMedias.${index}.alt`}
													render={({ field }) => (
														<TextField
															{...field}
															label="متن جایگزین"
															variant="outlined"
															size="small"
															fullWidth
														/>
													)}
												/>
											</div>
										</div>
									))}
								</div>

								{/* Footer Sections */}
								<div className="space-y-16">
									<div className="flex items-center justify-between">
										<Typography className="text-base font-medium">بخش‌های فوتر</Typography>
										<Button
											variant="outlined"
											color="primary"
											onClick={() => appendSection({ title: '', links: [] })}
											startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
											size="small"
										>
											افزودن بخش
										</Button>
									</div>

									{sectionFields.map((field, index) => (
										<FooterSection
											key={field.id}
											control={control}
											index={index}
											remove={removeSection}
											errors={errors}
										/>
									))}
								</div>
							</div>
						</AccordionDetails>
					</Accordion>

					{/* Footer Card Section */}
					<Accordion>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography className="text-lg font-medium">کارت فوتر</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<div className="space-y-24">
								<div className="grid gap-20 sm:grid-cols-2">
									<Controller
										control={control}
										name="footerCard.title"
										render={({ field }) => (
											<TextField
												{...field}
												label="عنوان"
												variant="outlined"
												size="small"
												fullWidth
												error={!!errors?.footerCard?.title}
												helperText={errors?.footerCard?.title?.message}
											/>
										)}
									/>
									<Controller
										control={control}
										name="footerCard.backgroundImage"
										render={({ field }) => (
											<TextField
												{...field}
												label="تصویر پس‌زمینه"
												variant="outlined"
												size="small"
												fullWidth
											/>
										)}
									/>
									<Controller
										control={control}
										name="footerCard.backgroundColor"
										render={({ field }) => (
											<div className="relative">
												<input
													className="absolute z-10 border-0 left-0 top-0 translate-x-1/2 translate-y-1/3 w-24 h-24 rounded cursor-pointer"
													type="color"
													value={field.value || '#ffffff'}
													onChange={(e) => field.onChange(e.target.value)}
												/>
												<TextField
													{...field}
													label="رنگ پس‌زمینه"
													variant="outlined"
													size="small"
													fullWidth
												/>
											</div>
										)}
									/>
								</div>

								{/* Footer Card Buttons */}
								<div className="space-y-16">
									<div className="flex items-center justify-between">
										<Typography className="text-base font-medium">دکمه‌ها</Typography>
										<Button
											variant="outlined"
											color="primary"
											onClick={() => appendFooterButton({ label: '', link: '' })}
											startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
											size="small"
										>
											افزودن دکمه
										</Button>
									</div>

									{footerButtonFields.map((field, index) => (
										<div key={field.id} className="border rounded-lg p-16 space-y-16">
											<div className="flex items-center justify-between">
												<Typography variant="caption">دکمه {index + 1}</Typography>
												<IconButton color="error" onClick={() => removeFooterButton(index)} size="small">
													<MdDelete />
												</IconButton>
											</div>

											<div className="grid gap-16 sm:grid-cols-2">
												<Controller
													control={control}
													name={`footerCard.buttons.${index}.label`}
													render={({ field }) => (
														<TextField
															{...field}
															label="عنوان دکمه"
															variant="outlined"
															size="small"
															fullWidth
														/>
													)}
												/>
												<Controller
													control={control}
													name={`footerCard.buttons.${index}.link`}
													render={({ field }) => (
														<TextField
															{...field}
															label="لینک"
															variant="outlined"
															size="small"
															fullWidth
														/>
													)}
												/>
											</div>
										</div>
									))}
								</div>
							</div>
						</AccordionDetails>
					</Accordion>
				</div>

				<Divider className="mb-40 mt-44 border-t" />
				<div className="flex items-center justify-end gap-x-10 w-1/2">
					<Button
						variant="outlined"
						disabled={_.isEmpty(dirtyFields)}
						onClick={() => {
							if (configData) {
								reset({
									banner: configData.banner || [],
									slider: configData.slider || [],
									logoSlider: configData.logoSlider || [],
									newsSlides: configData.newsSlides || [],
									services: configData.services || [],
									ads: configData.ads || [],
									relatedLinks: configData.relatedLinks || [],
									statistics: configData.statistics || {
										experience: 0,
										activeCompanies: 0,
										infoBanks: 0,
										totalVisits: 0,
										content: ''
									},
									footer: configData.footer || {
										text: '',
										logo: '',
										socialMedias: [],
										sections: []
									},
									footerCard: configData.footerCard || {
										title: '',
										backgroundImage: '',
										backgroundColor: '',
										buttons: []
									}
								});
							}
						}}
						size="large"
						fullWidth
					>
						لغو
					</Button>
					<Button
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid || updateLoading}
						type="submit"
						size="large"
						fullWidth
					>
						{updateLoading ? 'در حال ذخیره...' : 'ذخیره'}
					</Button>
				</div>
			</form>
		</div>
	);
}

// Footer Section Component
function FooterSection({ control, index, remove, errors }) {
	const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
		control,
		name: `footer.sections.${index}.links`
	});

	return (
		<div className="border rounded-lg p-16 space-y-16">
			<div className="flex items-center justify-between">
				<Typography variant="caption" className="font-medium">بخش {index + 1}</Typography>
				<IconButton color="error" onClick={() => remove(index)} size="small">
					<MdDelete />
				</IconButton>
			</div>

			<Controller
				control={control}
				name={`footer.sections.${index}.title`}
				render={({ field }) => (
					<TextField
						{...field}
						label="عنوان بخش"
						variant="outlined"
						size="small"
						fullWidth
						error={!!errors?.footer?.sections?.[index]?.title}
						helperText={errors?.footer?.sections?.[index]?.title?.message}
					/>
				)}
			/>

			<div className="space-y-12">
				<div className="flex items-center justify-between">
					<Typography variant="caption">لینک‌ها</Typography>
					<Button
						variant="text"
						color="primary"
						onClick={() => appendLink({ title: '', href: '', order: linkFields.length + 1 })}
						size="small"
					>
						افزودن لینک
					</Button>
				</div>

				{linkFields.map((field, linkIndex) => (
					<div key={field.id} className="flex gap-8 items-center">
						<Controller
							control={control}
							name={`footer.sections.${index}.links.${linkIndex}.title`}
							render={({ field }) => (
								<TextField
									{...field}
									label="عنوان"
									variant="outlined"
									size="small"
									fullWidth
								/>
							)}
						/>
						<Controller
							control={control}
							name={`footer.sections.${index}.links.${linkIndex}.href`}
							render={({ field }) => (
								<TextField
									{...field}
									label="لینک"
									variant="outlined"
									size="small"
									fullWidth
								/>
							)}
						/>
						<Controller
							control={control}
							name={`footer.sections.${index}.links.${linkIndex}.order`}
							render={({ field }) => (
								<TextField
									{...field}
									type="number"
									label="ترتیب"
									variant="outlined"
									size="small"
									style={{ width: 100 }}
									onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
								/>
							)}
						/>
						<IconButton color="error" onClick={() => removeLink(linkIndex)} size="small">
							<MdDelete size={16} />
						</IconButton>
					</div>
				))}
			</div>
		</div>
	);
}

export default HomePageTab;