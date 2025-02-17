import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	password: z
		.string()
		.min(8, 'Password is too short - must be at least 8 chars.')
		.nonempty('Please enter your password.')
});
const defaultValues = {
	email: '',
	password: '',
	remember: true
};

/**
 * The full screen sign in page.
 */
function FullScreenReversedSignInPage() {
	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;

	function onSubmit() {
		reset(defaultValues);
	}

	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Box
				className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112 "
				sx={{ backgroundColor: 'primary.main' }}
			>
				<svg
					className="pointer-events-none absolute inset-0"
					viewBox="0 0 960 540"
					width="100%"
					height="100%"
					preserveAspectRatio="xMidYMax slice"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Box
						component="g"
						sx={{ color: 'primary.light' }}
						className="opacity-20"
						fill="none"
						stroke="currentColor"
						strokeWidth="100"
					>
						<circle
							r="234"
							cx="196"
							cy="23"
						/>
						<circle
							r="234"
							cx="790"
							cy="491"
						/>
					</Box>
				</svg>
				<Box
					component="svg"
					className="absolute -right-64 -top-64 opacity-20"
					sx={{ color: 'primary.light' }}
					viewBox="0 0 220 192"
					width="220px"
					height="192px"
					fill="none"
				>
					<defs>
						<pattern
							id="837c3e70-6c3a-44e6-8854-cc48c737b659"
							x="0"
							y="0"
							width="20"
							height="20"
							patternUnits="userSpaceOnUse"
						>
							<rect
								x="0"
								y="0"
								width="4"
								height="4"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect
						width="220"
						height="192"
						fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
					/>
				</Box>

				<div className="relative z-10 w-full max-w-2xl">
					<div className="text-7xl font-bold leading-none text-gray-100">
						<div>Welcome to</div>
						<div>our community</div>
					</div>
					<div className="mt-24 text-lg leading-6 tracking-tight text-gray-400">
							به داشبورد مدیریت سایت مرجع صنایع غذایی و کشاورزی ایران (سام) خوش آمدید! این پنل ویژه مدیران و کارمندان طراحی شده است تا کنترل کاملی بر روی سامانه‌های مختلف از جمله داشبورد کاربران، وب‌سایت اصلی، وبلاگ خبری و سایر سرویس‌های آینده داشته باشید.

							🔹 مدیریت کاربران و دسترسی‌ها
							🔹 نظارت و تنظیمات وب‌سایت و خدمات
							🔹 مدیریت محتوا، اخبار و اطلاعیه‌ها
							🔹 بررسی و پردازش درخواست‌های کاربران

							برای ورود، لطفاً اطلاعات حساب کاربری خود را وارد کنید. دسترسی شما بر اساس نقش تعیین‌شده در سامانه مشخص خواهد شد.
						</div>
					<div className="mt-32 flex items-center">
						<AvatarGroup
							sx={{
								'& .MuiAvatar-root': {
									borderColor: 'primary.main'
								}
							}}
						>
							<Avatar src="assets/images/avatars/female-18.jpg" />
							<Avatar src="assets/images/avatars/female-11.jpg" />
							<Avatar src="assets/images/avatars/male-09.jpg" />
							<Avatar src="assets/images/avatars/male-16.jpg" />
						</AvatarGroup>

						<div className="ml-16 font-medium tracking-tight text-gray-400">
							با ۱۷ سال تجربه و دانش در حوزه صنایع غذایی و کشاورزی
						</div>
					</div>
				</div>
			</Box>

			<Paper className="h-full w-full px-16 py-32 ltr:border-l-1 rtl:border-r-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:rounded-none md:p-64 md:pt-96 md:shadow-none">
				<div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						className="w-48"
						src="assets/images/logo/logo.svg"
						alt="logo"
					/>

					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Sign in
					</Typography>
					<div className="mt-2 flex items-baseline font-medium">
						<Typography>Don't have an account?</Typography>
						<Link
							className="ml-4"
							to="/sign-up"
						>
							Sign up
						</Link>
					</div>

					<form
						name="loginForm"
						noValidate
						className="mt-32 flex w-full flex-col justify-center"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Email"
									autoFocus
									type="email"
									error={!!errors.email}
									helperText={errors?.email?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Password"
									type="password"
									error={!!errors.password}
									helperText={errors?.password?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
							<Controller
								name="remember"
								control={control}
								render={({ field }) => (
									<FormControl>
										<FormControlLabel
											label="Remember me"
											control={
												<Checkbox
													size="small"
													{...field}
												/>
											}
										/>
									</FormControl>
								)}
							/>

							<Link
								className="text-md font-medium"
								to="/pages/auth/forgot-password"
							>
								Forgot password?
							</Link>
						</div>

						<Button
							variant="contained"
							color="secondary"
							className=" mt-16 w-full"
							aria-label="Sign in"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
							size="large"
						>
							Sign in
						</Button>

						<div className="mt-32 flex items-center">
							<div className="mt-px flex-auto border-t" />
							<Typography
								className="mx-8"
								color="text.secondary"
							>
								Or continue with
							</Typography>
							<div className="mt-px flex-auto border-t" />
						</div>

						<div className="mt-32 flex items-center space-x-16">
							<Button
								variant="outlined"
								className="flex-auto"
							>
								<FuseSvgIcon
									size={20}
									color="action"
								>
									feather:facebook
								</FuseSvgIcon>
							</Button>
							<Button
								variant="outlined"
								className="flex-auto"
							>
								<FuseSvgIcon
									size={20}
									color="action"
								>
									feather:twitter
								</FuseSvgIcon>
							</Button>
							<Button
								variant="outlined"
								className="flex-auto"
							>
								<FuseSvgIcon
									size={20}
									color="action"
								>
									feather:github
								</FuseSvgIcon>
							</Button>
						</div>
					</form>
				</div>
			</Paper>
		</div>
	);
}

export default FullScreenReversedSignInPage;
