import { AddOutlined } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

function CustomForm({
	totalAmount,
	textLabel,
	textName,
	textType,
	textHelper,
	count,
	setCount,
}) {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	const array = new Array(count + 1).fill(1);
	return (
		<div className="max-w-screen mx-5 flex flex-col">
			{array.map((item, itemIndex) => (
				<div className="flex items-center" key={itemIndex}>
					<Controller
						name={`${textName} ${itemIndex}`}
						control={control}
						render={({ field }) => (
							<TextField
								type={textType}
								{...field}
								className="mt-8 mb-16 sm:mx-4 w-[30rem]"
								// error={!!errors.province}
								helperText={errors?.province?.message || textHelper}
								label={textLabel}
								id={`${textName} ${itemIndex}`}
								variant="outlined"
								fullWidth
							/>
						)}
					/>
					{itemIndex + 1 === array.length && (
						<Button
							variant="outlined"
							color="success"
							className="w-32"
							onClick={() => {
								if (count !== totalAmount) {
									setCount(count + 1);
								}
							}}
						>
							<AddOutlined />
						</Button>
					)}
				</div>
			))}
		</div>
	);
}

export default CustomForm;
