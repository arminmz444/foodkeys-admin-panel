import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { AiFillPlusCircle } from "react-icons/ai";
import { Controller, useForm } from "react-hook-form";
import { InputAdornment, TextField, Typography } from "@mui/material";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { MdOutlineTitle } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { NumericFormat } from "react-number-format";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { CiTextAlignJustify } from "react-icons/ci";
import FormControl from "@mui/material/FormControl";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const defaultValues = {
	title: "",
	price: "",
	name: "",
	username: "",
	company: "",
	about: "",
	email: "",
	phone: "",
	country: "",
	language: "",
	description: "",
	color: "",
	isButtonRequired: "",
	buttonName: "",
	buttonLink: "",
	images: [],
};
const schema = z.object({
	name: z.string().nonempty("Name is required"),
	description: z.string().nonempty("توضیحات الزامی می‌باشد."),
	title: z.string().nonempty("عنوان الزامی می‌باشد."),
	price: z.string().nonempty("مبلغ الزامی می‌باشد."),
	color: z.string().nonempty("انتخاب رنگ پس زمینه الزامی می‌باشد."),

	username: z.string().nonempty("Username is required"),
	company: z.string().nonempty("Company is required"),
	about: z.string().nonempty("About is required"),
	email: z.string().email("Invalid email").nonempty("Email is required"),
	phone: z.string().nonempty("Phone is required"),
	country: z.string().nonempty("Country is required"),
	language: z.string().nonempty("Language is required"),
});

function AddBundle() {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
	const [value, setValue] = React.useState(null);
	const [duration, setDuration] = React.useState(null);
	const [term, setTerm] = React.useState(null);
	const { control, watch, reset, handleSubmit, formState } = useForm({
		defaultValues,
		mode: "all",
		resolver: zodResolver(schema),
	});
	const { isValid, dirtyFields, errors } = formState;

	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleChange = (event) => {
		setValue(event.target.value);
	};
	const [isActive, setActive] = React.useState("فعال");

	const handleActiveChange = (event) => {
		setActive(event.target.value);
	};
	const handleDurationChange = (event) => {
		setDuration(event.target.value);
	};
	const handleTermChange = (event) => {
		setTerm(event.target.value);
	};
	return (
		<>
			<Button
				variant="outlined"
				color="secondary"
				className="flex gap-5 place-self-end mb-28"
				onClick={handleClickOpen}
			>
				پلن جدید
				<AiFillPlusCircle size={20} />
			</Button>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-describedby="alert-dialog-slide-description"
				fullScreen={fullScreen}
			>
				<DialogTitle variant="h5" className="font-800">
					مشخصات پلن جدید
				</DialogTitle>
				<DialogContent>
					<DialogContentText
						className="w-auto max-w-4xl"
						id="alert-dialog-slide-description"
					>
						<form className="w-full">
							<div className="flex flex-col gap-20 w-512 mt-10">
								<Controller
									control={control}
									name="title"
									render={({ field }) => (
										<TextField
											{...field}
											label="عنوان"
											placeholder="عنوان پلن را بنویسید"
											id="title"
											error={!!errors.title}
											helperText={errors?.title?.message}
											variant="outlined"
											required
											fullWidth
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<MdOutlineTitle size={20} />
													</InputAdornment>
												),
											}}
										/>
									)}
								/>
								<Controller
									control={control}
									name="price"
									render={({ field }) => (
										<NumericFormat
											id="price"
											value={value}
											onChange={handleChange}
											customInput={TextField}
											thousandSeparator
											valueIsNumericString
											suffix="تومان"
											variant="outlined"
											label="مبلغ"
											required
											placeholder="مبلغ پلن را بنویسید"
											helperText={errors?.price?.message}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<GrMoney size={20} />
													</InputAdornment>
												),
											}}
										/>
									)}
								/>
								<div className="flex justify-center items-center w-full">
									<div className="flex justify-center items-center w-full">
										<Controller
											control={control}
											name="state"
											render={({ field }) => (
												<FormControl
													className="w-full"
													sx={{ m: 1, minWidth: 80 }}
												>
													<InputLabel id="demo-simple-select-autowidth-label">
														مدت زمان
													</InputLabel>
													<Select
														labelId="demo-simple-select-autowidth-label"
														id="demo-simple-select-autowidth"
														value={duration}
														onChange={handleDurationChange}
														variant="outlined"
														label="مدت زمان"
														placeholder="مدت زمان"
													>
														<MenuItem value="1">1</MenuItem>
														<MenuItem value="2">2</MenuItem>
														<MenuItem value="3">3</MenuItem>
														<MenuItem value="4">4</MenuItem>
														<MenuItem value="5">5</MenuItem>
														<MenuItem value="6">6</MenuItem>
														<MenuItem value="7">7</MenuItem>
														<MenuItem value="8">8</MenuItem>
														<MenuItem value="9">9</MenuItem>
														<MenuItem value="10">10</MenuItem>
														<MenuItem value="11">11</MenuItem>
														<MenuItem value="12">12</MenuItem>
													</Select>
												</FormControl>
											)}
										/>
										<Controller
											control={control}
											name="term"
											render={({ field }) => (
												<FormControl
													className="w-full"
													sx={{ m: 1, minWidth: 80 }}
												>
													<InputLabel id="term">دوره</InputLabel>
													<Select
														labelId="term"
														id="term"
														value={term}
														onChange={handleTermChange}
														variant="outlined"
														label="دوره"
														placeholder="دوره"
													>
														<MenuItem value="ماهه">ماهه</MenuItem>
														<MenuItem value="ساله">ساله</MenuItem>
													</Select>
												</FormControl>
											)}
										/>
									</div>
									<Controller
										control={control}
										name="state"
										render={({ field }) => (
											<FormControl
												className="w-full"
												sx={{ m: 1, minWidth: 80 }}
											>
												<InputLabel id="demo-simple-select-autowidth-label">
													وضعیت
												</InputLabel>
												<Select
													labelId="demo-simple-select-autowidth-label"
													id="demo-simple-select-autowidth"
													value={isActive}
													onChange={handleActiveChange}
													variant="outlined"
													label="وضعیت"
													placeholder="وضعیت"
												>
													<MenuItem value="فعال">فعال</MenuItem>
													<MenuItem value="غیرفعال">غیرفعال</MenuItem>
												</Select>
											</FormControl>
										)}
									/>
								</div>
								<Controller
									control={control}
									name="description"
									render={({ field }) => (
										<TextField
											id="description"
											label="توضیحات (ویژگی‌ها)"
											multiline
											minRows={3}
											helperText={errors?.description?.message}
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<CiTextAlignJustify size={20} />
													</InputAdornment>
												),
											}}
										/>
									)}
								/>
								<Typography>
									زمان ایجاد و زمان بروزرسانی در ویرایش ذکر شود.
								</Typography>
							</div>
						</form>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>لغو</Button>
					<Button variant="contained" color="secondary" onClick={handleClose}>
						ذخیره
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default AddBundle;
