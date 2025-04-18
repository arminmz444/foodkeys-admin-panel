// // import { AsyncPaginate } from 'react-select-async-paginate';
// // import { components } from 'react-select';
// // import Checkbox from '@mui/material/Checkbox';
// // import classes from './customSelect.module.css';
// //
// // function CustomSelect(props) {
// // 	// eslint-disable-next-line react/prop-types
// // 	const {
// // 		// eslint-disable-next-line react/prop-types
// // 		name,
// // 		// eslint-disable-next-line react/prop-types
// // 		id,
// // 		// eslint-disable-next-line react/prop-types
// // 		errors,
// // 		// eslint-disable-next-line react/prop-types
// // 		isDisabled,
// // 		// eslint-disable-next-line react/prop-types
// // 		touched,
// // 		// eslint-disable-next-line react/prop-types
// // 		setFieldValue,
// // 		// eslint-disable-next-line react/prop-types
// // 		setFieldTouched,
// // 		// eslint-disable-next-line react/prop-types
// // 		value,
// // 		// eslint-disable-next-line react/prop-types
// // 		onChange,
// // 		// eslint-disable-next-line react/prop-types
// // 		searchByPersonnelId,
// // 		// eslint-disable-next-line react/prop-types
// // 		loadOptions,
// // 		// eslint-disable-next-line react/prop-types
// // 		searchOption,
// // 		// eslint-disable-next-line react/prop-types
// // 		setSearchOption,
// // 		// eslint-disable-next-line react/prop-types
// // 		noOptionsMessage,
// // 		// eslint-disable-next-line react/prop-types
// // 		loadingMessage,
// // 		// eslint-disable-next-line react/prop-types
// // 		checkBoxes
// // 	} = props;
// //
// // 	function NoOptionsMessage(props) {
// // 		return (
// // 			<components.NoOptionsMessage {...props}>
// // 				<span className="custom-css-class">{noOptionsMessage}</span>
// // 			</components.NoOptionsMessage>
// // 		);
// // 	}
// //
// // 	function LoadingMessage(props) {
// // 		return (
// // 			<components.LoadingMessage {...props}>
// // 				<span className="custom-css-class">{loadingMessage}</span>
// // 			</components.LoadingMessage>
// // 		);
// // 	}
// //
// // 	// eslint-disable-next-line react/prop-types
// // 	function CustomCheckbox({ children, name, id, checked, onChange }) {
// // 		return (
// // 			<label className="mx-2">
// // 				<Checkbox
// // 					type="radio"
// // 					checked={checked}
// // 					name={name}
// // 					id={id}
// // 					onChange={onChange}
// // 				/>
// // 				<span> {children} </span>
// // 			</label>
// // 		);
// // 	}
// //
// // 	return (
// // 		<div>
// // 			{/* eslint-disable-next-line react/prop-types */}
// // 			<div className={errors && touched && classes.selectDiv}>
// // 				<AsyncPaginate
// // 					placeholder=""
// // 					components={{ LoadingMessage, NoOptionsMessage }}
// // 					name={name}
// // 					id={id}
// // 					isDisabled={isDisabled}
// // 					debounceTimeout={500}
// // 					value={value}
// // 					loadOptions={loadOptions}
// // 					onChange={(e) => {
// // 						onChange(e);
// // 						setFieldValue(name, e?.value);
// //
// // 						if (searchByPersonnelId === true) setFieldValue('employeeId', e?.employeeId);
// // 					}}
// // 					onBlur={(e) => {
// // 						console.log(e);
// // 						setFieldTouched(name, true, true);
// // 					}}
// // 					required
// // 					additional={{
// // 						page: 1
// // 					}}
// // 				/>
// // 			</div>
// // 			{checkBoxes ? (
// // 				<div
// // 					style={{
// // 						color: 'hsl(0, 0%, 40%)',
// // 						display: 'inline-block',
// // 						fontSize: 12,
// // 						fontStyle: 'italic',
// // 						marginTop: '1em'
// // 					}}
// // 				>
// // 					<span>جستجو براساس: </span>
// // 					{/* eslint-disable-next-line react/prop-types */}
// // 					{checkBoxes?.map((check) => {
// // 						return (
// // 							<CustomCheckbox
// // 								key={check.value}
// // 								checked={searchOption === check.value}
// // 								name="searchOptions"
// // 								id={`searchOption${check.value}`}
// // 								onChange={() => setSearchOption(check.value)}
// // 							>
// // 								{check.label}
// // 							</CustomCheckbox>
// // 						);
// // 					})}
// // 				</div>
// // 			) : (
// // 				<></>
// // 			)}
// // 		</div>
// // 	);
// // }
// //
// // export default CustomSelect;

