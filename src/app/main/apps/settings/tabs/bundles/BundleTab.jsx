// import { Skeleton, Typography } from "@mui/material";
// import BankListCard from "./BankListCard";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import CustomSelect from "app/shared-components/custom-select/CustomSelect";
// import { AsyncPaginate } from "react-select-async-paginate";
// import { ConsoleLogger } from "aws-amplify/utils";
// import UserSelectOption from 'app/shared-components/custom-select-options/UserSelectOption';
// import { getServerFile } from "src/utils/string-utils";
// import { enqueueSnackbar } from "notistack";
//
//
// function BundlePageTab() {
// 	const [category, setCategory] = useState()
// 	const [loading, setLoading] = useState(false)
// 	const handleCategoryChange = (e) => {
// 		setCategory(e)
// 	}
// 	// const items = [
// 	// 	{
// 	// 		title: "بانک اطلاعات صنایع غذایی",
// 	// 		desc: "بانک اطلاعات تولیدکنندگان، ماشین‌آلات، ملزومات بسته‌بندی، موادافزودنی، لوازم آزمایشگاهی و ...",
// 	// 		updatedDate: "1403/04/20",
// 	// 		updatedTime: "22:10",
// 	// 		activeCount: 8,
// 	// 		variant: "media",
// 	// 	},
// 	// 	{
// 	// 		title: "بانک اطلاعات صنایع کشاورزی",
// 	// 		desc: "بانک اطلاعات تولیدکنندگان، ماشین‌آلات، ملزومات بسته‌بندی، موادافزودنی، لوازم آزمایشگاهی و ...",
// 	// 		updatedDate: "1403/04/20",
// 	// 		updatedTime: "22:10",
// 	// 		activeCount: 8,
// 	// 		variant: "media",
// 	// 	},
// 	// 	{
// 	// 		title: "بانک اطلاعات خدمات",
// 	// 		desc: "بانک اطلاعات تولیدکنندگان، ماشین‌آلات، ملزومات بسته‌بندی، موادافزودنی، لوازم آزمایشگاهی و ...",
// 	// 		updatedDate: "1403/04/20",
// 	// 		updatedTime: "22:10",
// 	// 		activeCount: 8,
// 	// 		variant: "media",
// 	// 	},
// 	// 	{
// 	// 		title: "بانک اطلاعات رسانه",
// 	// 		desc: "بانک اطلاعات تولیدکنندگان، ماشین‌آلات، ملزومات بسته‌بندی، موادافزودنی، لوازم آزمایشگاهی و ...",
// 	// 		updatedDate: "1403/04/20",
// 	// 		updatedTime: "22:10",
// 	// 		activeCount: 8,
// 	// 		variant: "media",
// 	// 	},
// 	// ];
//
// 	const [items, setItems] = useState([]);
//
// 	useEffect(() => {
// 		const getBundleSubCategories = async () => {
// 			try {
// 				setLoading(true)
// 				const response = await axios.get("/bundle/category/" + category.value);
// 				const result = response?.data?.data || [];
// 				setItems(result);
// 				setLoading(false)
// 			} catch (e) {
// 				setLoading(false)
// 				console.log("Error Getting Bundle Categories:" + e)
// 				const responseData = e?.response?.data || null;
// 				const defaultMessage = 'خطا در ارتباط با سرور';
// 				const apiMessage = responseData?.message || defaultMessage;
// 				const message = `خطا در انجام عملیات: ${apiMessage}`;
// 				enqueueSnackbar(message, {
// 								style: { backgroundColor: 'red', fontSize: 'medium' }
// 							});
// 				// throw e
// 			}
// 		};
// 		if (category)
// 			getBundleSubCategories();
// 	}, [category]);
//
// function CategorySelectOption(props) {
// 	const { data, innerProps, innerRef, isFocused, isSelected } = props;
// 	const avatarUrl = data.avatar && getServerFile(data.avatar);
// 	const onlineBadgeClass = data.isOnline ? "bg-green-500" : "bg-gray-500";
//
// 	return (
// 	  <div
// 		ref={innerRef}
// 		{...innerProps}
// 		className={`p-4 cursor-pointer flex flex-col border-b ${isFocused ? "bg-gray-100" : ""} ${isSelected ? "bg-blue-50" : ""}`}
// 	  >
// 	  <div>
// 		</div>
// 	  </div>
// 	);
//   }
//
// 	return (
// 		<div className="w-full max-w-4xl ">
// 			<Typography>بانک (دسته‌بندی)مورد نظر خود را انتخاب کنید.</Typography>
// 			<CustomSelect
// 						components={{
// 							CustomOption: CategorySelectOption,
// 						}}
// 						value={category}
// 						onChange={handleCategoryChange}
// 						className="mt-16 mb-16 sm:mx-4 font-400"
// 						setFieldValue={handleCategoryChange}
// 						url="/category/options"
// 						additionalParams={{ pageSize: 8 }}
// 						noOptionsMessage="بانک پیدا نشد"
// 						loadingMessage="در حال بارگذاری بانک‌ها..."
//
// 					/>
// 			<div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-32 w-full mt-40">
// 				{loading ? <Skeleton className="w-full" variant="rectangular" height={60} />
// 				: items.map((item, itemIndex) => (
// 					<BankListCard key={itemIndex} {...item} />
// 				))}
// 			</div>
// 		</div>
// 	);
// }
//
// export default BundlePageTab;

