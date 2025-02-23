import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Controller, useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
	email: z.string().min(1, { message: "پست الکترونیک الزامیست." }),
});
const defaultValues = {
	email: "",
};

/**
 * The email input.
 */
function EmailInput(props) {
	const { value, hideRemove = false, onChange, onRemove } = props;
	const { control, formState, handleSubmit, reset } = useForm({
		mode: "all",
		defaultValues,
		resolver: zodResolver(schema),
	});
	useEffect(() => {
		reset(value);
	}, [reset, value]);
	const { errors } = formState;

	function onSubmit(data) {
		onChange(data);
	}

	return (
		<form
			className="flex gap-x-16 mb-16 justify-between items-center"
			onChange={handleSubmit(onSubmit)}
		>
			<Controller
				control={control}
				name="email"
				render={({ field }) => (
					<TextField
						{...field}
						label="پست الکترونیک"
						placeholder="پست الکترونیک کاربر را وارد کنید."
						variant="outlined"
						fullWidth
						required
						type="email"
						error={!!errors.email}
						helperText={errors?.email?.message}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
								</InputAdornment>
							),
						}}
					/>
				)}
			/>
			{!hideRemove && (
				<IconButton
					onClick={() => {
						onRemove(value);
					}}
					className="text-red-300 w-auto h-auto hover:scale-125 transition-all duration-300"
				>
					<FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
				</IconButton>
			)}
		</form>
	);
}

export default EmailInput;
