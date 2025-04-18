// GenericListItem.jsx
import React from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * A reusable item component for a single item in the list.
 * This example only has a "label" field, but you can add more or pass them as props.
 */
function GenericListItem({ value, onChange, onRemove, hideRemove = false, labelField = 'label', labelTitle = 'Label' }) {
	// For simpler usage, we can do an uncontrolled <TextField> or we can do "onChange" calls
	// whenever the user types. We'll keep it simple with onChange for each keystroke:
	const handleLabelChange = (e) => {
		onChange({ ...value, [labelField]: e.target.value });
	};

	return (
		<div className="flex items-center space-x-16 mb-16 w-full">
			<TextField
				variant="outlined"
				fullWidth
				label={labelTitle}
				value={value[labelField] || ''}
				onChange={handleLabelChange}
			/>

			{!hideRemove && (
				<IconButton
					onClick={(ev) => {
						ev.stopPropagation();
						onRemove();
					}}
				>
					<FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
				</IconButton>
			)}
		</div>
	);
}

export default GenericListItem;
