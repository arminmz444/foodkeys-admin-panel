import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import _ from '@lodash';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
/**
 * Form Validation Schema
 */
const schema = z
	.object({
		password: z
			.string()
			.nonempty('Please enter your password.')
			.min(8, 'Password is too short - should be 8 chars minimum.'),
		passwordConfirm: z.string().nonempty('Password confirmation is required')
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords must match',
		path: ['passwordConfirm']
	});
const defaultValues = {
	password: '',
	passwordConfirm: ''
};

/**
 * The full screen reset password page.
 */
function FullScreenResetPasswordPage() {
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
			<Paper className="h-full w-full px-16 py-32 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:justify-end md:rounded-none md:p-64 md:pt-96 md:shadow-none">
				<div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						className="w-48"
						src="assets/images/logo/logo.svg"
						alt="logo"
					/>

					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Reset your password
					</Typography>
					<Typography className="font-medium">Create a new password for your account</Typography>

					<form
						name="registerForm"
						noValidate
						className="mt-32 flex w-full flex-col justify-center"
						onSubmit={handleSubmit(onSubmit)}
					>
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

						<Controller
							name="passwordConfirm"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Password (Confirm)"
									type="password"
									error={!!errors.passwordConfirm}
									helperText={errors?.passwordConfirm?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<Button
							variant="contained"
							color="secondary"
							className=" mt-4 w-full"
							aria-label="Register"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
							size="large"
						>
							Reset your password
						</Button>

						<Typography
							className="mt-32 text-md font-medium"
							color="text.secondary"
						>
							<span>Return to</span>
							<Link
								className="ml-4"
								to="/sign-in"
							>
								sign in
							</Link>
						</Typography>
					</form>
				</div>
			</Paper>

			<Box
				className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112"
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
		</div>
	);
}

export default FullScreenResetPasswordPage;
