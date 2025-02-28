import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import { forwardRef } from 'react';
import clsx from 'clsx';
import FormHelperText from '@mui/material/FormHelperText';
import CustomArrayFieldInput from './CustomArrayFieldInput.jsx';
import { ContactPhoneModel } from '@/app/main/apps/contacts/models/ContactModel.js';
// import { ContactPhoneModel } from '../../models/ContactModel';
/**
 * The phone number selector.
 */
const CustomArrayFieldSelector = forwardRef((props, ref) => {
	const { value, onChange, className, error, helperText, inputName, inputLabel, inputPlaceholder, haveTypeInput = true, buttonText = 'افزودن' } = props;
	return (
		<div
			className={clsx('w-full', className)}
			ref={ref}
		>
			{error && helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}

			{value?.map((item, index) => (
				<CustomArrayFieldInput
					value={item}
					key={index}
					onChange={(val) => {
						onChange(value?.map((_item, _index) => (index === _index ? val : _item)));
					}}
					onRemove={() => {
						onChange(value.filter((_item, _index) => index !== _index));
					}}
					hideRemove={value.length === 1}
					inputName={inputName}
					inputLabel={inputLabel}
					inputPlaceholder={inputPlaceholder}
					haveTypeInput={haveTypeInput}
				/>
			))}
			<Button
				className="group inline-flex items-center mt-2 -ml-4 py-2 px-4 rounded cursor-pointer"
				onClick={() => onChange([...value, ContactPhoneModel({})])}
			>
				<FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>

				<span className="ml-8 font-medium text-secondary group-hover:underline">{buttonText}</span>
			</Button>
		</div>
	);
});
export default CustomArrayFieldSelector;