// import { AsyncPaginate } from 'react-select-async-paginate';
// import { components } from 'react-select';
// import Checkbox from '@mui/material/Checkbox';
// import axios from 'axios';
// import classes from './customSelect.module.css';

// function CustomMenu(props) {
// 	return (
// 		<components.Menu
// 			{...props}
// 			style={{ ...props.style }}
// 			className={`${props.className} font-sans`}
// 		/>
// 	);
// }

// function CustomOption(props) {
// 	const { data, innerProps, innerRef, isFocused, isSelected } = props;
// 	return (
// 		<div
// 			ref={innerRef}
// 			{...innerProps}
// 			className={`p-16 cursor-pointer ${isFocused ? 'bg-gray-100' : ''} ${isSelected ? 'bg-blue-100' : ''}`}
// 		>
// 			<div className="font-medium">{data.label}</div>
// 			 {data.username && (
// 			<div className="text-sm text-gray-500">{data.username}</div>
// 			 )}
// 		</div>
// 	);
// }

// function CustomSelect({
// 	name,
// 	id,
// 	errors,
// 	isDisabled,
// 	touched,
// 	setFieldValue,
// 	setFieldTouched,
// 	value,
// 	onChange,
// 	searchByPersonnelId,
// 	loadOptions,
// 	url,
// 	additionalParams = {},
// 	searchOption,
// 	setSearchOption,
// 	noOptionsMessage = 'No options',
// 	loadingMessage = 'Loading...',
// 	checkBoxes,
// 	...rest
// }) {
// 	const defaultLoadOptions = async (search, prevOptions, { page }) => {
// 		try {
// 			const queryParam = search ? `&search=${encodeURIComponent(search)}` : '';
// 			const pageParam = `pageNumber=${Number(page) + 1}`;
// 			const extraParams = Object.entries(additionalParams)
// 				.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
// 				.join('&');
// 			const queryString = `${pageParam}${queryParam}${extraParams ? `&${extraParams}` : ''}`;
// 			const response = await axios.get(`${url}?${queryString}`);
// 			const json = response.data;

// 			if (json.status !== 'SUCCESS') {
// 				return {
// 					options: [],
// 					hasMore: false,
// 					additional: { page }
// 				};
// 			}

// 			const newOptions = json.data || [];
// 			const totalPages = json.pagination ? json.pagination.totalPages : 1;
// 			const hasMore = page < totalPages;
// 			return {
// 				options: newOptions,
// 				hasMore,
// 				additional: { page: page + 1 }
// 			};
// 		} catch (error) {
// 			console.error('Error fetching options:', error);
// 			return {
// 				options: [],
// 				hasMore: false,
// 				additional: { page }
// 			};
// 		}
// 	};

// 	const asyncLoadOptions = loadOptions || (url ? defaultLoadOptions : null);

// 	if (!asyncLoadOptions) {
// 		console.error('CustomSelect requires either a loadOptions function or a url prop');
// 		return null;
// 	}

// 	function NoOptionsMessageComponent(props) {
// 		return (
// 			<components.NoOptionsMessage {...props}>
// 				<span className="custom-css-class">{noOptionsMessage}</span>
// 			</components.NoOptionsMessage>
// 		);
// 	}

// 	function LoadingMessageComponent(props) {
// 		return (
// 			<components.LoadingMessage {...props}>
// 				<span className="custom-css-class">{loadingMessage}</span>
// 			</components.LoadingMessage>
// 		);
// 	}

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

// 	const customStyles = {
// 		singleValue: (provided) => ({
// 			...provided,
// 			fontWeight: 700,
// 			padding: '8px'
// 		})
// 	};

// 	return (
// 		<div className="font-sans">
// 			<div className={errors && touched ? `${classes.selectDiv} font-sans` : 'font-san'}>
// 				<AsyncPaginate
// 					{...rest}
// 					styles={customStyles}
// 					placeholder=""
// 					components={{
// 						Option: CustomOption,
// 						Menu: (p) =>
// 							CustomMenu({
// 								...p,
// 								style: { fontFamily: 'yekan' },
// 								className: 'font-700'
// 							}),
// 						LoadingMessage: LoadingMessageComponent,
// 						NoOptionsMessage: NoOptionsMessageComponent
// 					}}
// 					name={name}
// 					id={id}
// 					isDisabled={isDisabled}
// 					debounceTimeout={500}
// 					value={value}
// 					loadOptions={asyncLoadOptions}
// 					onChange={(selectedOption) => {
// 						onChange(selectedOption);
// 						// setFieldValue(name, selectedOption?.value);