// import { Skeleton, Typography, Alert, Grid } from "@mui/material"
// import { useState, useEffect, useCallback, useMemo } from 'react';
// import InfiniteScroll from "react-infinite-scroll-component"
// import CustomSelect from "app/shared-components/custom-select/CustomSelect"
// import { enqueueSnackbar } from "notistack"
// import { components } from "react-select"
// import { useGetBundleSubCategoriesQuery } from "./store/bundleApi"
// import { useGetCategoryOptionsQuery } from "src/app/main/category/CategoriesApi"
// import BankListCard from "./BankListCard"
// import FuseSvgIcon from "@fuse/core/FuseSvgIcon"
//
// function BundleTab() {
// 	const [category, setCategory] = useState(null)
// 	const [items, setItems] = useState([])
// 	const [hasMore, setHasMore] = useState(true)
// 	const [pageNumber, setPageNumber] = useState(1)
// 	const [totalPages, setTotalPages] = useState(1);
// 	// const [isLoading, setIsLoading] = useState(false);
// 	// const hasMore = useMemo(() => pageNumber <= totalPages, [pageNumber, totalPages]);
// 	const [pagination, setPagination] = useState({
// 		pageNumber: 1,
// 		pageSize: 4, // Load 8 items per page
// 		hasMore: true,
// 	})
//
// 	// Redux Toolkit Query hooks
// 	const {
// 		data: categoriesData,
// 		isLoading: isCategoriesLoading,
// 		isError: isCategoriesError,
// 		refetch: refetchCategories,
// 	} = useGetCategoryOptionsQuery({
// 		pageNumber: 1,
// 		pageSize: 10, // Fetch more categories at once
// 	})
//
// 	const {
// 		data: subCategoriesData,
// 		isFetching: isSubCategoriesFetching,
// 		isLoading: isSubCategoriesLoading,
// 		isError: isSubCategoriesError,
// 		refetch: refetchSubCategories,
// 	} = useGetBundleSubCategoriesQuery(
// 		{
// 			categoryId: category?.value,
// 			pageNumber: pagination.pageNumber,
// 			pageSize: pagination.pageSize,
// 		},
// 		{
// 			skip: !category?.value,
// 		},
// 	)
//
// 	useEffect(() => {
// 		console.log(`SubCategoriesData: ${JSON.stringify(subCategoriesData)}`)
// 		if (subCategoriesData?.data && Array.isArray(subCategoriesData.data)) {
// 			if (pageNumber === 1) {
// 				setItems(subCategoriesData.data)
// 			} else {
// 				setItems((prevItems) => [...prevItems, ...subCategoriesData.data])
// 			}
//
// 			const newHasMore = subCategoriesData.data.length === pagination.pageSize
// 			console.log(`Has More: ${newHasMore}, Items received: ${subCategoriesData.data.length}`)
// 			setHasMore(newHasMore)
// 		}
// 	}, [subCategoriesData, pagination.pageNumber, pagination.pageSize, pagination.hasMore])
//
// 	// const loadUsers = useCallback(async () => {
// 	// 	if (isLoading) return;
// 	// 	setIsLoading(true);
// 	// 	try {
// 	// 		console.log(`Loading more data, current page: ${pageNumber}`)
// 	// 		if (hasMore) {
// 	// 			console.log(`Loading more data, current page: ${pageNumber}`)
// 	// 			setPagination((prevPagination) => prevPagination.pageNumber + 1)
// 	// 			refetchSubCategories()
// 	// 		}
// 	// 	} catch (err) {
// 	// 		console.error("خطا در واکشی لیست کاربران:", err);
// 	// 	} finally {
// 	// 		setIsLoading(false);
// 	// 	}
// 	//
// 	// }, [pageNumber, isLoading]);
//
//
// 	const loadMoreData = useCallback(async () => {
// 		console.log(`Loading more data, current page: ${pageNumber} or ${pagination.pageNumber}`)
// 		if (!isSubCategoriesLoading && hasMore) {
// 			console.log(`Loading more data, current page: ${pageNumber}`)
// 			setPagination((prevPagination) => {return {
// 				...prevPagination,
// 				pageNumber: prevPagination.pageNumber + 1
// 			}})
// 			refetchSubCategories()
// 		}
// 	}, [isSubCategoriesLoading, isSubCategoriesFetching, pagination.hasMore, hasMore, setPagination])
//
// 	function CategorySelectOption(props) {
// 		const { data, innerProps, innerRef, isFocused, isSelected } = props
// 		const color = data?.status === "ACTIVE" ? "secondary" : data?.status === "DISABLED" ? "error" : "warning"
//
// 		return (
// 			<div
// 				ref={innerRef}
// 				{...innerProps}
// 				className={`p-4 cursor-pointer flex flex-col border-b ${isFocused ? "bg-gray-100" : ""} ${isSelected ? "bg-blue-50" : ""}`}
// 			>
// 				<div className="flex items-center justify-between">
// 					<div className="flex items-center">
// 						<FuseSvgIcon>{data.icon}</FuseSvgIcon>
// 						<div>
// 							<div className="font-medium text-lg mt-8 ms-8">{data.label || data.title || ""}</div>
// 							{data.description && <div className="text-md text-gray-500 ms-8">{data.description}</div>}
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		)
// 	}
//
// 	function CategorySelectMenu(props) {
// 		return <components.Menu {...props} style={{ ...props.style }} className={`${props.className} font-sans`} />
// 	}
//
// 	// Load category options function for the select
// 	const loadCategoryOptions = async (search, prevOptions, { page }) => {
// 		try {
// 			// Manually refetch if needed
// 			if (categoriesData === undefined) {
// 				await refetchCategories()
// 			}
//
// 			const categories = categoriesData?.data || []
//
// 			// Filter the categories based on the search term
// 			let filteredCategories = categories
// 			if (search) {
// 				const searchLower = search.toLowerCase()
// 				filteredCategories = categories.filter(
// 					(category) =>
// 						(category.title && category.title.toLowerCase().includes(searchLower)) ||
// 						(category.label && category.label.toLowerCase().includes(searchLower)),
// 				)
// 			}
//
// 			// Paginate the filtered categories
// 			const pageSize = 10
// 			const startIndex = page * pageSize
// 			const endIndex = startIndex + pageSize
// 			const paginatedCategories = filteredCategories.slice(startIndex, endIndex)
//
// 			return {
// 				options: paginatedCategories,
// 				hasMore: endIndex < filteredCategories.length,
// 				additional: { page: page + 1 },
// 			}
// 		} catch (error) {
// 			console.error("Error loading category options:", error)
// 			return {
// 				options: [],
// 				hasMore: false,
// 				additional: { page },
// 			}
// 		}
// 	}
//
// 	const handleCategoryChange = (selectedOption) => {
// 		setCategory(selectedOption)
//
// 		// Reset pagination and items when category changes
// 		setPagination({
// 			pageNumber: 1,
// 			pageSize: 4,
// 			hasMore: true,
// 		})
// 		setPageNumber(1)
// 		setHasMore(true)
// 		setItems([])
// 	}
//
// 	// Handle API error
// 	useEffect(() => {
// 		if (isCategoriesError) {
// 			enqueueSnackbar("خطا در دریافت دسته‌بندی‌ها", {
// 				variant: "error",
// 				style: { backgroundColor: "red", fontSize: "medium" },
// 			})
// 		}
//
// 		if (isSubCategoriesError && category) {
// 			enqueueSnackbar("خطا در دریافت زیرشاخه‌ها", {
// 				variant: "error",
// 				style: { backgroundColor: "red", fontSize: "medium" },
// 			})
// 		}
// 	}, [isCategoriesError, isSubCategoriesError, category])
//
// 	const isLoading = isCategoriesLoading || isSubCategoriesLoading
//
// 	return (
// 		<div className="w-full max-w-4xl">
// 			<Typography variant="h6" className="mb-16">
// 				بانک (دسته‌بندی) مورد نظر خود را انتخاب کنید.
// 			</Typography>
//
// 			<CustomSelect
// 				customComponents={{
// 					CustomOption: CategorySelectOption,
// 					CustomMenu: CategorySelectMenu,
// 				}}
// 				value={category}
// 				onChange={handleCategoryChange}
// 				className="mt-16 mb-32 sm:mx-4 font-400"
// 				setFieldValue={handleCategoryChange}
// 				loadOptions={loadCategoryOptions}
// 				noOptionsMessage="بانک پیدا نشد"
// 				loadingMessage="در حال بارگذاری بانک‌ها..."
// 				isDisabled={isCategoriesLoading}
// 			/>
//
// 			{isCategoriesLoading && pageNumber === 1 ? (
// 				<Grid container spacing={3} className="mt-16">
// 					{[1, 2, 3, 4].map((item) => (
// 						<Grid item xs={12} sm={6} key={item}>
// 							<Skeleton variant="rectangular" height={240} />
// 						</Grid>
// 					))}
// 				</Grid>
// 			) : !category ? (
// 				<Alert severity="info" className="mt-32">
// 					لطفا یک دسته‌بندی را انتخاب کنید.
// 				</Alert>
// 			) : items.length === 0 && !isLoading ? (
// 				<Alert severity="warning" className="mt-32">
// 					هیچ زیرشاخه‌ای برای این دسته‌بندی یافت نشد.
// 				</Alert>
// 			) : (
// 				<InfiniteScroll
// 					dataLength={items.length}
// 					next={async () => {
// 						console.log(pagination.hasMore + " Calling Next fn: " + hasMore)
// 						await loadMoreData()
// 					}}
// 					hasMore={hasMore}
// 					loader={
// 						<Grid container spacing={3} className="mt-16">
// 							{[1, 2].map((item) => (
// 								<Grid item xs={12} sm={6} key={`loader-${item}`}>
// 									<Skeleton variant="rectangular" height={240} />
// 								</Grid>
// 							))}
// 						</Grid>
// 					}
//
// 					endMessage={
// 						<Typography variant="body2" className="text-center my-16 text-gray-500">
// 							همه موارد نمایش داده شده است
// 						</Typography>
// 					}
// 				>
// 					<Grid container spacing={3} className="mt-16">
// 						{items.map((item, index) => (
// 							<Grid item xs={12} sm={6} md={6} key={`${item.subCategoryId}-${index}`}>
// 								<BankListCard
// 									subCategoryId={item.subCategoryId}
// 									title={item.title}
// 									desc={item.desc}
// 									updatedDate={item.updatedDate}
// 									updatedTime={item.updatedTime}
// 									activeCount={item.activeCount}
// 									variant={item.variant}
// 								/>
// 							</Grid>
// 						))}
// 					</Grid>
// 				</InfiniteScroll>
// 			)}
// 		</div>
// 	)
// }
//
// export default BundleTab
//
//



