// import Button from "@mui/material/Button";
// import { useNavigate, useParams } from "react-router-dom";
// import { useCallback, useEffect, useState } from "react";
// import FuseLoading from "@fuse/core/FuseLoading";
// import _ from "@lodash";
// import { Controller, useForm } from "react-hook-form";
// import Box from "@mui/system/Box";
// import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
// import Avatar from "@mui/material/Avatar";
// import TextField from "@mui/material/TextField";
// import InputAdornment from "@mui/material/InputAdornment";
// import IconButton from "@mui/material/IconButton";
// import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
// import Checkbox from "@mui/material/Checkbox/Checkbox";
// import history from "@history";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
// import { useAppDispatch } from "app/store/hooks";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import UserEmailSelector from "./email-selector/UserEmailSelector.jsx";
// import PhoneNumberSelector from "./phone-number-selector/PhoneNumberSelector";
// import {
//   useCreateContactsItemMutation,
//   useDeleteContactsItemMutation,
//   useGetContactsItemQuery,
//   useUpdateContactsItemMutation,
//   useGetContactsAccessibilityQuery,
// } from "../UserApi.js";
// import ContactModel from "../models/ContactModel";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { getServerFile } from "src/utils/string-utils.js";
// import JobPositionAutocomplete from "./JobPositionAutocomplete.jsx";
// import CustomSelect from "app/shared-components/custom-select/CustomSelect.jsx";
// import CompanyOption from "./CompanyOption.jsx";
// function BirtdayIcon() {
//   return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
// }

// /**
//  * Form Validation Schema
//  */
// // Zod schema for ContactEmail
// const ContactEmailSchema = z.object({
//   email: z.string().optional(),
// });
// // Zod schema for ContactPhoneNumber
// const ContactPhoneNumberSchema = z.object({
//   number: z.string().optional(),
// });
// const schema = z
//   .object({
//     avatar: z.string().optional(),
//     background: z.string().optional(),
//     firstName: z.string().min(1, { message: "نام کاربر الزامیست." }),
//     lastName: z.string().min(1, { message: "نام خانوادگی کاربر الزامیست." }),
//     password: z
//       .string()
//       .optional()
//       .refine((pw) => !pw || pw.length >= 8, {
//         message: "کلمه عبور باید حداقل ۸ کاراکتر باشد.",
//       }),
//     passwordConfirm: z.string().optional(),
//     // password: z.string().min(8, { message: "کلمه عبور باید حداقل ۸ کاراکتر باشد." }),
//     // passwordConfirm: z.string().min(1, { message: "تکرار کلمه عبور الزامیست." }),
//     emails: z.array(ContactEmailSchema).optional(),
//     phoneNumbers: z.array(ContactPhoneNumberSchema).optional(),
//     title: z.string().optional(),
//     jobPosition: z
//       .string()
//       .optional()
//       .or(z.object({ value: z.string(), label: z.string() })),
//     company: z.string().optional(),
//     birthDate: z.string().optional(),
//     address: z.string().optional(),
//     notes: z.string().optional(),
//     availability: z.array(z.string()).optional(),
//   })
//   .refine(
//     (data) =>
//       !data.password ||
//       !data.passwordConfirm ||
//       data.password === data.passwordConfirm,
//     {
//       message: "کلمه عبور و تکرار آن مطابقت ندارند.",
//       path: ["passwordConfirm"],
//     }
//   );

// function UserForm() {
//   const [showPassword, setShowPassword] = useState(false);
//   const handleClickShowPassword = () => setShowPassword((show) => !show);
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const routeParams = useParams();
//   const { id: contactId } = routeParams;
//   const { data: contact, isError } = useGetContactsItemQuery(contactId, {
//     skip: !contactId,
//   });
//   const [createContact] = useCreateContactsItemMutation();
//   const [updateContact] = useUpdateContactsItemMutation();
//   const [deleteContact] = useDeleteContactsItemMutation();
//   const { data: accessibility } = useGetContactsAccessibilityQuery();
//   // const { data: accessibility } = useGetContactsTagsQuery();
//   const { control, watch, reset, handleSubmit, formState } = useForm({
//     mode: "all",
//     resolver: zodResolver(schema),
//   });
//   const { isValid, dirtyFields, errors } = formState;
//   const form = watch();
//   useEffect(() => {
//     if (contactId === "new") {
//       reset(ContactModel({}));
//     } else {
//       const formattedContact = {
//         ...contact,
//         companies:
//           contact?.companies?.map((company) => ({
//             value: company.id || company._id,
//             label: company.name,
//             ...company,
//           })) || [],
//       };
//       reset(formattedContact);
//       //   reset({ ...contact });
//     }
//   }, [contact, reset, routeParams]);
//   /**
//    * Form Submit
//    */
//   const onSubmit = useCallback(() => {
//     const formData = {
//       ...form,
//       companyIds: form.companies?.map((company) => company.value || company.id),
//     };
//     if (contactId === "new") {
//       createContact({ contact: formData })
//         .unwrap()
//         .then((action) => {
//           navigate(`/apps/users/${action.id}`);
//         });
//     } else {
//       updateContact({ id: contact.id, ...formData });
//     }
//   }, [form]);