// 						if (searchByPersonnelId) {
// 							setFieldValue('employeeId', selectedOption?.employeeId);
// 						}
// 					}}
// 					onBlur={(e) => {
// 						setFieldTouched(name, true, true);
// 					}}
// 					additional={{ page: 0 }}
// 				/>
// 			</div>
// 			{checkBoxes && Array.isArray(checkBoxes) && (
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
// 					{checkBoxes.map((check) => (
// 						<CustomCheckbox
// 							key={check.value}
// 							checked={searchOption === check.value}
// 							name="searchOptions"
// 							id={`searchOption${check.value}`}
// 							onChange={() => setSearchOption(check.value)}
// 						>
// 							{check.label}
// 						</CustomCheckbox>
// 					))}
// 				</div>
// 			)}
// 		</div>
// 	);
// }

// export default CustomSelect;

import React from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { components } from "react-select";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { Link } from "react-router-dom";
import classes from "./customSelect.module.css";
import { Avatar, Badge, Button } from "@mui/material";
import { getServerFile } from "src/utils/string-utils";
import BadgeAvatar from "../badge-avatar/BadgeAvatar";
import styled from "styled-components";

function DefaultMenu(props) {
  return (
    <components.Menu
      {...props}
      style={{ ...props.style }}
      className={`${props.className} font-sans`}
    />
  );
}