// import { Skeleton, Typography, Alert, Grid } from '@mui/material';
// import { useState, useEffect, useCallback } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import CustomSelect from 'app/shared-components/custom-select/CustomSelect';
// import { enqueueSnackbar } from 'notistack';
// import { components } from 'react-select';
// import {
// 	useGetBundleSubCategoriesQuery
// } from './store/bundleApi';
// import { useGetCategoryOptionsQuery } from 'src/app/main/category/CategoriesApi';
// import BankListCard from './BankListCard';
// import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
// import axios from 'axios';
//
// function BundleTab() {
// 	const [category, setCategory] = useState(null);
// 	const [items, setItems] = useState([]);
// 	const [hasMore, setHasMore] = useState(true);
// 	const [pagination, setPagination] = useState({
// 		pageNumber: 1,
// 		pageSize: 8, // Load 8 items per page
// 		hasMore: true
// 	});
//
// 	// Redux Toolkit Query hooks
// 	const {
// 		data: categoriesData,
// 		isLoading: isCategoriesLoading,
// 		isError: isCategoriesError,
// 		refetch: refetchCategories
// 	} = useGetCategoryOptionsQuery({
// 		pageNumber: 1,
// 		pageSize: 20 // Fetch more categories at once
// 	});
//
// 	const {
// 		data: subCategoriesData,
// 		isLoading: isSubCategoriesLoading,
// 		isError: isSubCategoriesError,
// 		refetch: refetchSubCategories
// 	} = useGetBundleSubCategoriesQuery({
// 		categoryId: category?.value,
// 		pageNumber: pagination.pageNumber,
// 		pageSize: pagination.pageSize
// 	}, {
// 		skip: !category?.value
// 	});
// 	//
// 	// const loadData = () => useCallback(() => {
// 	// 	console.log(`SubCategoriesData: ${JSON.stringify(subCategoriesData.data)} and isArray: ${Array.isArray(subCategoriesData.data)}`);
// 	// 	if (isLoading) return
// 	//
// 	// 	if (subCategoriesData?.data && Array.isArray(subCategoriesData.data)) {
// 	// 		if (pagination.pageNumber === 1) {
// 	// 			setItems(subCategoriesData.data);
// 	// 		} else {
// 	// 			setItems(prevItems => [...prevItems, ...subCategoriesData.data]);
// 	// 		}
// 	//
// 	// 		// Update hasMore flag based on returned data length
// 	// 		console.log('Has More inside: ' + pagination.hasMore);
// 	// 		// setHasMore(subCategoriesData.data.length === pagination.pageSize);
// 	// 		setPagination(prev => ({
// 	// 			...prev,
// 	// 			hasMore: subCategoriesData.data.length === pagination.pageSize
// 	// 		}));
// 	//
// 	// 	}
// 	// }, [subCategoriesData, pagination.pageNumber, pagination.pageSize])
	// const loadData = async () => {
	//
	// }
	// // Update items when data is fetched
	// useEffect(() => {
	// 	loadData();
	// }, []);
	// console.log('Has More: ' + pagination.hasMore);

	// const loadUsers = useCallback(async () => {
	// 	if (isLoadingUsers) return;
	// 	setIsLoadingUsers(true);
	// 	try {
	// 		const res = await axios.get("/user/options", {
	// 			params: {
	// 				pageSize: 10,
	// 				pageNumber, // starts from 1
	// 			},
	// 		});
	// 		if (res.data.status === "SUCCESS") {
	// 			const { data, pagination } = res.data;
	// 			// data is an array of user objects: { label, value, username, avatar }
	// 			// pagination: { pageSize, pageNumber, totalPages, totalItems }
	// 			setUsers((prev) => [...prev, ...data]);
	// 			setPageNumber(pagination.pageNumber + 1);
	// 			setTotalPages(pagination.totalPages);
	// 		}
	// 	} catch (err) {
	// 		console.error("خطا در واکشی لیست کاربران:", err);
	// 	} finally {
	// 		setIsLoadingUsers(false);
	// 	}
	// }, [pageNumber, isLoadingUsers]);
	// Handle loading next page
