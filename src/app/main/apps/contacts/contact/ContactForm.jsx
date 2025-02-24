import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import FuseLoading from "@fuse/core/FuseLoading";
import _ from "@lodash";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/system/Box";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import history from "@history";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useAppDispatch } from "app/store/hooks";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ContactEmailSelector from "./email-selector/ContactEmailSelector";
import PhoneNumberSelector from "./phone-number-selector/PhoneNumberSelector";
import {
	useCreateContactsItemMutation,
	useDeleteContactsItemMutation,
	useGetContactsItemQuery,
	useGetContactsTagsQuery,
	useUpdateContactsItemMutation,
	useGetContactsAccessibilityQuery,
} from "../ContactsApi";
import ContactModel from "../models/ContactModel";

function BirtdayIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

/**
 * Form Validation Schema
 */
// Zod schema for ContactEmail
const ContactEmailSchema = z.object({
	email: z.string().optional(),
});
// Zod schema for ContactPhoneNumber
const ContactPhoneNumberSchema = z.object({
	number: z.string().optional(),
});
const schema = z
	.object({
		avatar: z.string().optional(),
		background: z.string().optional(),
		name: z.string().min(1, { message: "نام کاربر الزامیست." }),
		lastname: z.string().min(1, { message: "نام خانوادگی کاربر الزامیست." }),
		password: z
			.string()
			.min(8, { message: "کلمه عبور باید حداقل ۸ کاراکتر باشد." }),
		passwordConfirm: z
			.string()
			.min(1, { message: "تکرار کلمه عبور الزامیست." }),
		emails: z.array(ContactEmailSchema).optional(),
		phoneNumbers: z.array(ContactPhoneNumberSchema).optional(),
		title: z.string().optional(),
		position: z.string().optional(),
		company: z.string().optional(),
		birthday: z.string().optional(),
		address: z.string().optional(),
		notes: z.string().optional(),
		availability: z.array(z.string()).optional(),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "کلمه عبور و تکرار آن مطابقت ندارند.",
		path: ["passwordConfirm"],
	});

