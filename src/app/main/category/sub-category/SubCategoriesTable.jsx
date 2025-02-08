import GenericCrudTable from 'app/shared-components/data-table/GenericCrudTable.jsx';
import FusePageCarded from '@fuse/core/FusePageCarded/index.js';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import {
	useGetSubCategoriesQuery,
	useCreateSubCategoryMutation,
	useUpdateSubCategoryMutation,
	useDeleteSubCategoryMutation
} from './SubCategoriesApi.js';
import useThemeMediaQuery from '../../../../@fuse/hooks/useThemeMediaQuery.js';

function SubCategoriesTable() {
	const columns = [
		{
			header: 'شناسه',
			accessorKey: 'id',
			size: 10
		},
		{
			header: 'نام',
			accessorKey: 'name',
			size: 400
		},
		{
			header: 'نام انگلیسی',
			accessorKey: 'nameEn',
			size: 100
		},
		{
			header: 'ترتیب صفحه',
			accessorKey: 'pageOrder',
			size: 10
		},
		{
			header: 'شناسه دسته‌بندی',
			accessorKey: 'categoryId',
			size: 10
		},
		{
			header: 'دسته‌بندی',
			accessorKey: 'category',
			size: 100
		},
		{
			header: 'تاریخ ایجاد',
			accessorKey: 'createdAtStr',
			size: 80
		},
		{
			header: 'آخرین بروزرسانی',
			accessorKey: 'updatedAtStr',
			size: 80
		},
		{
			header: 'شرکت‌های در انتظار تایید',
			accessorKey: 'pendingCompanies',
			size: 250
		},
		{
			header: 'شرکت‌های تایید شده',
			accessorKey: 'verifiedCompanies',
			size: 50
		},
		{
			header: 'شرکت‌های رد شده',
			accessorKey: 'deniedCompanies',
			size: 50
		},
		{
			header: 'شرکت‌های جدید',
			accessorKey: 'newCompanies',
			size: 50
		},
		{
			header: 'شرکت‌های آرشیوشده',
			accessorKey: 'archivedCompanies',
			size: 50
		},
		{
			header: 'شرکت‌های حذف شده',
			accessorKey: 'deletedCompanies',
			size: 50
		},
		{
			header: 'شرکت‌های بروزرسانی شده',
			accessorKey: 'updatedCompanies',
			size: 250
		},
		{
			header: 'شرکت‌های منتشر شده',
			accessorKey: 'publishedCompanies',
			size: 50
		},
		{
			header: 'صفحه جزئیات',
			accessorKey: 'hasDetailsPage',
			size: 30,
			accessorFn: (row) => (row.hasDetailsPage ? 'دارد' : 'ندارد')
		}
	];

	const Root = styled(FusePageCarded)({
		'& .FusePageCarded-header': {},
		'& .FusePageCarded-toolbar': {},
		'& .FusePageCarded-content': {},
		'& .FusePageCarded-sidebarHeader': {},
		'& .FusePageCarded-sidebarContent': {}
	});

	// return (
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
	const [rightSidebarOpen, setRightSidebarOpen] = useState(!isMobile);
	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
		setRightSidebarOpen(!isMobile);
	}, [isMobile]);
	return (
		<GenericCrudTable
			columns={columns}
			// Provide the RTK Query hooks for listing and mutations
			useListQueryHook={useGetSubCategoriesQuery}
			useCreateMutationHook={useCreateSubCategoryMutation}
			useUpdateMutationHook={useUpdateSubCategoryMutation}
			useDeleteMutationHook={useDeleteSubCategoryMutation}
			saveToStore={false}
			enablePagination
			pagination={{ pageIndex: 1, pageSize: 10 }}
		/>
	);
}

export default SubCategoriesTable;