//   function handleRemoveContact() {
//     if (!contact) {
//       return;
//     }

//     deleteContact(contact.id).then(() => {
//       navigate("/apps/users");
//     });
//   }

//   const background = watch("background");
//   const avatar = watch("avatar");
//   const firstName = watch("firstName");

//   if (isError && contactId !== "new") {
//     setTimeout(() => {
//       navigate("/apps/users");
//       dispatch(showMessage({ message: "کاربر یافت نشد" }));
//     }, 0);
//     return null;
//   }

//   if (_.isEmpty(form)) {
//     return <FuseLoading className="min-h-screen" />;
//   }

//   return (
//     <>
//       <div className="flex flex-auto">
//         <Box
//           className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
//           sx={{
//             backgroundColor: "background.default",
//           }}
//         >
//           <div className="absolute inset-0 bg-grey-400 bg-opacity-50 z-10" />

//           {background && (
//             <img
//               className="absolute inset-0 object-cover w-full h-full shadow-8"
//               src={background}
//               alt="user background"
//             />
//           )}
//         </Box>
//       </div>

//       <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
//         <div className="w-full">
//           <div className="flex flex-auto items-end -mt-64">
//             <Controller
//               control={control}
//               name="avatar"
//               render={({ field: { onChange, value } }) => (
//                 <Box
//                   sx={{
//                     borderWidth: 4,
//                     borderStyle: "solid",
//                     borderColor: "background.paper",
//                   }}
//                   className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
//                 >
//                   <div className="absolute inset-0 bg-black bg-opacity-80 z-10" />
//                   <div className="absolute inset-0 flex items-center justify-center z-20">
//                     <div>
//                       <label
//                         htmlFor="button-avatar"
//                         className="flex p-8 cursor-pointer"
//                       >
//                         <input
//                           accept="image/*"
//                           className="hidden"
//                           id="button-avatar"
//                           type="file"
//                           onChange={async (e) => {
//                             function readFileAsync() {
//                               return new Promise((resolve, reject) => {
//                                 const file = e?.target?.files?.[0];

//                                 if (!file) {
//                                   return;
//                                 }

//                                 const reader = new FileReader();
//                                 reader.onload = () => {
//                                   if (typeof reader.result === "string") {
//                                     resolve(
//                                       `data:${file.type};base64,${btoa(reader.result)}`
//                                     );
//                                   } else {
//                                     reject(
//                                       new Error(
//                                         "File reading did not result in a string."
//                                       )
//                                     );
//                                   }
//                                 };
//                                 reader.onerror = reject;
//                                 reader.readAsBinaryString(file);
//                               });
//                             }

