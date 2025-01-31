import { useState } from "react";

import Slider from "@mui/material/Slider";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import Filter from "./Filter";

export type SliderFilterProps = {
	label: string;
	min: number;
	max: number;
	step?: number;
	value: number;
	onChange: (value: number) => void;
	disabled?: boolean;
};

export default function SliderFilter({
										 label,
										 min,
										 max,
										 step,
										 value,
										 onChange,
										 disabled,
									 }) {
	const [focused, setFocused] = useState(false);

	return (
		<Filter>
			<FormControl margin="none" fullWidth>
				<InputLabel shrink variant="standard" focused={focused}>
					{label}
				</InputLabel>
				<Slider
					min={min}
					max={max}
					step={step}
					value={value}
					disabled={disabled}
					size="small"
					valueLabelDisplay="auto"
					marks={[
						{ value: min, label: `${min}` },
						{ value: max, label: `${max}` },
					]}
					onChange={(_, value) =>
						onChange(typeof value === "number" ? value : value[0])
					}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					sx={{ mt: 2 }}
				/>
			</FormControl>
		</Filter>
	);
}
