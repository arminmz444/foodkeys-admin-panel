import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { z } from 'zod';
import _ from '@lodash';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import useJwtAuth from '../useJwtAuth';
/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().nonempty('نام کاربری خود را وارد کنید.'),
	password: z
		.string()
		.min(4, 'رمز عبور وارد شده بسیار کوتاه است - پسورد حداقل باید ۴ کاراکتر باشد.')
		.nonempty('رمزعبور خود را وارد کنید.')
});
const defaultValues = {
	email: '',
	password: '',
	remember: true
};

function JwtSignInForm() {
	const { signIn } = useJwtAuth();
	const { control, formState, handleSubmit, setValue, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	useEffect(() => {
		setValue('email', 'admin@fusetheme.com', { shouldDirty: true, shouldValidate: true }); // default: admin@fusetheme.com
		setValue('password', 'admin', { shouldDirty: true, shouldValidate: true }); // default: admin
	}, [setValue]);

	function onSubmit(formData) {
		const { email, password } = formData;
		signIn({
			email,
			password
		}).catch((error) => {
			const errorData = error.response.data;
			errorData.forEach((err) => {
				setError(err.type, {
					type: 'manual',
					message: err.message
				});
			});
		});
	}

	return (
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
						label="شماره تلفن"
						autoFocus
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
						label="رمزعبور"
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
		</form>
	);
}

export default JwtSignInForm;