//                             const newImage = await readFileAsync();
//                             onChange(newImage);
//                           }}
//                         />
//                         <FuseSvgIcon className="text-white">
//                           heroicons-outline:camera
//                         </FuseSvgIcon>
//                       </label>
//                     </div>
//                     <div>
//                       <IconButton
//                         onClick={() => {
//                           onChange("");
//                         }}
//                       >
//                         <FuseSvgIcon className="text-white">
//                           heroicons-solid:trash
//                         </FuseSvgIcon>
//                       </IconButton>
//                     </div>
//                   </div>
//                   <Avatar
//                     sx={{
//                       backgroundColor: "background.default",
//                       color: "text.secondary",
//                     }}
//                     className="object-cover w-full h-full text-64 font-bold"
//                     src={avatar && getServerFile(avatar)}
//                     alt={firstName}
//                   >
//                     {firstName?.charAt(0)}
//                   </Avatar>
//                 </Box>
//               )}
//             />
//           </div>
//         </div>
//         <Controller
//           control={control}
//           name="firstName"
//           render={({ field }) => (
//             <TextField
//               className="mt-32"
//               {...field}
//               label="نام"
//               placeholder="نام کاربر را بنویسید"
//               id="firstName"
//               error={!!errors.firstName}
//               helperText={errors?.firstName?.message}
//               variant="outlined"
//               required
//               fullWidth
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FuseSvgIcon size={20}>
//                       heroicons-solid:user-circle
//                     </FuseSvgIcon>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           )}
//         />
//         <Controller
//           control={control}
//           name="lastName"
//           render={({ field }) => (
//             <TextField
//               className="mt-32"
//               {...field}
//               label="نام خانوادگی"
//               placeholder="نام خانوادگی کاربر را بنویسید"
//               id="lastName"
//               error={!!errors.lastName}
//               helperText={errors?.lastName?.message}
//               variant="outlined"
//               required
//               fullWidth
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FuseSvgIcon size={20}>
//                       heroicons-solid:user-circle
//                     </FuseSvgIcon>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           )}
//         />
//         <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-x-10">
//           <Controller
//             control={control}
//             name="password"
//             render={({ field }) => (
//               <TextField
//                 className="mt-32"
//                 {...field}
//                 label="کلمه عبور"
//                 placeholder="کلمه عبور کاربر را بنویسید"
//                 id="password"
//                 error={!!errors.password}
//                 helperText={errors?.password?.message}
//                 variant="outlined"
//                 type={showPassword ? "text" : "password"}
//                 fullWidth
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <IconButton
//                         aria-label={
//                           showPassword
//                             ? "hide the password"
//                             : "display the password"
//                         }
//                         onClick={handleClickShowPassword}
//                         edge="end"
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             )}
//           />
//           <Controller
//             control={control}
//             name="passwordConfirm"
//             render={({ field }) => (
//               <TextField
//                 className="mt-32"
//                 {...field}
//                 label="تکرار کلمه عبور"
//                 placeholder="کلمه عبور کاربر را بنویسید"
//                 id="passwordConfirm"
//                 error={!!errors.passwordConfirm}
//                 helperText={errors?.passwordConfirm?.message}
//                 variant="outlined"
//                 type={showPassword ? "text" : "password"}
//                 fullWidth
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <IconButton
//                         aria-label={
//                           showPassword
//                             ? "hide the password"
//                             : "display the password"
//                         }
//                         onClick={handleClickShowPassword}
//                         edge="end"
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             )}
//           />
//         </div>
//         <Controller
//           control={control}
//           name="accessibility"
//           render={({ field: { onChange, value } }) => (
//             <Autocomplete
//               multiple
//               id="accessibility"
//               className="mt-32"
//               options={accessibility || []}
//               disableCloseOnSelect
//               getOptionLabel={(option) => option?.title}
//               renderOption={(_props, option, { selected }) => (
//                 <li {..._props}>
//                   <Checkbox style={{ marginRight: 8 }} checked={selected} />
//                   {option?.title}
//                 </li>
//               )}
//               value={
//                 value ? value?.map((id) => _.find(accessibility, { id })) : []
//               }
//               onChange={(_event, newValue) => {
//                 onChange(newValue?.map((item) => item?.id));
//               }}
//               fullWidth
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="دسترسی‌ها"
//                   placeholder="دسترسی‌ها"
//                 />
//               )}
//             />
//           )}
//         />

//         {/* <Controller
// 					control={control}
// 					name="jobPosition"
// 					render={({ field }) => (
// 						<TextField
// 							className="mt-32"
// 							{...field}
// 							label="سمت"
// 							placeholder="سمت کاربر را بنویسید"
// 							id="jobPosition"
// 							error={!!errors.jobPosition}
// 							helperText={errors?.jobPosition?.message}
// 							variant="outlined"
// 							fullWidth
// 							InputProps={{
// 								startAdornment: (
// 									<InputAdornment position="start">
// 										<FuseSvgIcon size={20}>heroicons-solid:briefcase</FuseSvgIcon>
// 									</InputAdornment>
// 								)
// 							}}
// 						/>
// 					)}
// 				/> */}

