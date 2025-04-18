import FuseScrollbars from "@fuse/core/FuseScrollbars/index.js";
import { Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import EntityStatusField from "app/shared-components/data-table/EntityStatusField.jsx";
import GenericCrudTable from "app/shared-components/data-table/GenericCrudTable.jsx";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getServerFile } from "src/utils/string-utils";
import {
  useCreateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetSubscriptionsQuery,
  useUpdateSubscriptionMutation,
} from "./SubscriptionsApi";
import Button from '@mui/material/Button';
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import axios from "axios";
import CustomUniformsAsyncSelect from "app/shared-components/dynamic-field-generator/CustomUniformsAsyncSelect";
import { z } from "zod";
import { AiOutlineBgColors } from "react-icons/ai";
import { IoEllipsisHorizontalCircleOutline } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { InfoOutlined } from "@mui/icons-material";

const mockBundles = [
  {
    label: "پلن یک ماهه",
    value: 1,
  },
  {
    label: "پلن دو ماهه",
    value: 2,
  },
  {
    label: "پلن سه ماهه",
    value: 3,
  },
];
const loadBundles = async () => {
  // const result = await axios.get("/bundle/subcategory/"); // TODO: Use bundle options endpoint (create if not exists)
  // const data = result?.data?.data || [];
  const data = mockBundles;
  const res = data.map((d) => {
    return { label: d.name, value: d.id };
  });
  console.log(res);
  return res;
};
function SubscriptionTable() {
  const handleCreate = async (vals) => {
    // setLoading(true);
    const data = _.clone(vals);
    // await createCategory(vals).unwrap();
    data.categoryStatus = vals.categoryStatus === "فعال" ? 1 : 2;
    await createCategory(data);
    // T0D0: HANDLE FIELD VALIDATION
    // const response = await createCategory(data);
    // return response && !response.error;
    return true;
    // setLoading(false);
    // alert(`Create: ${JSON.stringify(data)}`);
  };
  const createItemProps = {
    zodSchema: z.object({
      bundleId: z
        .number({
          required_error: "این فیلد الزامی است",
          invalid_type_error: "فرمت داده ورودی اشتباه است",
          message: "مقدار انتخاب شده معتبر نیست",
        })
        .uniforms({
          displayName: "پلن",
          label: "پلن",
          placeholder: "پلن را انتخاب کنید",
          loadOptions: loadBundles,
          component: CustomUniformsAsyncSelect,
        }),
      nameEn: z
        .string({
          invalid_type_error: "فرمت داده ورودی اشتباه است",
          required_error: "این فیلد الزامی است",
        })
        .min(1, { message: "این فیلد الزامی است" })
        .uniforms({
          displayName: "نام انگلیسی",
          label: "نام انگلیسی دسته‌بندی",
          placeholder: "نام انگلیسی دسته‌بندی را وارد کنید",
        }),
      categoryStatus: z
        .enum(["فعال", "غیرفعال"], {
          required_error: "این فیلد الزامی است",
          invalid_type_error: "فرمت داده ورودی اشتباه است",
          message: "مقدار انتخاب شده معتبر نیست",
        })
        .uniforms({
          displayName: "وضعیت دسته‌بندی",
          label: "وضعیت دسته‌بندی",
          placeholder: "وضعیت دسته‌بندی را انتخاب کنید",
        }),
      pageOrder: z
        .number({
          invalid_type_error: "فرمت داده ورودی اشتباه است",
          required_error: "این فیلد الزامی است",
        })
        .min(1, { message: "حداقل مقدار برای این فیلد ۱ است" })
        .uniforms({
          displayName: "ترتیب صفحه",
          label: "ترتیب صفحه دسته‌بندی",
          placeholder: "اولویت نمایش دسته‌بندی در سایت اصلی را انتخاب کنید",
        }),
      // name: z
      // 	.string( { errorMap: () => ( { message: 'Name must be between 3 to 20 characters' } ) } )
      // 	.min( 3 )
      // 	.max( 20 )
    }),
    jsonSchema: {
      title: "دسته‌بندی",
      type: "object",
      properties: {
        name: {
          type: "string",
          title: "نام دسته‌بندی",
          message: { required: "فیلد مساحت ساختمان الزامی است" },
        },
        nameEn: {
          type: "string",
          title: "نام انگلیسی دسته‌بندی",
        },
        categoryStatus: {
          type: "string",
          title: "وضعیت دسته‌بندی",
          description: "وضعیت دسته‌بندی را انتخاب کنید",
          uniforms: {
            options: [
              { label: "فعال", value: "1" },
              { label: "غیرفعال", value: "2" },
            ],
          },
        },
        pageOrder: {
          type: "number",
          title: "ترتیب صفحه",
          min: 1,
        },
        profession: {
          type: "string",
          options: [
            {
              label: "Developer",
              value: "developer",
            },
            {
              label: "Tester",
              value: "tester",
            },
            {
              label: "Product owner",
              value: "product-owner",
            },
            {
              label: "Project manager",
              value: "project-manager",
            },
            {
              label: "Businessman",
              value: "businessman",
            },
          ],
        },
        // products: {
        // 	type: 'array',
        // 	title: 'محصولات و خدمات',
        // 	items: {
        // 		type: 'object',
        // 		properties: {
        // 			name: {
        // 				type: 'string',
        // 				title: 'نام محصول'
        // 			},
        // 			description: {
        // 				type: 'string',
        // 				title: 'توضیحات محصول'
        // 			},
        // 			// otherTypeName: {
        // 			// 	type: 'string',
        // 			// 	title: 'Other Type Name',
        // 			// 	description: 'If categoryType is something custom, store it here'
        // 			// },
        // 			categoryType: {
        // 				type: 'string',
        // 				title: 'دسته‌بندی محصول'
        // 			},
        // 			showProduct: {
        // 				type: 'boolean',
        // 				title: 'نمایش در صفحه اختصاصی؟'
        // 			},
        // 			pictures: {
        // 				type: 'array',
        // 				title: 'تصاویر',
        // 				items: {
        // 					type: 'object',
        // 					properties: {
        // 						url: {
        // 							type: 'string',
        // 							uniforms: { component: ImageField },
        // 							title: 'آدرس عکس آپلود شده'
        // 						},
        // 						description: { type: 'string', title: 'توضیحات عکس' }
        // 					}
        // 				}
        // 			}
        // 		}
        // 	}
        // }
      },
      required: ["name", "nameEn", "categoryStatus", "pageOrder"],
    },
    formHeaderTitle: "ثبت دسته‌بندی جدید",
    defaultValues: { name: "", nameEn: "", categoryStatus: "0", pageOrder: 0 },
    formEngine: "UNIFORMS",
    formValidationStruct: "ZOD_SCHEMA",
    formGenerationType: "MANUAL",
    hideSubmitField: false,
    formFieldsInputTypes: {
      name: {
        label: "نام",
        inputType: "TextField",
        renderCustomInput: false,
        classes: "mt-10",
        styles: null,
        props: {
          fullWidth: true,
        },
      },
      nameEn: {
        label: "نام انگلیسی",
        inputType: "TextField",
        renderCustomInput: false,
        classes: "mt-10",
        styles: null,
        props: {
          fullWidth: true,
        },
      },
      categoryStatus: {
        label: "وضعیت",
        inputType: "Select",
        renderCustomInput: false,
        classes: "mt-10",
        styles: null,
        options: [
          {
            label: "Developer",
            value: "developer",
          },
          {
            label: "Tester",
            value: "tester",
          },
          {
            label: "Product owner",
            value: "product-owner",
          },
          {
            label: "Project manager",
            value: "project-manager",
          },
          {
            label: "Businessman",
            value: "businessman",
          },
        ],
        props: {
          fullWidth: true,
        },
      },
      // description: {
      // 	label: "توضیحات",
      // 	inputType: "TextField",
      // 	renderCustomInput: false,
      // 	classes: "mt-10",
      // 	styles: null,
      // 	props: {
      // 		fullWidth: true,
      // 	}
      // },
      pageOrder: {
        label: "ترتیب صفحه",
        inputType: "TextField",
        renderCustomInput: false,
        classes: "mt-10",
        styles: null,
        props: {
          fullWidth: true,
        },
      },
    },
    onCreate: async (vals) => handleCreate(vals),
    buttonLabel: "ثبت اشتراک جدید",
    dialogTitle: "ثبت اشتراک جدید",
  };
  const rowActions = [
    {
      icon: <FuseSvgIcon size={20}>heroicons-outline:x-circle</FuseSvgIcon>,
      label: "غیرفعال سازی",
      onClick: async (row, table, refetchList) => {
        alert(`Show sub-items for: ${row.original.name}`);
        refetchList();
      },
    },
	{
		icon: <FuseSvgIcon size={20}>heroicons-outline:calendar</FuseSvgIcon>,
		label: "تمدید زمان",
		onClick: async (row, table, refetchList) => {
		  alert(`Show sub-items for: ${row.original.name}`);
		  refetchList();
		},
	  },
    // 	{
    // 		icon: <PersonOffOutlined />,
    // 		label: 'غیرفعال کردن',
    // 		onClick: async (row, table, refetchList) => {
    // 			// call your disable API
    // 			alert(`Disable: ${row.original.name}`);
    // 			// e.g. await useDisableCategoryMutation(row.original.id);
    // 			refetchList();
    // 		}
    // 	}
  ];
  //   {
  //     "id": 1,
  //     "userId": 9,
  //     "bundleId": 2,
  //     "bundleTitle": "اشتراک پلن پایه 500,000 تومان ماهیانه",
  //     "bundleFeatures": [
  //         "شامل یک سایت استاندارد ویژه.",
  //         " دسترسی به تمام ویژگی‌ها.",
  //         " پشتیبانی ۲۴ ساعته."
  //     ],
  //     "subCategoryId": 1,
  //     "subCategoryName": "بانک اطلاعات تولیدکنندگان محصولات غذایی",
  //     "subCategoryNameEn": "producers",
  //     "subscriptionStatus": "ACTIVE",
  //     "paidAmount": 18000,
  //     "discount": {
  //         "name": "BLACK FRIDAY",
  //         "percentage": 10,
  //         "timeLimit": null,
  //         "timeLimitType": null,
  //         "startDateTime": null,
  //         "expireDateTime": "2024-11-30T10:30:45.123",
  //         "startDateTimeFa": null,
  //         "expireDateTimeFa": null,
  //         "createdAtFa": null,
  //         "updatedAtFa": null,
  //         "bundles": null,
  //         "subcategories": null,
  //         "users": null
  //     },
  //     "startDate": "2024-11-29T13:08:49.018333",
  //     "endDate": "2025-11-29T13:08:49.018333",
  //     "startDateStr": "۹ آذر ۱۴۰۳",
  //     "endDateStr": "۸ آذر ۱۴۰۴"
  // }
  const columns = useMemo(
    () => [
    //   {
    //     accessorFn: (row) => row.featuredImageId,
    //     id: "featuredImageId",
    //     header: "لوگو شرکت",
    //     enableColumnFilter: false,
    //     enableColumnDragging: false,
    //     size: 150,
    //     enableSorting: false,
    //     Cell: ({ row }) => (
    //       <div className="flex items-center justify-center">
    //         {row.original?.logo ? (
    //           <img
    //             className="h-92 w-92 block rounded-full shadow-10 border"
    //             src={getServerFile(row.original.logo)}
    //             alt={row.original.companyName}
    //           />
    //         ) : (
    //           <img
    //             className="w-full max-h-40 max-w-40 block rounded"
    //             src="assets/images/apps/ecommerce/product-image-placeholder.png"
    //             alt={row.original.name}
    //           />
    //         )}
    //       </div>
    //     ),
    //   },
      {
        // accessorKey: "id",
        accessorFn: (row) => "FK_SUB_" + row?.id,
        header: "شناسه اشتراک",
        size: 160,
      },
      {
        accessorKey: "userId",
        header: "شناسه کاربر",
        size: 200,
        Cell: ({ row }) => (
          <Typography
            component={Link}
            to={`/banks/food-industry/company/${row.original.id}`}
            className="underline"
            color="primary"
            role="button"
          >
            <div className="flex items-center justify-between space-x-2">
              <FaInfoCircle className="text-blue-500 me-11" size={20} />

              <span>{row.original.userId}</span>
            </div>
          </Typography>
        ),
      },
	//   {
    //     accessorKey: "bundleId",
    //     header: "شناسه پلن",
    //     size: 200,
    //     Cell: ({ row }) => (
    //       <Typography
    //         component={Link}
    //         to={`/banks/food-industry/company/${row.original.id}`}
    //         className="underline"
    //         color="primary"
    //         role="button"
    //       >
    //         <div className="flex items-center justify-between space-x-2">
    //           <FaInfoCircle className="text-blue-500 me-11" size={20} />

    //           <span>{row.original.bundleId}</span>
    //         </div>
    //       </Typography>
    //     ),
    //   },
	  {
        accessorKey: "bundleTitle",
        header: "پلن خریداری شده",
        size: 300,
      },
	  {
        accessorKey: "subCategoryName",
        header: "زیرشاخه پلن",
        size: 400,
		Cell: ({ row }) => (
			<div>
				<p>{row.original.subCategoryName}</p>
				<Button className="font-400 group self-end text-sm"
					variant="contained"
					color="primary"
					to={`/apps/settings/subscription/food/1`}
					// to={`/apps/academy/courses/${course.id}/${course.slug}`}
					component={Link}
				>
				<IoIosArrowRoundBack
						size={30}
						className="group-hover:-translate-x-3 transition-all"
					/>
				{row.original.subCategoryNameEn + " رفتن به صفحه " + " "}
					</Button>
			</div>
		),
		accessorFn: (row) => row.subCategoryName + " - " + row.subCategoryNameEn,
      },
	  {
        accessorKey: "bundlePrice",
        header: "هزینه پلن",
        size: 150,
      },
	  {
        accessorKey: "discount",
        header: "کد تخفیف",
        size: 150,
		Cell: ({ row }) => (		
			row.original.discount ?
			<div>
			<p>{ `تخفیف ${row.original.discount.percentage} درصدی`}</p>
			<p>{`${row.original.discount.name}`}</p>
			</div>
			:
			<span>اعمال نشده</span>
		  ),
      },
	  {
        accessorKey: "paidAmount",
        header: "هزینه پرداختی",
        size: 150,
      },
      {
        header: "وضعیت",
        accessorKey: "subscriptionStatus",
        editVariant: "select",
        size: 130,
        // editSelectOptions: categoryStatusSelectOptions,
        accessorFn: (row) =>
          row?.subscriptionStatus === "ACTIVE" ? (
            <EntityStatusField
              name={row?.subscriptionStatus === "ACTIVE" ? "فعال" : "غیرفعال"}
              colorClsx="bg-green text-white"
            />
          ) : (
            <EntityStatusField
              name={row?.subscriptionStatus === "ACTIVE" ? "فعال" : "غیرفعال"}
              colorClsx="bg-red-700 text-white"
            />
          ),
      },
      {
        accessorKey: "startDateStr",
        size: 150,
        Cell: ({ row }) => <div dir="rtl">{row.original.startDateStr}</div>,
        header: "تاریخ شروع",
        enableEditing: false,
      },
      {
        accessorKey: "endDateStr",
        size: 150,
        Cell: ({ row }) => <div dir="rtl">{row.original.endDateStr}</div>,
        header: "تاریخ پایان",
        enableEditing: false,
      },
    ],
    []
  );
  return (
    <div className="w-full max-w-screen flex flex-col">
      <FuseScrollbars className="grow overflow-x-auto">
        <Paper
          className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-screen"
          elevation={0}
        >
          <GenericCrudTable
            columns={columns}
            useListQueryHook={useGetSubscriptionsQuery}
            useCreateMutationHook={useCreateSubscriptionMutation}
            useUpdateMutationHook={useUpdateSubscriptionMutation}
            useDeleteMutationHook={useDeleteSubscriptionMutation}
            rowActions={rowActions}
            createItemProps={createItemProps}
            renderTopToolbarCustomActionsClasses="flex justify-start px-8 py-16"
            // isSubmitting={loading}
            saveToStore={false}
            enableRowAction={true}
            serviceIdentifier="subscriptionList"
            renderTopToolbarCustomActions={() => (
				<></>
            //   <Button
            //     color="primary"
            //     className="p-16"
            //     variant="contained"
            //     // onClick={() => {
            //     // 	table.setCreatingRow(true); // simplest way to open the create row modal with no default values
            //     // 	// or you can pass in a row object to set default values with the `createRow` helper function
            //     // 	// table.setCreatingRow(
            //     // 	//   createRow(table, {
            //     // 	//     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
            //     // 	//   }),
            //     // 	// );
            //     // }}
            //   >
            //     Create New User
            //   </Button>
            )}
          />
        </Paper>
      </FuseScrollbars>
    </div>
  );
}

export default SubscriptionTable;