// 	const loadMoreData = useCallback(() => {
// 		console.log(`In load more data, isSubCategoriesLoading: ${isSubCategoriesLoading}, pagination: ${JSON.stringify(pagination)} and data: ${JSON.stringify(subCategoriesData)} `);
//
// 		setPagination(prev => ({
// 			...prev,
// 			pageNumber: prev.pageNumber + 1
// 		}));
// 	}, [isSubCategoriesLoading, pagination.hasMore]);
//
// 	function CategorySelectOption(props) {
// 		const { data, innerProps, innerRef, isFocused, isSelected } = props;
// 		const color = data?.status === 'ACTIVE' ? 'secondary' :
// 			data?.status === 'DISABLED' ? 'error' : 'warning';
//
// 		return (
// 			<div
// 				ref={innerRef}
// 				{...innerProps}
// 				className={`p-4 cursor-pointer flex flex-col border-b ${isFocused ? 'bg-gray-100' : ''} ${isSelected ? 'bg-blue-50' : ''}`}
// 			>
// 				<div className="flex items-center justify-between">
// 					<div className="flex items-center">
// 						<FuseSvgIcon>{data.icon}</FuseSvgIcon>
// 						<div>
// 							<div className="font-medium text-lg mt-8 ms-8">
// 								{data.label || data.title || ''}
// 							</div>
// 							{data.description && (
// 								<div className="text-md text-gray-500 ms-8">
// 									{data.description}
// 								</div>
// 							)}
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}
//
// 	function CategorySelectMenu(props) {
// 		return (
// 			<components.Menu
// 				{...props}
// 				style={{ ...props.style }}
// 				className={`${props.className} font-sans`}
// 			/>
// 		);
// 	}
//
// 	// Load category options function for the select
// 	const loadCategoryOptions = async (search, prevOptions, { page }) => {
// 		try {
// 			// Manually refetch if needed
// 			if (categoriesData === undefined) {
// 				await refetchCategories();
// 			}
//
// 			const categories = categoriesData?.data || [];
//
// 			// Filter the categories based on the search term
// 			let filteredCategories = categories;
// 			if (search) {
// 				const searchLower = search.toLowerCase();
// 				filteredCategories = categories.filter((category) =>
// 					(category.title && category.title.toLowerCase().includes(searchLower)) ||
// 					(category.label && category.label.toLowerCase().includes(searchLower))
// 				);
// 			}
//
// 			const pageSize = 10;
// 			const startIndex = page * pageSize;
// 			const endIndex = startIndex + pageSize;
// 			const paginatedCategories = filteredCategories.slice(startIndex, endIndex);
//
// 			return {
// 				options: paginatedCategories,
// 				hasMore: endIndex < filteredCategories.length,
// 				additional: { page: page + 1 }
// 			};
// 		} catch (error) {
// 			console.error('Error loading category options:', error);
// 			return {
// 				options: [],
// 				hasMore: false,
// 				additional: { page }
// 			};
// 		}
// 	};
//
// 	const handleCategoryChange = (selectedOption) => {
// 		setCategory(selectedOption);
//
// 		setPagination({
// 			pageNumber: 1,
// 			pageSize: 8,
// 			hasMore: true
// 		});
// 		setItems([]);
// 	};
//
// 	// Handle API error
// 	useEffect(() => {
// 		if (isCategoriesError) {
// 			enqueueSnackbar('خطا در دریافت دسته‌بندی‌ها', {
// 				variant: 'error',
// 				style: { backgroundColor: 'red', fontSize: 'medium' }
// 			});
// 		}
//
// 		if (isSubCategoriesError && category) {
// 			enqueueSnackbar('خطا در دریافت زیرشاخه‌ها', {
// 				variant: 'error',
// 				style: { backgroundColor: 'red', fontSize: 'medium' }
// 			});
// 		}
// 	}, [isCategoriesError, isSubCategoriesError, category]);
//
// 	const isLoading = isCategoriesLoading || isSubCategoriesLoading;
//
// 	return (
// 		<div className="w-full max-w-4xl">
// 			<Typography variant="h6" className="mb-16">بانک (دسته‌بندی) مورد نظر خود را انتخاب کنید.</Typography>
//
// 			<CustomSelect
// 				customComponents={{
// 					CustomOption: CategorySelectOption,
// 					CustomMenu: CategorySelectMenu
// 				}}
// 				value={category}
// 				onChange={handleCategoryChange}
// 				className="mt-16 mb-32 sm:mx-4 font-400"
// 				setFieldValue={handleCategoryChange}
// 				loadOptions={loadCategoryOptions}
// 				noOptionsMessage="بانک پیدا نشد"
// 				loadingMessage="در حال بارگذاری بانک‌ها..."
// 				isDisabled={isCategoriesLoading}
// 			/>
//
// 			{isLoading && pagination.pageNumber === 1 ? (
// 				<Grid container spacing={3} className="mt-16">
// 					{[1, 2, 3, 4].map((item) => (
// 						<Grid item xs={12} sm={6} key={item}>
// 							<Skeleton variant="rectangular" height={240} />
// 						</Grid>
// 					))}
// 				</Grid>
// 			) : !category ? (
// 				<Alert severity="info" className="mt-32">
// 					لطفا یک دسته‌بندی را انتخاب کنید.
// 				</Alert>
// 			) : items.length === 0 && !isLoading ? (
// 				<Alert severity="warning" className="mt-32">
// 					هیچ زیرشاخه‌ای برای این دسته‌بندی یافت نشد.
// 				</Alert>
// 			) : (
// 				<InfiniteScroll
// 					dataLength={items.length}
// 					next={loadData.call}
// 					hasMore={hasMore}
// 					loader={
// 						<Grid container spacing={3} className="mt-16">
// 							{[1, 2].map((item) => (
// 								<Grid item xs={12} sm={6} key={`loader-${item}`}>
// 									<Skeleton variant="rectangular" height={240} />
// 								</Grid>
// 							))}
// 						</Grid>
// 					}
// 					endMessage={
// 						<Typography
// 							variant="body2"
// 							className="text-center my-16 text-gray-500"
// 						>
// 							همه موارد نمایش داده شده است
// 						</Typography>
// 					}
// 				>
// 					<Grid container spacing={3} className="mt-16">
// 						{items.map((item, index) => (
// 							<Grid item xs={12} sm={6} md={6} key={`${item.subCategoryId}-${index}`}>
// 								<BankListCard
// 									subCategoryId={item.subCategoryId}
// 									title={item.title}
// 									desc={item.desc}
// 									updatedDate={item.updatedDate}
// 									updatedTime={item.updatedTime}
// 									activeCount={item.activeCount}
// 									variant={item.variant}
// 								/>
// 							</Grid>
// 						))}
// 					</Grid>
// 				</InfiniteScroll>
// 			)}
// 		</div>
// 	);
// }
//
// export default BundleTab;