//         <Controller
//           control={control}
//           name="jobPosition"
//           render={({ field }) => (
//             <JobPositionAutocomplete
//               className="mt-32"
//               field={field}
//               error={!!errors.jobPosition}
//               helperText={errors?.jobPosition?.message}
//             />
//           )}
//         />

//         {/* <Controller
//           control={control}
//           name="company"
//           render={({ field }) => (
//             <TextField
//               className="mt-32"
//               {...field}
//               label="Company"
//               placeholder="Company"
//               id="company"
//               error={!!errors.company}
//               helperText={errors?.company?.message}
//               variant="outlined"
//               fullWidth
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FuseSvgIcon size={20}>
//                       heroicons-solid:office-building
//                     </FuseSvgIcon>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           )}
//         /> */}

//         <Controller
//           control={control}
//           name="companies"
//           render={({ field: { onChange, value } }) => (
//             <CustomSelect
//               className="mt-32 mb-32"
//               classes={{ mainDiv: "mt-32 w-full mb-32" }}
//               style={{ width: "100%", height: "53.125px" }}
//               isMulti={true}
//               placeholder="شرکت‌ها"
//               url="/company/options"
//               noOptionsMessage="هیچ شرکتی یافت نشد"
//               loadingMessage="در حال بارگذاری شرکت‌ها..."
//               value={value}
//               onChange={(selectedOptions) => onChange(selectedOptions)}
//               error={!!errors.companies}
//               helperText={errors?.companies?.message}
//               customComponents={{
//                 CustomOption: CompanyOption,
//               }}
//             />
//           )}
//         />
//         <Controller
//           control={control}
//           name="emails"
//           render={({ field }) => (
//             <UserEmailSelector
//               className="mt-32"
//               {...field}
//               value={field?.value}
//               onChange={(val) => field.onChange(val)}
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="phoneNumbers"
//           render={({ field }) => (
//             <PhoneNumberSelector
//               className="mt-32"
//               {...field}
//               error={!!errors.phoneNumbers}
//               helperText={errors?.phoneNumbers?.message}
//               value={field.value}
//               onChange={(val) => field.onChange(val)}
//             />
//           )}
//         />

//         <Controller
//           control={control}
//           name="address"
//           render={({ field }) => (
//             <TextField
//               className="mt-32"
//               {...field}
//               label="آدرس"
//               placeholder="آدرس کاربر را وارد کنید"
//               id="address"
//               error={!!errors.address}
//               helperText={errors?.address?.message}
//               variant="outlined"
//               fullWidth
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <FuseSvgIcon size={20}>
//                       heroicons-solid:location-marker
//                     </FuseSvgIcon>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           )}
//         />
//         <Controller
//           control={control}
//           name="birthDate"
//           render={({ field: { value, onChange } }) => (
//             <DateTimePicker
//               value={new Date(value)}
//               onChange={(val) => {
//                 onChange(val?.toISOString());
//               }}
//               className="mt-32 mb-16 w-full"
//               slotProps={{
//                 textField: {
//                   id: "birthDate",
//                   label: "تاریخ تولد",
//                   InputLabelProps: {
//                     shrink: true,
//                   },
//                   fullWidth: true,
//                   variant: "outlined",
//                   error: !!errors.birthDate,
//                   helperText: errors?.birthDate?.message,
//                 },
//                 actionBar: {
//                   actions: ["clear", "today"],
//                 },
//               }}
//               slots={{
//                 openPickerIcon: BirtdayIcon,
//               }}
//             />
//           )}
//         />
//         <Controller
//           control={control}
//           name="notes"
//           render={({ field }) => (
//             <TextField
//               className="mt-32"
//               {...field}
//               label="یادداشت‌ها"
//               placeholder="اطلاعاتی در مورد کاربر بنویسید"
//               id="notes"
//               error={!!errors.notes}
//               helperText={errors?.notes?.message}
//               variant="outlined"
//               fullWidth
//               multiline
//               minRows={5}
//               maxRows={10}
//               InputProps={{
//                 className: "max-h-min h-min items-start",
//                 startAdornment: (
//                   <InputAdornment className="mt-10" position="start">
//                     <FuseSvgIcon size={20}>
//                       heroicons-solid:menu-alt-2
//                     </FuseSvgIcon>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           )}
//         />
//       </div>
//       <Box
//         className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
//         sx={{ backgroundColor: "background.default" }}
//       >
//         {contactId !== "new" && (
//           <Button color="error" onClick={handleRemoveContact}>
//             حذف
//           </Button>
//         )}
//         <Button
//           className="ml-auto"
//           variant="outlined"
//           onClick={() => history.back()}
//         >
//           لغو
//         </Button>
//         <Button
//           className="ml-8"
//           variant="contained"
//           color="secondary"
//           disabled={_.isEmpty(dirtyFields) || !isValid}
//           onClick={handleSubmit(onSubmit)}
//         >
//           ذخیره
//         </Button>
//       </Box>
//     </>
//   );
// }