function ContactForm() {
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const routeParams = useParams();
	const { id: contactId } = routeParams;
	const { data: contact, isError } = useGetContactsItemQuery(contactId, {
		skip: !contactId,
	});
	const [createContact] = useCreateContactsItemMutation();
	const [updateContact] = useUpdateContactsItemMutation();
	const [deleteContact] = useDeleteContactsItemMutation();
	const { data: accessibility } = useGetContactsAccessibilityQuery();
	// const { data: accessibility } = useGetContactsTagsQuery();
	const { control, watch, reset, handleSubmit, formState } = useForm({
		mode: "all",
		resolver: zodResolver(schema),
	});
	const { isValid, dirtyFields, errors } = formState;
	const form = watch();
	useEffect(() => {
		if (contactId === "new") {
			reset(ContactModel({}));
		} else {
			reset({ ...contact });
		}
	}, [contact, reset, routeParams]);
	/**
	 * Form Submit
	 */
	const onSubmit = useCallback(() => {
		if (contactId === "new") {
			createContact({ contact: form })
				.unwrap()
				.then((action) => {
					navigate(`/apps/contacts/${action.id}`);
				});
		} else {
			updateContact({ id: contact.id, ...form });
		}
	}, [form]);

	function handleRemoveContact() {
		if (!contact) {
			return;
		}

		deleteContact(contact.id).then(() => {
			navigate("/apps/contacts");
		});
	}

	const background = watch("background");
	const name = watch("name");

	if (isError && contactId !== "new") {
		setTimeout(() => {
			navigate("/apps/contacts");
			dispatch(showMessage({ message: "NOT FOUND" }));
		}, 0);
		return null;
	}

	if (_.isEmpty(form)) {
		return <FuseLoading className="min-h-screen" />;
	}

	return (
		<>
			<div className="flex flex-auto">
				<Box
					className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
					sx={{
						backgroundColor: "background.default",
					}}
				>
					<div className="absolute inset-0 bg-grey-400 bg-opacity-50 z-10" />

					{background && (
						<img
							className="absolute inset-0 object-cover w-full h-full shadow-8"
							src={background}
							alt="user background"
						/>
					)}
				</Box>
			</div>

			<div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
				<div className="w-full">
					<div className="flex flex-auto items-end -mt-64">
						<Controller
							control={control}
							name="avatar"
							render={({ field: { onChange, value } }) => (
								<Box
									sx={{
										borderWidth: 4,
										borderStyle: "solid",
										borderColor: "background.paper",
									}}
									className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
								>
									<div className="absolute inset-0 bg-black bg-opacity-80 z-10" />
									<div className="absolute inset-0 flex items-center justify-center z-20">
										<div>
											<label
												htmlFor="button-avatar"
												className="flex p-8 cursor-pointer"
											>
												<input
													accept="image/*"
													className="hidden"
													id="button-avatar"
													type="file"
													onChange={async (e) => {
														function readFileAsync() {
															return new Promise((resolve, reject) => {
																const file = e?.target?.files?.[0];

																if (!file) {
																	return;
																}

																const reader = new FileReader();
																reader.onload = () => {
																	if (typeof reader.result === "string") {
																		resolve(
																			`data:${file.type};base64,${btoa(reader.result)}`
																		);
																	} else {
																		reject(
																			new Error(
																				"File reading did not result in a string."
																			)
																		);
																	}
																};
																reader.onerror = reject;
																reader.readAsBinaryString(file);
															});
														}

														const newImage = await readFileAsync();
														onChange(newImage);
													}}
												/>
												<FuseSvgIcon className="text-white">
													heroicons-outline:camera
												</FuseSvgIcon>
											</label>
										</div>
										<div>
											<IconButton
												onClick={() => {
													onChange("");
												}}
											>
												<FuseSvgIcon className="text-white">
													heroicons-solid:trash
												</FuseSvgIcon>
											</IconButton>
										</div>
									</div>
									<Avatar
										sx={{
											backgroundColor: "background.default",
											color: "text.secondary",
										}}
										className="object-cover w-full h-full text-64 font-bold"
										src={value}
										alt={name}
									>
										{name?.charAt(0)}
									</Avatar>
								</Box>
							)}
						/>
					</div>
				</div>
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="نام"
							placeholder="نام کاربر را بنویسید"
							id="name"
							error={!!errors.name}
							helperText={errors?.name?.message}
							variant="outlined"
							required
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>
											heroicons-solid:user-circle
										</FuseSvgIcon>
									</InputAdornment>
								),
							}}
						/>
					)}
				/>
				<Controller
					control={control}
					name="lastname"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="نام خانوادگی"
							placeholder="نام خانوادگی کاربر را بنویسید"
							id="lastname"
							error={!!errors.lastname}
							helperText={errors?.lastname?.message}
							variant="outlined"
							required
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>
											heroicons-solid:user-circle
										</FuseSvgIcon>
									</InputAdornment>
								),
							}}
						/>
					)}
				/>
				<div className="flex flex-col sm:flex-row justify-center items-center w-full gap-x-10">
					<Controller
						control={control}
						name="password"
						render={({ field }) => (
							<TextField
								className="mt-32"
								{...field}
								label="کلمه عبور"
								placeholder="کلمه عبور کاربر را بنویسید"
								id="password"
								error={!!errors.password}
								helperText={errors?.password?.message}
								variant="outlined"
								type={showPassword ? "text" : "password"}
								required
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<IconButton
												aria-label={
													showPassword
														? "hide the password"
														: "display the password"
												}
												onClick={handleClickShowPassword}
												edge="end"
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						)}
					/>
					<Controller
						control={control}
						name="passwordConfirm"
						render={({ field }) => (
							<TextField
								className="mt-32"
								{...field}
								label="تکرار کلمه عبور"
								placeholder="کلمه عبور کاربر را بنویسید"
								id="passwordConfirm"
								error={!!errors.passwordConfirm}
								helperText={errors?.passwordConfirm?.message}
								variant="outlined"
								type={showPassword ? "text" : "password"}
								required
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<IconButton
												aria-label={
													showPassword
														? "hide the password"
														: "display the password"
												}
												onClick={handleClickShowPassword}
												edge="end"
											>
												{showPassword ? <VisibilityOff /> : <Visibility />}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						)}
					/>
				</div>
				<Controller
					control={control}
					name="accessibility"
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							multiple
							id="accessibility"
							className="mt-32"
							options={accessibility || []}
							disableCloseOnSelect
							getOptionLabel={(option) => option?.title}
							renderOption={(_props, option, { selected }) => (
								<li {..._props}>
									<Checkbox style={{ marginRight: 8 }} checked={selected} />
									{option?.title}
								</li>
							)}
							value={
								value ? value?.map((id) => _.find(accessibility, { id })) : []
							}
							onChange={(_event, newValue) => {
								onChange(newValue?.map((item) => item?.id));
							}}
							fullWidth
							renderInput={(params) => (
								<TextField
									{...params}
									label="دسترسی‌ها"
									placeholder="دسترسی‌ها"
								/>
							)}
						/>
					)}
				/>

				<Controller
					control={control}
					name="position"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="سمت"
							placeholder="سمت کاربر را بنویسید"
							id="position"
							error={!!errors.position}
							helperText={errors?.position?.message}
							variant="outlined"
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>
											heroicons-solid:briefcase
										</FuseSvgIcon>
									</InputAdornment>
								),
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name="company"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Company"
							placeholder="Company"
							id="company"
							error={!!errors.company}
							helperText={errors?.company?.message}
							variant="outlined"
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>
											heroicons-solid:office-building
										</FuseSvgIcon>
									</InputAdornment>
								),
							}}
						/>
					)}
				/>
				<Controller
					control={control}
					name="emails"
					render={({ field }) => (
						<ContactEmailSelector
							className="mt-32"
							{...field}
							value={field?.value}
							onChange={(val) => field.onChange(val)}
						/>
					)}
				/>

				<Controller
					control={control}
					name="phoneNumbers"
					render={({ field }) => (
						<PhoneNumberSelector
							className="mt-32"
							{...field}
							error={!!errors.phoneNumbers}
							helperText={errors?.phoneNumbers?.message}
							value={field.value}
							onChange={(val) => field.onChange(val)}
						/>
					)}
				/>

				{/* <Controller
					control={control}
					name="address"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Address"
							placeholder="Address"
							id="address"
							error={!!errors.address}
							helperText={errors?.address?.message}
							variant="outlined"
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>
											heroicons-solid:location-marker
										</FuseSvgIcon>
									</InputAdornment>
								),
							}}
						/>
					)}
				/> */}
				{/* <Controller
					control={control}
					name="birthday"
					render={({ field: { value, onChange } }) => (
						<DateTimePicker
							value={new Date(value)}
							onChange={(val) => {
								onChange(val?.toISOString());
							}}
							className="mt-32 mb-16 w-full"
							slotProps={{
								textField: {
									id: "birthday",
									label: "Birthday",
									InputLabelProps: {
										shrink: true,
									},
									fullWidth: true,
									variant: "outlined",
									error: !!errors.birthday,
									helperText: errors?.birthday?.message,
								},
								actionBar: {
									actions: ["clear", "today"],
								},
							}}
							slots={{
								openPickerIcon: BirtdayIcon,
							}}
						/>
					)}
				/> */}
				<Controller
					control={control}
					name="notes"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="یادداشت‌ها"
							placeholder="اطلاعاتی در مورد کاربر بنویسید"
							id="notes"
							error={!!errors.notes}
							helperText={errors?.notes?.message}
							variant="outlined"
							fullWidth
							multiline
							minRows={5}
							maxRows={10}
							InputProps={{
								className: "max-h-min h-min items-start",
								startAdornment: (
									<InputAdornment className="mt-10" position="start">
										<FuseSvgIcon size={20}>
											heroicons-solid:menu-alt-2
										</FuseSvgIcon>
									</InputAdornment>
								),
							}}
						/>
					)}
				/>
			</div>
			<Box
				className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
				sx={{ backgroundColor: "background.default" }}
			>
				{contactId !== "new" && (
					<Button color="error" onClick={handleRemoveContact}>
						Delete
					</Button>
				)}
				<Button
					className="ml-auto"
					variant="outlined"
					onClick={() => history.back()}
				>
					لغو
				</Button>
				<Button
					className="ml-8"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSubmit(onSubmit)}
				>
					ذخیره
				</Button>
			</Box>
		</>
	);
}

export default ContactForm;
