// import { AsyncPaginate } from 'react-select-async-paginate';
// import { components } from 'react-select';
// import Checkbox from '@mui/material/Checkbox';
// import classes from './customSelect.module.css';
//
// function CustomSelect(props) {
// 	// eslint-disable-next-line react/prop-types
// 	const {
// 		// eslint-disable-next-line react/prop-types
// 		name,
// 		// eslint-disable-next-line react/prop-types
// 		id,
// 		// eslint-disable-next-line react/prop-types
// 		errors,
// 		// eslint-disable-next-line react/prop-types
// 		isDisabled,
// 		// eslint-disable-next-line react/prop-types
// 		touched,
// 		// eslint-disable-next-line react/prop-types
// 		setFieldValue,
// 		// eslint-disable-next-line react/prop-types
// 		setFieldTouched,
// 		// eslint-disable-next-line react/prop-types
// 		value,
// 		// eslint-disable-next-line react/prop-types
// 		onChange,
// 		// eslint-disable-next-line react/prop-types
// 		searchByPersonnelId,
// 		// eslint-disable-next-line react/prop-types
// 		loadOptions,
// 		// eslint-disable-next-line react/prop-types
// 		searchOption,
// 		// eslint-disable-next-line react/prop-types
// 		setSearchOption,
// 		// eslint-disable-next-line react/prop-types
// 		noOptionsMessage,
// 		// eslint-disable-next-line react/prop-types
// 		loadingMessage,
// 		// eslint-disable-next-line react/prop-types
// 		checkBoxes
// 	} = props;
//
// 	function NoOptionsMessage(props) {
// 		return (
// 			<components.NoOptionsMessage {...props}>
// 				<span className="custom-css-class">{noOptionsMessage}</span>
// 			</components.NoOptionsMessage>
// 		);
// 	}
//
// 	function LoadingMessage(props) {
// 		return (
// 			<components.LoadingMessage {...props}>
// 				<span className="custom-css-class">{loadingMessage}</span>
// 			</components.LoadingMessage>
// 		);
// 	}
//
// 	// eslint-disable-next-line react/prop-types
// 	function CustomCheckbox({ children, name, id, checked, onChange }) {
// 		return (
// 			<label className="mx-2">
// 				<Checkbox
// 					type="radio"
// 					checked={checked}
// 					name={name}
// 					id={id}
// 					onChange={onChange}
// 				/>
// 				<span> {children} </span>
// 			</label>
// 		);
// 	}
//
// 	return (
// 		<div>
// 			{/* eslint-disable-next-line react/prop-types */}
// 			<div className={errors && touched && classes.selectDiv}>
// 				<AsyncPaginate
// 					placeholder=""
// 					components={{ LoadingMessage, NoOptionsMessage }}
// 					name={name}
// 					id={id}
// 					isDisabled={isDisabled}
// 					debounceTimeout={500}
// 					value={value}
// 					loadOptions={loadOptions}
// 					onChange={(e) => {
// 						onChange(e);
// 						setFieldValue(name, e?.value);
//
// 						if (searchByPersonnelId === true) setFieldValue('employeeId', e?.employeeId);
// 					}}
// 					onBlur={(e) => {
// 						console.log(e);
// 						setFieldTouched(name, true, true);
// 					}}
// 					required
// 					additional={{
// 						page: 1
// 					}}
// 				/>
// 			</div>
// 			{checkBoxes ? (
// 				<div
// 					style={{
// 						color: 'hsl(0, 0%, 40%)',
// 						display: 'inline-block',
// 						fontSize: 12,
// 						fontStyle: 'italic',
// 						marginTop: '1em'
// 					}}
// 				>
// 					<span>جستجو براساس: </span>
// 					{/* eslint-disable-next-line react/prop-types */}
// 					{checkBoxes?.map((check) => {
// 						return (
// 							<CustomCheckbox
// 								key={check.value}
// 								checked={searchOption === check.value}
// 								name="searchOptions"
// 								id={`searchOption${check.value}`}
// 								onChange={() => setSearchOption(check.value)}
// 							>
// 								{check.label}
// 							</CustomCheckbox>
// 						);
// 					})}
// 				</div>
// 			) : (
// 				<></>
// 			)}
// 		</div>
// 	);
// }
//
// export default CustomSelect;

import { AsyncPaginate } from 'react-select-async-paginate';
import { components } from 'react-select';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';
import classes from './customSelect.module.css';

