import { AsyncPaginate } from 'react-select-async-paginate';
import { components } from 'react-select';
import Checkbox from '@mui/material/Checkbox';
import classes from './customSelect.module.css';

function CustomSelect(props) {
	// eslint-disable-next-line react/prop-types
	const {
		// eslint-disable-next-line react/prop-types
		name,
		// eslint-disable-next-line react/prop-types
		id,
		// eslint-disable-next-line react/prop-types
		errors,
		// eslint-disable-next-line react/prop-types
		isDisabled,
		// eslint-disable-next-line react/prop-types
		touched,
		// eslint-disable-next-line react/prop-types
		setFieldValue,
		// eslint-disable-next-line react/prop-types
		setFieldTouched,
		// eslint-disable-next-line react/prop-types
		value,
		// eslint-disable-next-line react/prop-types
		onChange,
		// eslint-disable-next-line react/prop-types
		searchByPersonnelId,
		// eslint-disable-next-line react/prop-types
		loadOptions,
		// eslint-disable-next-line react/prop-types
		searchOption,
		// eslint-disable-next-line react/prop-types
		setSearchOption,
		// eslint-disable-next-line react/prop-types
		noOptionsMessage,
		// eslint-disable-next-line react/prop-types
		loadingMessage,
		// eslint-disable-next-line react/prop-types
		checkBoxes
	} = props;

	function NoOptionsMessage(props) {
		return (
			<components.NoOptionsMessage {...props}>
				<span className="custom-css-class">{noOptionsMessage}</span>
			</components.NoOptionsMessage>
		);
	}

	function LoadingMessage(props) {
		return (
			<components.LoadingMessage {...props}>
				<span className="custom-css-class">{loadingMessage}</span>
			</components.LoadingMessage>
		);
	}

	// eslint-disable-next-line react/prop-types
	function CustomCheckbox({ children, name, id, checked, onChange }) {
		return (
			<label className="mx-2">
				<Checkbox
					type="radio"
					checked={checked}
					name={name}
					id={id}
					onChange={onChange}
				/>
				<span> {children} </span>
			</label>
		);
	}

	return (
		<div>
			{/* eslint-disable-next-line react/prop-types */}
			<div className={errors && touched && classes.selectDiv}>
				<AsyncPaginate
					placeholder=""
					components={{ LoadingMessage, NoOptionsMessage }}
					name={name}
					id={id}
					isDisabled={isDisabled}
					debounceTimeout={500}
					value={value}
					loadOptions={loadOptions}
					onChange={(e) => {
						onChange(e);
						setFieldValue(name, e?.value);

						if (searchByPersonnelId === true) setFieldValue('employeeId', e?.employeeId);
					}}
					onBlur={(e) => {
						console.log(e);
						setFieldTouched(name, true, true);
					}}
					required
					additional={{
						page: 1
					}}
				/>
			</div>
			{checkBoxes ? (
				<div
					style={{
						color: 'hsl(0, 0%, 40%)',
						display: 'inline-block',
						fontSize: 12,
						fontStyle: 'italic',
						marginTop: '1em'
					}}
				>
					<span>جستجو براساس: </span>
					{/* eslint-disable-next-line react/prop-types */}
					{checkBoxes?.map((check) => {
						return (
							<CustomCheckbox
								key={check.value}
								checked={searchOption === check.value}
								name="searchOptions"
								id={`searchOption${check.value}`}
								onChange={() => setSearchOption(check.value)}
							>
								{check.label}
							</CustomCheckbox>
						);
					})}
				</div>
			) : (
				<></>
			)}
		</div>
	);
}

export default CustomSelect;
