import { zodResolver } from "@hookform/resolvers/zod";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MapComponent from "app/shared-components/leafletMap/MapComponent";
import { motion } from "framer-motion";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { z } from "zod";

const schema = z
	.object({
		phone: z
			.string({ required_error: "الزامی می‌باشد." })
			.min(11, { message: "فرمت شماره تلفن درست نمی‌باشد" }),
		password: z
			.string({ required_error: "الزامی می‌باشد." })
			.min(8, { message: "کلمه عبور باید حداقل ۸ کاراکتر باشد." }),
		passwordConfirm: z
			.string({ required_error: "الزامی می‌باشد." })
			.min(1, { message: "تکرار کلمه عبور الزامیست." }),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "کلمه عبور و تکرار آن مطابقت ندارند.",
		path: ["passwordConfirm"],
	});

function PasswordTab() {
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const { control, reset, handleSubmit, formState } = useForm({
		mode: "all",
		resolver: zodResolver(schema),
	});
	const { isValid, dirtyFields, errors } = formState;
	const container = {
		show: {
			transition: {
				staggerChildren: 0.04,
			},
		},
	};
	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 },
	};
	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full"
		>
			<Card
				component={motion.div}
				variants={item}
				className="flex flex-col w-full px-32 pt-24"
			>
				<Typography className="text-3xl font-semibold leading-tight">
					فراموشی رمز عبور
				</Typography>

				<CardContent className="flex flex-col justify-center items-end px-32 py-24">
					<div className="w-full flex flex-col">
						<Typography className=" font-300 leading-tight text-start">
							برای تغییر رمز عبور ابتدا شماره موبایل خود را تایید نمایید:
							<span className="font-semibold">93*****0912</span>
						</Typography>
						<div className="flex items-center justify-between w-full gap-20">
							<Controller
								control={control}
								name="phone"
								render={({ field }) => (
									<TextField
										className="mt-32 w-1/2"
										{...field}
										label="شماره موبایل همراه"
										placeholder="شماره موبایل خود را وارد کنید"
										id="phone"
										error={!!errors.phone}
										helperText={errors?.phone?.message}
										variant="outlined"
										type="number"
										required
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<HiOutlineDevicePhoneMobile size={25} />
												</InputAdornment>
											),
										}}
									/>
								)}
							/>
							<Button variant="contained" color="secondary" className="w-1/4">
								ارسال کد
							</Button>
						</div>
					</div>
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
					<Button variant="contained" color="secondary" className="w-1/3 mt-32">
						ثبت
					</Button>
				</CardContent>
			</Card>
			<Card
				component={motion.div}
				variants={item}
				dir="ltr"
				className="flex flex-col w-full px-32 pt-24"
			>
				<CardContent className="flex flex-col justify-center items-end px-32 py-24">
					<MapComponent />
				</CardContent>
			</Card>
		</motion.div>
	);
}

export default PasswordTab;
