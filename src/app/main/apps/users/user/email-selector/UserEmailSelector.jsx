import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Button from "@mui/material/Button";
import { forwardRef } from "react";
import clsx from "clsx";
import EmailInput from "./EmailInput";
import { ContactEmailModel } from "../../models/ContactModel";
/**
 * The contact email selector.
 */
const UserEmailSelector = forwardRef((props, ref) => {
	const { value, onChange, className } = props;
	return (
		<div className={clsx("w-full", className)} ref={ref}>
			{value?.map((item, index) => (
				<EmailInput
					value={item}
					key={index}
					onChange={(val) => {
						onChange(
							value.map((_item, _index) => (index === _index ? val : _item))
						);
					}}
					onRemove={() => {
						onChange(value.filter((_item, _index) => index !== _index));
					}}
					hideRemove={value.length === 1}
				/>
			))}
			<Button
				className="group inline-flex items-center justify-center mt-2 -ml-4 py-2 px-4 rounded cursor-pointer"
				onClick={() => value && onChange([...value, ContactEmailModel({})])}
			>
				<FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>

				<span className="mr-8 font-medium text-secondary group-hover:underline">
					افزودن آدرس ایمیل
				</span>
			</Button>
		</div>
	);
});
export default UserEmailSelector;