function CustomMenu(props) {
	return (
		<components.Menu
			{...props}
			style={{ ...props.style }}
			className={`${props.className} font-sans`}
		/>
	);
}

function CustomOption(props) {
	const { data, innerProps, innerRef, isFocused, isSelected } = props;
	return (
		<div
			ref={innerRef}
			{...innerProps}
			className={`p-2 cursor-pointer ${isFocused ? 'bg-gray-100' : ''} ${isSelected ? 'bg-blue-100' : ''}`}
		>
			<div className="font-medium">{data.label}</div>
			{/* {data.phone && ( */}
			<div className="text-sm text-gray-500">09352388350</div>
			{/* )} */}
		</div>
	);
}

function CustomSelect({
	name,
	id,
	errors,
	isDisabled,
	touched,
	setFieldValue,
	setFieldTouched,
	value,
	onChange,
	searchByPersonnelId,
	loadOptions,
	url,
	additionalParams = {},
	searchOption,
	setSearchOption,
	noOptionsMessage = 'No options',
	loadingMessage = 'Loading...',
	checkBoxes,
	...rest
}) {
	const defaultLoadOptions = async (search, prevOptions, { page }) => {
		try {
			const queryParam = search ? `&search=${encodeURIComponent(search)}` : '';
			const pageParam = `pageNumber=${Number(page) + 1}`;
			const extraParams = Object.entries(additionalParams)
				.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
				.join('&');
			const queryString = `${pageParam}${queryParam}${extraParams ? `&${extraParams}` : ''}`;
			const response = await axios.get(`${url}?${queryString}`);
			const json = response.data;

			if (json.status !== 'SUCCESS') {
				return {
					options: [],
					hasMore: false,
					additional: { page }
				};
			}

			const newOptions = json.data || [];
			const totalPages = json.pagination ? json.pagination.totalPages : 1;
			const hasMore = page < totalPages;
			return {
				options: newOptions,
				hasMore,
				additional: { page: page + 1 }
			};
		} catch (error) {
			console.error('Error fetching options:', error);
			return {
				options: [],
				hasMore: false,
				additional: { page }
			};
		}
	};

	const asyncLoadOptions = loadOptions || (url ? defaultLoadOptions : null);

	if (!asyncLoadOptions) {
		console.error('CustomSelect requires either a loadOptions function or a url prop');
		return null;
	}

	function NoOptionsMessageComponent(props) {
		return (
			<components.NoOptionsMessage {...props}>
				<span className="custom-css-class">{noOptionsMessage}</span>
			</components.NoOptionsMessage>
		);
	}

	function LoadingMessageComponent(props) {
		return (
			<components.LoadingMessage {...props}>
				<span className="custom-css-class">{loadingMessage}</span>
			</components.LoadingMessage>
		);
	}

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

	const customStyles = {
		singleValue: (provided) => ({
			...provided,
			fontWeight: 700,
			padding: '8px'
		})
	};

	return (
		<div className="font-sans">
			<div className={errors && touched ? `${classes.selectDiv} font-sans` : 'font-san'}>
				<AsyncPaginate
					{...rest}
					styles={customStyles}
					placeholder=""
					components={{
						Option: CustomOption,
						Menu: (p) =>
							CustomMenu({
								...p,
								style: { fontFamily: 'yekan' },
								className: 'font-700'
							}),
						LoadingMessage: LoadingMessageComponent,
						NoOptionsMessage: NoOptionsMessageComponent
					}}
					name={name}
					id={id}
					isDisabled={isDisabled}
					debounceTimeout={500}
					value={value}
					loadOptions={asyncLoadOptions}
					onChange={(selectedOption) => {
						onChange(selectedOption);
						// setFieldValue(name, selectedOption?.value);

						if (searchByPersonnelId) {
							setFieldValue('employeeId', selectedOption?.employeeId);
						}
					}}
					onBlur={(e) => {
						setFieldTouched(name, true, true);
					}}
					additional={{ page: 0 }}
				/>
			</div>
			{checkBoxes && Array.isArray(checkBoxes) && (
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
					{checkBoxes.map((check) => (
						<CustomCheckbox
							key={check.value}
							checked={searchOption === check.value}
							name="searchOptions"
							id={`searchOption${check.value}`}
							onChange={() => setSearchOption(check.value)}
						>
							{check.label}
						</CustomCheckbox>
					))}
				</div>
			)}
		</div>
	);
}

export default CustomSelect;