function DefaultOption(props) {
  const { data, innerProps, innerRef, isFocused, isSelected } = props;
  // Use a default avatar if none is provided
  const avatarUrl = data.avatar && getServerFile(data.avatar);
  // Online badge color: green if online, gray if not
  const onlineBadgeClass = data.isOnline ? "bg-green-500" : "bg-gray-500";

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className={`p-4 cursor-pointer flex flex-col border-b ${isFocused ? "bg-gray-100" : ""} ${isSelected ? "bg-blue-50" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BadgeAvatar
            color="secondary"
            variant="dot"
            invisible={false}
            className="w-50 h-50 rounded-full object-cover ml-2"
            src={avatarUrl}
            alt={data.label}
          />
          <div>
            <div className="font-medium text-lg mt-8 ms-8">{data.label}</div>
            {data.username && (
              <div className="text-md text-gray-500 ms-8">09352388350</div>
            )}
            {data.username && (
              <div className="text-md text-gray-500 ms-8">{data.username}</div>
            )}
          </div>
        </div>
        {/* Online Status Badge */}
        {/* <div
          className={`w-3 h-3 rounded-full ${onlineBadgeClass}`}
          title={data.isOnline ? "آنلاین" : "آفلاین"}
        /> */}
      </div>

      {/* Second row: roles, companies, and navigation button */}
      <div className="mt-2 flex justify-between items-center">
        <div className="flex flex-wrap items-center gap-2">
          {/* Roles as badges */}
          {data.roles &&
            data.roles.length > 0 &&
            data.roles.map((role) => {
              // If only one role and that role is CONSUMER, use a different color
              const roleBadgeColor =
                data.roles.length === 1 && role.value === "CONSUMER"
                  ? "bg-orange-400"
                  : "bg-blue-400";
              return (
                <span
                  key={role.value}
                  className={`text-md mt-8 me-8 text-white p-8 rounded ${roleBadgeColor}`}
                >
                  {role.label}
                </span>
              );
            })}

          {/* Companies list */}
          {data.companies && data.companies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.companies.map((company, index) => (
                <span
                  key={index}
                  className="text-md mt-8 me-8 text-gray-700 border border-gray-300 p-8 rounded"
                >
                  {company.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Button to view user's info */}
        <Link to={`/users/${data.value}`} className="flex-shrink-0">
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            className="px-8 py-1 rounded"
          >
            پروفایل کاربر
          </Button>
        </Link>
      </div>
    </div>
  );
}

function DefaultNoOptionsMessageComponent(props) {
  const { noOptionsMessage = "گزینه ای موجود نیست", ...rest } = props;
  return (
    <components.NoOptionsMessage {...rest}>
      <span className="custom-css-class">{noOptionsMessage}</span>
    </components.NoOptionsMessage>
  );
}

function DefaultLoadingMessageComponent(props) {
  const { loadingMessage = "در حال بارگذاری...", ...rest } = props;
  return (
    <components.LoadingMessage {...rest}>
      <span className="custom-css-class">{loadingMessage}</span>
    </components.LoadingMessage>
  );
}

function CustomSelect(props) {
  const {
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
    noOptionsMessage = "گزینه ای موجود نیست",
    loadingMessage = "در حال بارگذاری...",
    checkBoxes,
    customComponents,
    placeholder,
    ...rest
  } = props;
  const defaultLoadOptions = async (search, prevOptions, { page }) => {
    try {
      const queryParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const pageParam = `pageNumber=${Number(page) + 1}`;
      const extraParams = Object.entries(additionalParams)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
      const queryString = `${pageParam}${queryParam}${
        extraParams ? `&${extraParams}` : ""
      }`;
      const response = await axios.get(`${url}?${queryString}`);
      const json = response.data;

      if (json.status !== "SUCCESS") {
        return {
          options: [],
          hasMore: false,
          additional: { page },
        };
      }

      const newOptions = json.data || [];
      const totalPages = json.pagination ? json.pagination.totalPages : 1;
      const hasMore = page < totalPages;
      return {
        options: newOptions,
        hasMore,
        additional: { page: page + 1 },
      };
    } catch (error) {
      console.error("Error fetching options:", error);
      return {
        options: [],
        hasMore: false,
        additional: { page },
      };
    }
  };

  const asyncLoadOptions = loadOptions || (url ? defaultLoadOptions : null);
  const CustomOption = customComponents?.CustomOption
    ? customComponents?.CustomOption
    : DefaultOption;
  const CustomMenu = customComponents?.CustomMenu
    ? customComponents?.CustomMenu
    : DefaultMenu;
  const NoOptionsMessageComponent = customComponents?.NoOptionsMessage
    ? customComponents?.NoOptionsMessage
    : DefaultNoOptionsMessageComponent;
  const LoadingMessageComponent = customComponents?.LoadingMessage
    ? customComponents?.LoadingMessage
    : DefaultLoadingMessageComponent;
  if (!asyncLoadOptions) {
    console.error(
      "CustomSelect requires either a loadOptions function or a url prop"
    );
    return null;
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
    placeholder: (provided) => ({
      ...provided,
      fontFamily: "sans, yekan", // Inherit from parent
      fontWeight: 400,
      fontSize: "14px",
      color: "#9C9FA5", // Adjust color to match your design
      paddingRight: "8px",
      // fontFamily: 'var(--font-sans, "Yekan", "IRANSans", sans-serif)',
    }),
    singleValue: (provided) => ({
      ...provided,
      fontFamily: "sans, yekan",
      fontWeight: 700,
      padding: "8px"
    }),
    control: (provided) => ({
      ...provided,
      width: "100%",
      fontFamily: 'sans, yekan',
    }),
    // Ensure the dropdown options also use the right font
    option: (provided) => ({
      ...provided,
      fontFamily: 'sans, yekan',
      textAlign: "right",
      direction: "rtl",
    }),
    // singleValue: (provided) => ({
    //   ...provided,
    //   fontWeight: 700,
    //   padding: "8px",
    // }),
    // menu: (provided) => ({
    //   ...provided,
    //   // direction: 'rtl'
    // }),
  };

  return (
    <div
      className={`font-sans ${classes.mainDiv || ""}`}
      style={{ width: "100%", ...props.style }}
    >
      <div
        className={
          errors && touched ? `${classes.selectDiv} font-sans` : "font-sans"
        }
      >
        <AsyncPaginate
          {...rest}
          styles={{
            ...customStyles,
            // control: (provided) => ({
            //   ...provided,
            //   width: '100%',
            // }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
              // width: '100%',
            }),
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
            container: (provided) => ({
              ...provided,
              // width: '100%',
            }),
          }}
          placeholder={placeholder}
          classNamePrefix="select"
          // menuPortalTarget={document.body}
          // menuPosition={"fixed"}
          components={{
            Option: CustomOption,
            Menu: (p) =>
              CustomMenu({
                ...p,
                style: { fontFamily: "yekan" },
                className: "font-700",
              }),
            LoadingMessage: LoadingMessageComponent,
            NoOptionsMessage: NoOptionsMessageComponent,
          }}
          name={name}
          id={id}
          isDisabled={isDisabled}
          debounceTimeout={500}
          value={value}
          loadOptions={asyncLoadOptions}
          onChange={(selectedOption) => {
            onChange(selectedOption);
            if (searchByPersonnelId) {
              setFieldValue("employeeId", selectedOption?.employeeId);
            }
          }}
          onBlur={(e) => {
            if (typeof setFieldTouched !== "undefined")
              setFieldTouched(name, true, true);
          }}
          additional={{ page: 0 }}
        />
      </div>
      {checkBoxes && Array.isArray(checkBoxes) && (
        <div
          style={{
            color: "hsl(0, 0%, 40%)",
            display: "inline-block",
            fontSize: 12,
            fontStyle: "italic",
            marginTop: "1em",
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
