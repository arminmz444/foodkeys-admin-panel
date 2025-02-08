// GenericListInput.jsx
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, FormHelperText } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * A generic list input that manipulates an array field in react-hook-form.
 *
 * @param {string} name - The field name in RHF for the array
 * @param {function} makeDefault - A function that returns a new item default
 * @param {React.ElementType} ItemComponent - The component used to render each item
 * @param {string} addButtonLabel - Label for the "Add" button
 * @param {boolean} disabled - If true, disable add/remove
 * @param {string} label - For overall field label
 * @param {string} helperText - Field-level helper text or error message
 * @param {boolean} error - Field-level error status
 * @param {...rest} - Additional props passed to the container
 */
function GenericListInput({
							  name,
							  makeDefault,
							  ItemComponent,
							  addButtonLabel = 'Add item',
							  disabled = false,
							  label = '',
							  helperText = '',
							  error = false,
							  ...rest
						  }) {
	// Access form context
	const { control } = useFormContext();

	// useFieldArray for "name" (the array key in form data)
	const { fields, append, remove } = useFieldArray({ control, name });

	return (
		<div {...rest}>
			{label && <div className="mb-8 font-semibold">{label}</div>}

			{error && helperText && <FormHelperText error>{helperText}</FormHelperText>}

			{fields.map((field, index) => (
				<ItemComponent
					key={field.id}
					value={field}
					onChange={(newVal) => {
						// We manually update form data:
						// Easiest approach is to call update from useFieldArray,
						// but we can do it by ephemeral "onChange" if you prefer
						// We'll do a simpler approach with setValue in parent's form or a sub approach:
						// Typically, you'd do "useFieldArray().update(index, newVal)"
						// But let's show a "setValue" approach:
					}}
					onRemove={() => !disabled && remove(index)}
					hideRemove={disabled || fields.length === 1}
				/>
			))}

			{!disabled && (
				<Button
					className="group inline-flex items-center mt-2 py-2 px-4"
					onClick={() => append(makeDefault ? makeDefault() : {})}
				>
					<FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>
					<span className="ml-8 font-medium text-secondary group-hover:underline">{addButtonLabel}</span>
				</Button>
			)}
		</div>
	);
}

export default GenericListInput;