import { Skeleton, Typography, Alert, Grid, Button, CircularProgress } from "@mui/material"
import { useState, useEffect, useRef } from "react"
import CustomSelect from "app/shared-components/custom-select/CustomSelect"
import { enqueueSnackbar } from "notistack"
import { useGetBundleSubCategoriesQuery } from "./store/bundleApi"
import { components } from "react-select"
import { useGetCategoryOptionsQuery } from "src/app/main/category/CategoriesApi"
import FuseSvgIcon from "@fuse/core/FuseSvgIcon"
import { motion, useInView } from "framer-motion"
import BankListCard from "./BankListCard"

function BundleTab() {
  const [category, setCategory] = useState(null)
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  })
  const [allSubCategories, setAllSubCategories] = useState([])
  const [hasMore, setHasMore] = useState(true)

  // Add these lines for the button functionality
  const buttonRef = useRef(null)
  const isInView = useInView(buttonRef, { once: false, amount: 0.1 })

  // Redux Toolkit Query hooks
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useGetCategoryOptionsQuery({
    pageNumber: 1,
    pageSize: 10,
  })

  const {
    data: subCategoriesData,
    isLoading: isSubCategoriesLoading,
    isFetching: isSubCategoriesFetching,
    isError: isSubCategoriesError,
  } = useGetBundleSubCategoriesQuery(
    {
      categoryId: category?.value,
      pageNumber: pagination.pageNumber,
      pageSize: pagination.pageSize,
    },
    {
      skip: !category?.value,
    },
  )

  // Extract data
  const subCategories = subCategoriesData?.data || []
  const totalCount = subCategoriesData?.totalElements || 0
  const isLoading = isCategoriesLoading || isSubCategoriesLoading

  // Update allSubCategories when new data is fetched
  useEffect(() => {
    if (subCategories.length > 0) {
      // If it's the first page, replace the data
      if (pagination.pageNumber === 1) {
        setAllSubCategories(subCategories)
      } else {
        // Otherwise, append the new data
        setAllSubCategories((prev) => {
          // Filter out duplicates by subCategoryId
          const existingIds = new Set(prev.map((item) => item.subCategoryId))
          const newItems = subCategories.filter((item) => !existingIds.has(item.subCategoryId))
          return [...prev, ...newItems]
        })
      }

      // Check if there's more data to load
      setHasMore(allSubCategories.length < totalCount)
    }
  }, [subCategories, pagination.pageNumber, totalCount])

  // Function to load more data
  const loadMoreData = () => {
    if (!isSubCategoriesLoading && hasMore) {
      setPagination((prev) => ({
        ...prev,
        pageNumber: prev.pageNumber + 1,
      }))
    }
  }

  // Custom option component for the select
  function CategorySelectOption(props) {
    const { data, innerProps, innerRef, isFocused, isSelected } = props
    const color = data?.status === "ACTIVE" ? "secondary" : data?.status === "DISABLED" ? "error" : "warning"

    return (
      <div
        ref={innerRef}
        {...innerProps}
        className={`p-4 cursor-pointer flex flex-col border-b ${isFocused ? "bg-gray-100" : ""} ${isSelected ? "bg-blue-50" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FuseSvgIcon>{data.icon}</FuseSvgIcon>
            <div>
              <div className="font-medium text-lg mt-8 ms-8">{data.label || data.title || ""}</div>
              {data.description && <div className="text-md text-gray-500 ms-8">{data.description}</div>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Custom menu component for the select
  function CategorySelectMenu(props) {
    return <components.Menu {...props} style={{ ...props.style }} className={`${props.className} font-sans`} />
  }

  // Custom load options function for the select
  const loadCategoryOptions = async (search, prevOptions, { page }) => {
    try {
      // Manually refetch if needed
      if (categoriesData === undefined) {
        await refetchCategories()
      }

      const categories = categoriesData?.data || []

      // Filter the categories based on the search term
      let filteredCategories = categories
      if (search) {
        const searchLower = search.toLowerCase()
        filteredCategories = categories.filter(
          (category) =>
            (category.title && category.title.toLowerCase().includes(searchLower)) ||
            (category.label && category.label.toLowerCase().includes(searchLower)),
        )
      }

      // Paginate the filtered categories
      const pageSize = 10
      const startIndex = page * pageSize
      const endIndex = startIndex + pageSize
      const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

      return {
        options: paginatedCategories,
        hasMore: endIndex < filteredCategories.length,
        additional: { page: page + 1 },
      }
    } catch (error) {
      console.error("Error loading category options:", error)
      return {
        options: [],
        hasMore: false,
        additional: { page },
      }
    }
  }

  const handleCategoryChange = (selectedOption) => {
    setCategory(selectedOption)

    // Reset pagination and accumulated data when category changes
    setPagination({
      pageNumber: 1,
      pageSize: 10,
    })
    setAllSubCategories([])
    setHasMore(true)
  }

  // Handle API error
  useEffect(() => {
    if (isCategoriesError) {
      enqueueSnackbar("خطا در دریافت دسته‌بندی‌ها", {
        variant: "error",
        style: { backgroundColor: "red", fontSize: "medium" },
      })
    }

    if (isSubCategoriesError && category) {
      enqueueSnackbar("خطا در دریافت زیرشاخه‌ها", {
        variant: "error",
        style: { backgroundColor: "red", fontSize: "medium" },
      })
    }
  }, [isCategoriesError, isSubCategoriesError, category])

  return (
    <div className="w-full max-w-4xl">
      <Typography variant="h6" className="mb-16">
        بانک (دسته‌بندی) مورد نظر خود را انتخاب کنید.
      </Typography>

      <CustomSelect
        customComponents={{
          CustomOption: CategorySelectOption,
          CustomMenu: CategorySelectMenu,
        }}
        value={category}
        onChange={handleCategoryChange}
        className="mt-16 mb-32 sm:mx-4 font-400"
        setFieldValue={handleCategoryChange}
        loadOptions={loadCategoryOptions}
        noOptionsMessage="بانک پیدا نشد"
        loadingMessage="در حال بارگذاری بانک‌ها..."
        isDisabled={isCategoriesLoading}
      />

      {isLoading && pagination.pageNumber === 1 ? (
        <Grid container spacing={3} className="mt-16">
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} key={item}>
              <Skeleton variant="rectangular" height={240} />
            </Grid>
          ))}
        </Grid>
      ) : !category ? (
        <Alert severity="info" className="mt-32">
          لطفا یک دسته‌بندی را انتخاب کنید.
        </Alert>
      ) : allSubCategories.length === 0 ? (
        <Alert severity="warning" className="mt-32">
          هیچ زیرشاخه‌ای برای این دسته‌بندی یافت نشد.
        </Alert>
      ) : (
        <>
          <Grid container spacing={3} className="mt-16">
            {allSubCategories.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={`${item.subCategoryId}-${index}`}>
                <BankListCard
                  subCategoryId={item.subCategoryId}
                  title={item.title}
                  desc={item.desc}
                  updatedDate={item.updatedDate}
                  updatedTime={item.updatedTime}
                  activeCount={item.activeCount}
                  variant={item.variant}
                />
              </Grid>
            ))}
          </Grid>

          {/* Load More Button - Only show if there's more data and not currently loading */}
          {hasMore && (
            <div className="flex justify-center my-32">
              {/* <motion.div
                ref={buttonRef}
                initial={{ y: 50, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                transition={{
                  type: "Slide",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.5,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              > */}
              {(isSubCategoriesLoading || isSubCategoriesFetching) ? <CircularProgress />  :
                (<Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={loadMoreData}
                  hidden={isSubCategoriesLoading || isSubCategoriesFetching}
                  disabled={isSubCategoriesLoading || isSubCategoriesFetching}
                  className="px-24 py-12 text-16"
                >
                  {isSubCategoriesLoading ? "در حال بارگذاری..." : "نمایش بیشتر"}
                </Button>)}
              {/* </motion.div> */}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BundleTab



// import { Skeleton, Typography, Alert, Grid } from "@mui/material";
// import BankListCard from "./BankListCard";
// import { useState, useEffect } from "react";
// import CustomSelect from "app/shared-components/custom-select/CustomSelect";
// import { enqueueSnackbar } from "notistack";
// import { useGetBundleCategoriesQuery, useGetBundleSubCategoriesQuery } from "./store/bundleApi";
// import BadgeAvatar from "app/shared-components/badge-avatar/BadgeAvatar";
// import { components } from "react-select";
// import { useGetCategoryOptionsQuery } from "src/app/main/category/CategoriesApi";
// import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

// function BundlePageTab() {
//   const [category, setCategory] = useState(null);
//   const [pagination, setPagination] = useState({
//     pageNumber: 1,
//     pageSize: 10
//   });

//   // Redux Toolkit Query hooks
//   const {
//     data: categoriesData,
//     isLoading: isCategoriesLoading,
//     isError: isCategoriesError,
//     refetch: refetchCategories
//   } = useGetCategoryOptionsQuery({
//     pageNumber: 1,
//     pageSize: 10
//   });

//   const {
//     data: subCategoriesData,
//     isLoading: isSubCategoriesLoading,
//     isError: isSubCategoriesError
//   } = useGetBundleSubCategoriesQuery({
//     categoryId: category?.value,
//     pageNumber: pagination.pageNumber,
//     pageSize: pagination.pageSize
//   }, {
//     skip: !category?.value
//   });

//   // Extract data
//   const subCategories = subCategoriesData?.data || [];
//   const isLoading = isCategoriesLoading || isSubCategoriesLoading;

//   // Custom option component for the select
//   function CategorySelectOption(props) {
//     const { data, innerProps, innerRef, isFocused, isSelected } = props;
//     const color = data?.status === "ACTIVE" ? "secondary" :
//                  data?.status === "DISABLED" ? "error" : 'warning';

//     return (
//       <div
//         ref={innerRef}
//         {...innerProps}
//         className={`p-4 cursor-pointer flex flex-col border-b ${isFocused ? "bg-gray-100" : ""} ${isSelected ? "bg-blue-50" : ""}`}
//       >
//         <div className="flex items-center justify-between">
//           <div className="flex items-center">
//            <FuseSvgIcon>{data.icon}</FuseSvgIcon>
//             <div>
//               <div className="font-medium text-lg mt-8 ms-8">
//                 {data.label || data.title || ""}
//               </div>
//               {data.description && (
//                 <div className="text-md text-gray-500 ms-8">
//                   {data.description}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Custom menu component for the select
//   function CategorySelectMenu(props) {
//     return (
//       <components.Menu
//         {...props}
//         style={{ ...props.style }}
//         className={`${props.className} font-sans`}
//       />
//     );
//   }

//   // Custom load options function for the select
//   const loadCategoryOptions = async (search, prevOptions, { page }) => {
//     try {
//       // Manually refetch if needed
//       if (categoriesData === undefined) {
//         await refetchCategories();
//       }

//       const categories = categoriesData?.data || [];

//       // Filter the categories based on the search term
//       let filteredCategories = categories;
//       if (search) {
//         const searchLower = search.toLowerCase();
//         filteredCategories = categories.filter((category) =>
//           (category.title && category.title.toLowerCase().includes(searchLower)) ||
//           (category.label && category.label.toLowerCase().includes(searchLower))
//         );
//       }

//       // Paginate the filtered categories
//       const pageSize = 10;
//       const startIndex = page * pageSize;
//       const endIndex = startIndex + pageSize;
//       const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

//       return {
//         options: paginatedCategories,
//         hasMore: endIndex < filteredCategories.length,
//         additional: { page: page + 1 }
//       };
//     } catch (error) {
//       console.error("Error loading category options:", error);
//       return {
//         options: [],
//         hasMore: false,
//         additional: { page }
//       };
//     }
//   };

//   const handleCategoryChange = (selectedOption) => {
//     setCategory(selectedOption);

//     // Reset pagination when category changes
//     setPagination({
//       pageNumber: 1,
//       pageSize: 10
//     });
//   };

//   // Handle API error
//   useEffect(() => {
//     if (isCategoriesError) {
//       enqueueSnackbar('خطا در دریافت دسته‌بندی‌ها', {
//         variant: 'error',
//         style: { backgroundColor: 'red', fontSize: 'medium' }
//       });
//     }

//     if (isSubCategoriesError && category) {
//       enqueueSnackbar('خطا در دریافت زیرشاخه‌ها', {
//         variant: 'error',
//         style: { backgroundColor: 'red', fontSize: 'medium' }
//       });
//     }
//   }, [isCategoriesError, isSubCategoriesError, category]);

//   return (
//     <div className="w-full max-w-4xl">
//       <Typography variant="h6" className="mb-16">بانک (دسته‌بندی) مورد نظر خود را انتخاب کنید.</Typography>

//       <CustomSelect
//         customComponents={{
//           CustomOption: CategorySelectOption,
//           CustomMenu: CategorySelectMenu
//         }}
//         value={category}
//         onChange={handleCategoryChange}
//         className="mt-16 mb-32 sm:mx-4 font-400"
//         setFieldValue={handleCategoryChange}
//         loadOptions={loadCategoryOptions}
//         noOptionsMessage="بانک پیدا نشد"
//         loadingMessage="در حال بارگذاری بانک‌ها..."
//         isDisabled={isCategoriesLoading}
//       />

//       {isLoading ? (
//         <Grid container spacing={3} className="mt-16">
//           {[1, 2, 3, 4].map((item) => (
//             <Grid item xs={12} sm={6} key={item}>
//               <Skeleton variant="rectangular" height={240} />
//             </Grid>
//           ))}
//         </Grid>
//       ) : !category ? (
//         <Alert severity="info" className="mt-32">
//           لطفا یک دسته‌بندی را انتخاب کنید.
//         </Alert>
//       ) : subCategories.length === 0 ? (
//         <Alert severity="warning" className="mt-32">
//           هیچ زیرشاخه‌ای برای این دسته‌بندی یافت نشد.
//         </Alert>
//       ) : (
//         <Grid container spacing={3} className="mt-16">
//           {subCategories.map((item, index) => (
//             <Grid item xs={12} sm={6} md={6} key={index}>
//               <BankListCard
//                 subCategoryId={item.subCategoryId}
//                 title={item.title}
//                 desc={item.desc}
//                 updatedDate={item.updatedDate}
//                 updatedTime={item.updatedTime}
//                 activeCount={item.activeCount}
//                 variant={item.variant}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </div>
//   );
// }

// export default BundlePageTab;
