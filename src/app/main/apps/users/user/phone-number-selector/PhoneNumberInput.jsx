import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Controller, useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import CountryCodeSelector from "./CountryCodeSelector";
// Zod schema for ContactPhoneNumber
const schema = z.object({
	phoneNumber: z.string().min(11, { message: "شماره تلفن کاربر الزامیست" }),
});
const defaultValues = {
	phoneNumber: "",
};

/**
 * The phone number input.
 */
function PhoneNumberInput(props) {
	const { value, hideRemove = false, onChange, onRemove } = props;
	const { control, formState, handleSubmit, reset } = useForm({
		mode: "all",
		defaultValues,
		resolver: zodResolver(schema),
	});
	const { errors } = formState;
	useEffect(() => {
		reset(value);
	}, [reset, value]);

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
				name="phoneNumber"
				render={({ field }) => (
					<TextField
						{...field}
						label="شماره تلفن همراه"
						placeholder="شماره تلفن همراه کاربر را وارد کنید."
						variant="outlined"
						fullWidth
						error={!!errors.phoneNumber}
						helperText={errors?.phoneNumber?.message}
						required
						type="number"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<FuseSvgIcon size={20}>heroicons-solid:phone</FuseSvgIcon>
								</InputAdornment>
							),
						}}
					/>
				)}
			/>

			{!hideRemove && (
				<IconButton
					onClick={(ev) => {
						ev.stopPropagation();
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

export default PhoneNumberInput;