// export default UserForm;

import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import FuseLoading from "@fuse/core/FuseLoading";
import _ from "@lodash";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/system/Box";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import Chip from "@mui/material/Chip";
import history from "@history";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { useAppDispatch } from "app/store/hooks";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import UserEmailSelector from "./email-selector/UserEmailSelector";
import PhoneNumberSelector from "./phone-number-selector/PhoneNumberSelector";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { getServerFile } from "src/utils/string-utils.js";
import JobPositionAutocomplete from "./JobPositionAutocomplete";
import CompanyOption from "./CompanyOption";
import UserModel from "../models/UserModel";
import {
  useGetUsersItemQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetRolesListQuery,
  useGetAccessesListQuery,
  useGetUserRolesQuery,
  useGetUserAccessesQuery,
  useUpdateUserAccessesMutation,
} from "../UserApi";

function BirtdayIcon() {
  return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

/**
 * Form Validation Schema
 */
// Zod schema for ContactEmail
const ContactEmailSchema = z.object({
  email: z.string().optional(),
});
// Zod schema for ContactPhoneNumber
const ContactPhoneNumberSchema = z.object({
  phoneNumber: z.string().optional(),
});
const schema = z
  .object({
    avatar: z.string().optional(),
    background: z.string().optional(),
    firstName: z.string().min(1, { message: "نام کاربر الزامیست." }),
    lastName: z.string().min(1, { message: "نام خانوادگی کاربر الزامیست." }),
    email: z.string().email({ message: "ایمیل نامعتبر است." }).min(1, { message: "ایمیل کاربر الزامیست." }),
    username: z.string().min(11, { message: "نام کاربری باید 11 کاراکتر باشد." }).max(11, { message: "نام کاربری باید 11 کاراکتر باشد." }),
    phone: z.string().min(11, { message: "شماره تلفن باید 11 کاراکتر باشد." }).max(11, { message: "شماره تلفن باید 11 کاراکتر باشد." }),
    password: z
      .string()
      .optional()
      .refine((pw) => !pw || pw.length >= 8, {
        message: "کلمه عبور باید حداقل ۸ کاراکتر باشد.",
      }),
    passwordConfirm: z.string().optional(),
    emails: z.array(ContactEmailSchema).optional(),
    phoneNumbers: z.array(ContactPhoneNumberSchema).optional(),
    title: z.string().optional(),
    jobPosition: z
      .string()
      .optional()
      .or(z.object({ value: z.string(), label: z.string() })),
    roles: z.array(z.number()).optional(),
    accesses: z.array(z.number()).optional(),
    birthDate: z.string().optional(),
    address: z.string().optional(),
    notes: z.string().optional(),
    companies: z.array(z.any()).optional(),
  })
  .refine(
    (data) =>
      !data.password ||
      !data.passwordConfirm ||
      data.password === data.passwordConfirm,
    {
      message: "کلمه عبور و تکرار آن مطابقت ندارند.",
      path: ["passwordConfirm"],
    }
  );

function UserForm() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const routeParams = useParams();
  const { id: userId } = routeParams;
  
  // API hooks
  const { data: user, isError, isLoading: isLoadingUser } = useGetUsersItemQuery(userId, {
    skip: !userId || userId === "new",
  });
  
  const { data: userRoles = [], isLoading: isLoadingRoles } = useGetUserRolesQuery(userId, {
    skip: !userId || userId === "new",
  });
  
  const { data: userAccesses = [], isLoading: isLoadingAccesses } = useGetUserAccessesQuery(userId, {
    skip: !userId || userId === "new",
  });
  
  const { data: rolesList = [], isLoading: isLoadingRolesList } = useGetRolesListQuery();
  const { data: accessesList = [], isLoading: isLoadingAccessesList } = useGetAccessesListQuery();
  
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUserAccesses] = useUpdateUserAccessesMutation();

  const isLoading = isLoadingUser || isLoadingRoles || isLoadingAccesses || isLoadingRolesList || isLoadingAccessesList || isCreating || isUpdating || isDeleting;

  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: "all",
    resolver: zodResolver(schema),
  });
  
  const { isValid, dirtyFields, errors } = formState;
  const form = watch();
  
  useEffect(() => {
    if (userId === "new") {
      reset(UserModel({}));
    } else if (user) {
      // Format user data for the form
      const formattedUser = {
        ...user,
        roles: userRoles?.data || [],
        accesses: userAccesses?.data || [],
        companies: user?.companies?.map(company => ({
          value: company.id || company._id,
          label: company.name,
          ...company,
        })) || [],
      };
      reset(formattedUser);
    }
  }, [user, userRoles, userAccesses, reset, userId]);

  /**
   * Form Submit
   */
  const onSubmit = useCallback(async (data) => {
    try {
      const formData = {
        ...data,
        companyIds: data.companies?.map(company => company.value || company.id),
      };
      
      if (userId === "new") {
        const result = await createUser(formData).unwrap();
        
        // If there are roles or accesses, update them
        if (data.roles?.length > 0) {
          await updateUserAccesses({
            userId: result.id,
            accesses: formData.accesses.map(id => ({ id }))
          }).unwrap();
        }
        
        navigate(`/apps/users/${result.id}`);
        dispatch(showMessage({ message: "کاربر با موفقیت ایجاد شد" }));
      } else {
        await updateUser({ id: userId, ...formData }).unwrap();
        
        // Update user accesses if changed
        if (_.isEqual(formData.accesses, userAccesses?.data) === false) {
          await updateUserAccesses({
            userId,
            accesses: formData.accesses.map(id => ({ id }))
          }).unwrap();
        }
        
        dispatch(showMessage({ message: "اطلاعات کاربر با موفقیت بروزرسانی شد" }));
      }
    } catch (error) {
      console.error(error);
      dispatch(showMessage({ 
        message: "خطا در ذخیره اطلاعات کاربر", 
        variant: "error" 
      }));
    }
  }, [userId, createUser, updateUser, updateUserAccesses, dispatch, navigate]);

  async function handleRemoveUser() {
    if (!user || userId === "new") {
      return;
    }

    try {
      await deleteUser(userId).unwrap();
      navigate("/apps/users");
      dispatch(showMessage({ message: "کاربر با موفقیت حذف شد" }));
    } catch (error) {
      console.error(error);
      dispatch(showMessage({ 
        message: "خطا در حذف کاربر", 
        variant: "error" 
      }));
    }
  }

  const avatar = watch("avatar");
  const firstName = watch("firstName");

  if (isError && userId !== "new") {
    setTimeout(() => {
      navigate("/apps/users");
      dispatch(showMessage({ message: "کاربر یافت نشد" }));
    }, 0);
    return null;
  }

  if (isLoading || (_.isEmpty(form) && userId !== "new")) {
    return <FuseLoading className="min-h-screen" />;
  }

  return (
    <>
      <div className="flex flex-auto">
        <Box
          className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
          sx={{
            backgroundColor: "background.default",
          }}
        >
          <div className="absolute inset-0 bg-grey-400 bg-opacity-50 z-10" />
        </Box>
      </div>

      <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
        <div className="w-full">
          <div className="flex flex-auto items-end -mt-64">
            <Controller
              control={control}
              name="avatar"
              render={({ field: { onChange, value } }) => (
                <Box
                  sx={{
                    borderWidth: 4,
                    borderStyle: "solid",
                    borderColor: "background.paper",
                  }}
                  className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
                >
                  <div className="absolute inset-0 bg-black bg-opacity-80 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div>
                      <label
                        htmlFor="button-avatar"
                        className="flex p-8 cursor-pointer"
                      >
                        <input
                          accept="image/*"
                          className="hidden"
                          id="button-avatar"
                          type="file"
                          onChange={async (e) => {
                            function readFileAsync() {
                              return new Promise((resolve, reject) => {
                                const file = e?.target?.files?.[0];

                                if (!file) {
                                  return;
                                }

                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (typeof reader.result === "string") {
                                    resolve(
                                      `data:${file.type};base64,${btoa(reader.result)}`
                                    );
                                  } else {
                                    reject(
                                      new Error(
                                        "File reading did not result in a string."
                                      )
                                    );
                                  }
                                };
                                reader.onerror = reject;
                                reader.readAsBinaryString(file);
                              });
                            }

                            const newImage = await readFileAsync();
                            onChange(newImage);
                          }}
                        />
                        <FuseSvgIcon className="text-white">
                          heroicons-outline:camera
                        </FuseSvgIcon>
                      </label>
                    </div>
                    <div>
                      <IconButton
                        onClick={() => {
                          onChange("");
                        }}
                      >
                        <FuseSvgIcon className="text-white">
                          heroicons-solid:trash
                        </FuseSvgIcon>
                      </IconButton>
                    </div>
                  </div>
                  <Avatar
                    sx={{
                      backgroundColor: "background.default",
                      color: "text.secondary",
                    }}
                    className="object-cover w-full h-full text-64 font-bold"
                    src={avatar && getServerFile(avatar)}
                    alt={firstName}
                  >
                    {firstName?.charAt(0)}
                  </Avatar>
                </Box>
              )}
            />
          </div>
        </div>
        
        {/* Basic Information */}
        <Controller
          control={control}
          name="firstName"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="نام"
              placeholder="نام کاربر را بنویسید"
              id="firstName"
              error={!!errors.firstName}
              helperText={errors?.firstName?.message}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:user-circle
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        
        <Controller
          control={control}
          name="lastName"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="نام خانوادگی"
              placeholder="نام خانوادگی کاربر را بنویسید"
              id="lastName"
              error={!!errors.lastName}
              helperText={errors?.lastName?.message}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:user-circle
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="نام کاربری"
              placeholder="نام کاربری را وارد کنید"
              id="username"
              error={!!errors.username}
              helperText={errors?.username?.message}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:identification
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="ایمیل اصلی"
              placeholder="ایمیل اصلی کاربر را وارد کنید"
              id="email"
              error={!!errors.email}
              helperText={errors?.email?.message}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:mail
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="شماره تلفن اصلی"
              placeholder="شماره تلفن اصلی کاربر را وارد کنید"
              id="phone"
              error={!!errors.phone}
              helperText={errors?.phone?.message}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:phone
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        
        {/* Password fields */}
        <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-x-10">
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <TextField
                className="mt-32"
                {...field}
                label="کلمه عبور"
                placeholder="کلمه عبور کاربر را بنویسید"
                id="password"
                error={!!errors.password}
                helperText={errors?.password?.message}
                variant="outlined"
                type={showPassword ? "text" : "password"}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "hide the password"
                            : "display the password"
                        }
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="passwordConfirm"
            render={({ field }) => (
              <TextField
                className="mt-32"
                {...field}
                label="تکرار کلمه عبور"
                placeholder="کلمه عبور کاربر را بنویسید"
                id="passwordConfirm"
                error={!!errors.passwordConfirm}
                helperText={errors?.passwordConfirm?.message}
                variant="outlined"
                type={showPassword ? "text" : "password"}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "hide the password"
                            : "display the password"
                        }
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </div>
        
        {/* Roles Selection */}
        <Controller
          control={control}
          name="roles"
          render={({ field: { onChange, value = [] } }) => (
            <Autocomplete
              multiple
              id="roles"
              className="mt-32"
              options={rolesList?.data || []}
              disableCloseOnSelect
              getOptionLabel={(option) => option?.displayName || option?.name || ''}
              renderOption={(_props, option, { selected }) => (
                <li {..._props}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option?.displayName || option?.name}
                </li>
              )}
              value={(rolesList?.data || []).filter(role => value.includes(role.id))}
              onChange={(_event, newValue) => {
                onChange(newValue?.map(item => item?.id));
              }}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="نقش‌ها"
                  placeholder="نقش‌های کاربر را انتخاب کنید"
                  error={!!errors.roles}
                  helperText={errors?.roles?.message}
                />
              )}
            />
          )}
        />
        
        {/* Accesses Selection */}
        <Controller
          control={control}
          name="accesses"
          render={({ field: { onChange, value = [] } }) => (
            <Autocomplete
              multiple
              id="accesses"
              className="mt-32"
              options={accessesList?.data || []}
              disableCloseOnSelect
              getOptionLabel={(option) => option?.displayName || option?.name || ''}
              renderOption={(_props, option, { selected }) => (
                <li {..._props}>
                  <Checkbox style={{ marginRight: 8 }} checked={selected} />
                  {option?.displayName || option?.name}
                </li>
              )}
              value={(accessesList?.data || []).filter(access => value.includes(access.id))}
              onChange={(_event, newValue) => {
                onChange(newValue?.map(item => item?.id));
              }}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="دسترسی‌ها"
                  placeholder="دسترسی‌های کاربر را انتخاب کنید"
                  error={!!errors.accesses}
                  helperText={errors?.accesses?.message}
                />
              )}
            />
          )}
        />

        <Controller
          control={control}
          name="jobPosition"
          render={({ field }) => (
            <JobPositionAutocomplete
              className="mt-32"
              field={field}
              error={!!errors.jobPosition}
              helperText={errors?.jobPosition?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="companies"
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              multiple
              id="companies"
              className="mt-32 mb-32"
              options={[]}
              value={value || []}
              onChange={(event, newValue) => onChange(newValue)}
              getOptionLabel={(option) => option.label || option.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id || option.value === value.value}
              renderOption={(props, option) => (
                <CompanyOption {...props} data={option} />
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="شرکت‌ها"
                  placeholder="شرکت‌های کاربر را انتخاب کنید"
                  error={!!errors.companies}
                  helperText={errors?.companies?.message}
                  fullWidth
                />
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    label={option.label || option.name}
                    {...getTagProps({ index })}
                    key={index}
                  />
                ))
              }
            />
          )}
        />
        
        <Controller
          control={control}
          name="emails"
          render={({ field }) => (
            <UserEmailSelector
              className="mt-32"
              {...field}
              value={field?.value}
              onChange={(val) => field.onChange(val)}
            />
          )}
        />

        <Controller
          control={control}
          name="phoneNumbers"
          render={({ field }) => (
            <PhoneNumberSelector
              className="mt-32"
              {...field}
              error={!!errors.phoneNumbers}
              helperText={errors?.phoneNumbers?.message}
              value={field.value}
              onChange={(val) => field.onChange(val)}
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="آدرس"
              placeholder="آدرس کاربر را وارد کنید"
              id="address"
              error={!!errors.address}
              helperText={errors?.address?.message}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:location-marker
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        
        <Controller
          control={control}
          name="birthDate"
          render={({ field: { value, onChange } }) => (
            <DateTimePicker
              value={value ? new Date(value) : null}
              onChange={(val) => {
                onChange(val?.toISOString());
              }}
              className="mt-32 mb-16 w-full"
              slotProps={{
                textField: {
                  id: "birthDate",
                  label: "تاریخ تولد",
                  InputLabelProps: {
                    shrink: true,
                  },
                  fullWidth: true,
                  variant: "outlined",
                  error: !!errors.birthDate,
                  helperText: errors?.birthDate?.message,
                },
                actionBar: {
                  actions: ["clear", "today"],
                },
              }}
              slots={{
                openPickerIcon: BirtdayIcon,
              }}
            />
          )}
        />
        
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="یادداشت‌ها"
              placeholder="اطلاعاتی در مورد کاربر بنویسید"
              id="notes"
              error={!!errors.notes}
              helperText={errors?.notes?.message}
              variant="outlined"
              fullWidth
              multiline
              minRows={5}
              maxRows={10}
              InputProps={{
                className: "max-h-min h-min items-start",
                startAdornment: (
                  <InputAdornment className="mt-10" position="start">
                    <FuseSvgIcon size={20}>
                      heroicons-solid:menu-alt-2
                    </FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </div>
      
      {/* Form Actions */}
      <Box
        className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
        sx={{ backgroundColor: "background.default" }}
      >
        {userId !== "new" && (
          <Button color="error" onClick={handleRemoveUser}>
            حذف
          </Button>
        )}
        <Button
          className="ml-auto"
          variant="outlined"
          onClick={() => history.back()}
        >
          لغو
        </Button>
        <Button
          className="ml-8"
          variant="contained"
          color="secondary"
          disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
          onClick={handleSubmit(onSubmit)}
        >
          {isLoading ? "در حال پردازش..." : "ذخیره"}
        </Button>
      </Box>
    </>
  );
}

export default UserForm;