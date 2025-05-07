// // import TextField from '@mui/material/TextField';
// // import { Controller, useFormContext } from 'react-hook-form';

// // function ManagementDescTab(props) {
// // 	const methods = useFormContext();
// // 	const { control, formState } = methods;
// // 	const { errors } = formState;

// // 	return (
// // 		<div>
// // 			<Controller
// // 				name="managementDesc"
// // 				control={control}
// // 				render={({ field }) => (
// // 					<TextField
// // 						{...field}
// // 						className="mt-8 mb-16 sm:mx-4"
// // 						multiline
// // 						minRows={5}
// // 						label="توضیحات مدیریت"
// // 						id="managementDesc"
// // 						variant="outlined"
// // 						fullWidth
// // 					/>
// // 				)}
// // 			/>
// // 			<Controller
// // 				name="record"
// // 				control={control}
// // 				render={({ field }) => (
// // 					<TextField
// // 						{...field}
// // 						className="mt-8 mb-16 sm:mx-4"
// // 						multiline
// // 						minRows={5}
// // 						label="ثبت سوابق"
// // 						id="record"
// // 						variant="outlined"
// // 						fullWidth
// // 					/>
// // 				)}
// // 			/>
// // 		</div>
// // 	);
// // }

// // export default ManagementDescTab;

// import { useEffect, useState } from "react";
// import { Controller, useFormContext } from "react-hook-form";
// import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import SpeedDial from "@mui/material/SpeedDial";
// import SpeedDialAction from "@mui/material/SpeedDialAction";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import MoreVert from "@mui/icons-material/MoreVert";
// import InfiniteScroll from "react-infinite-scroll-component";
// import axios from "axios";
// import { motion } from "framer-motion";
// import RecordsTimeline from "./components/records-timeline/RecordsTimeline";
// import EditorJSComponent from "app/shared-components/editor-js/EditorJSComponent";
// import CustomJoditEditor from "app/shared-components/jodit-editor/CustomJoditEditor";
// import { Card, CardContent, CardHeader } from "@mui/material";

// const mockRecords = [
//   {
//   user: {
//     firstName: "آرمین",
//     lastName: "مظفری",
//     username: "09352388350",
//     createdAt: "2022-01-01",
//   },
//   text: "امتن رکورد تستی ، بعدا از سرور بیاید"
// },
// {
//   user: {
//     firstName: "کریم",
//     lastName: "مظفری",
//     username: "09352388350",
//     createdAt: "2022-01-01",
//   },
//   text: "۲متن رکورد"
// },
// {
//   user: {
//     firstName: "امیر",
//     lastName: "نورب=ی",
//     avatar: "/files/USER_AVATAR/noiendbedoinfweopjbienpw.jpg", // use getServerFile() to prepend the base url of the backend API to this 
//     username: "09352388350",
//     createdAtStr: "۱۴۰۳/۱۲/۲۸, ۳:۰۰:۱۵",
//     role: "MANAGER",
//     roleStr: "مدیر"
//   },
//   comment: "۳متن رکورد",
//   authorizedRoles: ["MANAGER", "ADMIN"]
// },
// {
//   user: {
//     firstName: "ابوالفضل",
//     lastName: "مظفری",
//     username: "09352388350",
//     createdAt: "2022-01-01",
//   },
//   text: "متن رکورد"
// },
// ]
// // A small helper to truncate text
// function truncateText(text, length = 100) {
//   if (!text) return "";
//   if (text.length <= length) return text;
//   return text.slice(0, length) + "...";
// }

// // A single timeline item
// function RecordItem({ record, onDelete }) {
//   const [expanded, setExpanded] = useState(false);
//   const [openSpeedDial, setOpenSpeedDial] = useState(false);

//   const handleToggleExpand = () => {
//     setExpanded((prev) => !prev);
//   };

//   const handleDelete = async () => {
//     if (!window.confirm("حذف رکورد؟")) return;
//     await onDelete(record.id);
//   };

//   return (
//     <div className="border border-gray-300 p-16 rounded-lg mb-16 relative">
//       <div className="flex justify-between items-center">
//         <div className="flex flex-col">
//           <Typography variant="subtitle1" className="font-bold">
//             {record.user?.firstName} {record.user?.lastName} ({record.user?.username})
//           </Typography>
//           <Typography variant="caption" color="textSecondary">
//             {record.createdAt || ""}
//           </Typography>
//         </div>
//         {/* The SpeedDial or menu for each record */}
//         <SpeedDial
//           ariaLabel="Record actions"
//           icon={<MoreVert />}
//           onClose={() => setOpenSpeedDial(false)}
//           onOpen={() => setOpenSpeedDial(true)}
//           open={openSpeedDial}
//           direction="left"
//           FabProps={{
//             size: "small",
//             color: "primary",
//           }}
//         >
//           <SpeedDialAction
//             icon={<EditIcon />}
//             tooltipTitle="ویرایش"
//             onClick={() => alert("Edit not implemented")}
//           />
//           <SpeedDialAction
//             icon={<DeleteIcon />}
//             tooltipTitle="حذف"
//             onClick={handleDelete}
//           />
//         </SpeedDial>
//       </div>
//       <Divider className="my-8" />
//       <Typography variant="body1">
//         {expanded ? record.text : truncateText(record.text, 150)}
//       </Typography>
//       {record.text?.length > 150 && (
//         <Button variant="text" size="small" onClick={handleToggleExpand}>
//           {expanded ? "بستن" : "ادامه ..."}
//         </Button>
//       )}
//     </div>
//   );
// }

// function ManagementDescTab() {
//   const { control } = useFormContext();
//   const [records, setRecords] = useState([]);
//   const [page, setPage] = useState(0);
//   const [hasMore, setHasMore] = useState(true);

//   // Load records from server with infinite approach
//   const loadRecords = async () => {
//     // const { data } = await axios.get(
//     //   `/api/company/123/records?page=${page}&size=10`
//     // );
//     // if (!data || data.length === 0) {
//     //   setHasMore(false);
//     //   return;
//     // }
//     // setRecords((prev) => [...prev, ...data]);
//     // setPage((prev) => prev + 1);

//     setRecords(mockRecords)
//     setHasMore(false)
//   };

//   useEffect(() => {
//     // On mount, load first page
//     loadRecords();
//     // eslint-disable-next-line
//   }, []);

//   // Deleting a record from the timeline
//   const handleDelete = async (recordId) => {
//     await axios.delete(`/api/company/123/records/${recordId}`);
//     setRecords((prev) => prev.filter((r) => r.id !== recordId));
//   };

//   const mockRecords = [
//     {
//       firstName: "امیر",
//       lastName: "نوربینی",
//       avatar: "/files/USER_AVATAR/noiendbedoinfweopjbienpw.jpg",
//       username: "09352388350",
//       createdAtStr: "۱۴۰۳/۱۲/۲۸, ۳:۰۰:۱۵",
//       role: "MANAGER",
//       roleStr: "مدیر",
//       comment: {
//         time: 1742254731536,
//         blocks: [
//           {
//             id: "block-1",
//             type: "paragraph",
//             data: {
//               text: "این یک متن آزمایشی است که بخشی از رکورد را نمایش می‌دهد."
//             }
//           },
//           {
//             id: "block-2",
//             type: "header",
//             data: {
//               text: "ویژگی‌های مهم",
//               level: 3
//             }
//           },
//           {
//             id: "block-3",
//             type: "list",
//             data: {
//               type: "unordered",
//               items: ["ویژگی اول", "ویژگی دوم", "ویژگی سوم"]
//             }
//           },
//           {
//             id: "block-4",
//             type: "image",
//             data: {
//               file: {
//                 url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HwAF/gL+Etrp9wAAAABJRU5ErkJggg=="
//               },
//               caption: "تصویر نمونه (Base64)"
//             }
//           },
//           {
//             id: "block-5",
//             type: "paragraph",
//             data: {
//               text:
//                 "متن طولانی برای تست عملکرد 'خواندن بیشتر'. " +
//                 "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(5)
//             }
//           }
//         ]
//       },
//       authorizedRoles: ["MANAGER", "ADMIN"]
//     },
//     {
//       firstName: "امیر",
//       lastName: "نوربینی",
//       avatar: "/files/USER_AVATAR/noiendbedoinfweopjbienpw.jpg",
//       username: "09352388350",
//       createdAtStr: "۱۴۰۳/۱۲/۲۸, ۳:۰۰:۱۵",
//       role: "MANAGER",
//       roleStr: "مدیر",
//       comment: {
//         time: 1742254731537,
//         blocks: [
//           {
//             id: "mhTl6ghSkV",
//             type: "paragraph",
//             data: {
//               text: "این یک متن آزمایشی است که باید بخشی از رکورد را نمایش دهد."
//             }
//           },
//           {
//             id: "l98dyx3yjb",
//             type: "header",
//             data: {
//               text: "ویژگی‌های مهم",
//               level: 3
//             }
//           },
//           {
//             id: "os_YI4eub4",
//             type: "list",
//             data: {
//               type: "unordered",
//               items: [
//                 "ویژگی اول",
//                 "ویژگی دوم",
//                 "ویژگی سوم"
//               ]
//             }
//           },
//           {
//             id: "1yKeXKxN7-",
//             type: "paragraph",
//             data: {
//               text: "متن طولانی برای تست عملکرد 'خواندن بیشتر'. " +
//                     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(5)
//             }
//           }
//         ]
//       },
//       authorizedRoles: ["MANAGER", "ADMIN"]
//     },
//     {
//       firstName: "سارا",
//       lastName: "کاظمی",
//       avatar: "", // No avatar provided, will fallback to the default image
//       username: "09351234567",
//       createdAtStr: "۱۴۰۳/۱۲/۲۹, ۱:۲۰:۰۰",
//       role: "EMPLOYEE",
//       roleStr: "کارمند",
//       comment: {
//         time: 1742254731538,
//         blocks: [
//           {
//             id: "record2-paragraph",
//             type: "paragraph",
//             data: {
//               text: "متن کوتاه و ساده برای رکورد دوم."
//             }
//           }
//         ]
//       },
//       authorizedRoles: ["EMPLOYEE"]
//     },
//     {
//       firstName: "رضا",
//       lastName: "حسینی",
//       avatar: "/files/USER_AVATAR/another.jpg",
//       username: "09357654321",
//       createdAtStr: "۱۴۰۳/۱۲/۳۰, ۵:۴۵:۳۰",
//       role: "SUPERVISOR",
//       roleStr: "سرپرست",
//       comment: {
//         time: 1742254731539,
//         blocks: [
//           {
//             id: "record3-header",
//             type: "header",
//             data: {
//               text: "گزارش عملکرد",
//               level: 3
//             }
//           },
//           {
//             id: "record3-paragraph",
//             type: "paragraph",
//             data: {
//               text: "این رکورد شامل گزارش کامل عملکرد روزانه می‌باشد و در آن تمام جزئیات ذکر شده است."
//             }
//           },
//           {
//             id: "record3-list",
//             type: "list",
//             data: {
//               type: "unordered",
//               items: [
//                 "کار اول انجام شده",
//                 "جلسه با تیم",
//                 "ارائه گزارش"
//               ]
//             }
//           },
//           {
//             id: "record3-paragraph2",
//             type: "paragraph",
//             data: {
//               text: "همچنین توجه داشته باشید که همه اطلاعات به‌صورت کامل و دقیق ثبت شده است. " +
//                     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(4)
//             }
//           }
//         ]
//       },
//       authorizedRoles: ["SUPERVISOR", "ADMIN"]
//     }
//   ];
  
//     /* <Typography variant="h6" className="font-bold mt-16 mb-8">
//         سوابق و رکوردهای این شرکت
//       </Typography>
//       */
//       const editorCardClassName = "p-10"
//   return (
//     <div>


//   <Typography variant="h6" className="font-bold mt-16 mb-8">
//         سوابق و رکوردهای این شرکت
//       </Typography>
//       <Controller
//         name="managementDesc"
//         control={control}
//         render={({ field }) => (
//           <TextField
//             {...field}
//             className="mt-8 mb-16 sm:mx-4"
//             multiline
//             minRows={5}
//             label="توضیحات مدیریت"
//             id="managementDesc"
//             variant="outlined"
//             fullWidth
//           />
//         )}
//       />
//       <Typography variant="h6" className="font-bold mt-16 mb-8">
//         ثبت رکورد جدید
//       </Typography>
//       <RecordsTimeline mockRecords={mockRecords} classes={{editorContainer: "mt-10 mb-10"}} editorComponent={<EditorJSComponent editorCardClassName={editorCardClassName} />} />

//     </div>
//   );
// }

// export default ManagementDescTab;
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Card, CircularProgress, Alert, Snackbar } from "@mui/material";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import RecordsTimeline from "./components/records-timeline/RecordsTimeline";
import EditorJSComponent from "app/shared-components/editor-js/EditorJSComponent";
import { 
  useGetEmployeeCommentsByEntityQuery, 
  useAddEmployeeCommentMutation, 
  useUpdateEmployeeCommentMutation, 
  useDeleteEmployeeCommentMutation 
} from "../../FoodIndustryBankApi";
import { selectUser, selectUserRole } from "src/app/auth/user/store/userSlice";

function ManagementDescTab() {
  const { control, watch } = useFormContext();
  const routeParams = useParams();
  const { companyId } = routeParams;
  const managementDesc = watch("managementDesc");
  
  // Get user info from Redux store instead of useAuth
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  
  // Create an array of user roles for permission checking
  const userRoles = user?.roles ? 
    (Array.isArray(user.roles) ? 
      user.roles.map(role => typeof role === 'object' ? role.name : role) : 
      [user.roles]) : 
    [];
    
  // Add the most authoritative role from userRole if it's not already in the array
  if (userRole && !userRoles.includes(userRole)) {
    userRoles.push(userRole);
  }
  
  // State for comment editor
  const [editorLoading, setEditorLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  
  // RTK Query hooks
  const { 
    data: commentsData,
    isLoading: isLoadingComments,
    refetch: refetchComments
  } = useGetEmployeeCommentsByEntityQuery({
    entityType: "Company", 
    entityId: companyId,
    pageNumber: currentPageNumber,
    pageSize
  }, { skip: !companyId });
  
  const [addComment, { isLoading: isAddingComment }] = useAddEmployeeCommentMutation();
  const [updateComment, { isLoading: isUpdatingComment }] = useUpdateEmployeeCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteEmployeeCommentMutation();
  
  // Processed data
  const [comments, setComments] = useState([]);
  const hasMore = currentPageNumber < totalPages;
  
  // Process comments data when it changes
  useEffect(() => {
    if (commentsData) {
      // Extract comments and pagination info
      const newComments = commentsData.data || [];
      setTotalPages(commentsData.pagination?.totalPages || 1);
      
      if (currentPageNumber === 1) {
        setComments(newComments);
      } else {
        // Append new comments to existing ones for infinite scroll
        setComments(prev => [...prev, ...newComments]);
      }
    }
  }, [commentsData, currentPageNumber]);
  
  // Load more comments
  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPageNumber(prev => prev + 1);
    }
  };
  
  // Handle adding a new comment
  const handleAddComment = async (editorData) => {
    setEditorLoading(true);
    try {
      const newComment = {
        entityType: "Company",
        entityId: companyId,
        comment: JSON.stringify(editorData), // Make sure to stringify EditorJS data
        isInternal: true,
        commentType: "MANAGEMENT",
      };
      
      await addComment(newComment).unwrap();
      
      // Reset to first page and refetch to show new comment
      setCurrentPageNumber(1);
      await refetchComments();
      
      setNotification({
        open: true,
        message: "نظر با موفقیت اضافه شد",
        severity: "success"
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      setNotification({
        open: true,
        message: "خطا در ثبت نظر. لطفا مجددا تلاش کنید.",
        severity: "error"
      });
    } finally {
      setEditorLoading(false);
    }
  };
  
  // Handle editing a comment
  const handleEditComment = async (data) => {
    try {
      const commentData = {
        entityType: "Company",
        entityId: companyId,
        comment: typeof data.commentData.comment === 'object' 
          ? JSON.stringify(data.commentData.comment) 
          : data.commentData.comment,
        isInternal: data.commentData.isInternal !== false,
        commentType: data.commentData.commentType || "MANAGEMENT",
      };
      
      await updateComment({
        id: data.id,
        commentData: commentData
      }).unwrap();
      
      // Refetch comments after update
      await refetchComments();
      
      setNotification({
        open: true,
        message: "نظر با موفقیت ویرایش شد",
        severity: "success"
      });
    } catch (error) {
      console.error("Error updating comment:", error);
      setNotification({
        open: true,
        message: "خطا در ویرایش نظر. لطفا مجددا تلاش کنید.",
        severity: "error"
      });
    }
  };
  
  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId).unwrap();
      
      // Refetch comments after deletion
      await refetchComments();
      
      setNotification({
        open: true,
        message: "نظر با موفقیت حذف شد",
        severity: "success"
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      setNotification({
        open: true,
        message: "خطا در حذف نظر. لطفا مجددا تلاش کنید.",
        severity: "error"
      });
    }
  };
  
  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Editor component to pass to RecordsTimeline
  const editorComponent = (
    <EditorJSComponent
      onSave={handleAddComment}
      loading={editorLoading || isAddingComment}
      buttonText="ثبت نظر جدید"
      editorCardClassName="p-10"
    />
  );

  return (
    <div>
      <Typography variant="h6" className="font-bold mt-16 mb-8">
        توضیحات مدیریت
      </Typography>
      <Controller
        name="adminComment"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16 sm:mx-4"
            multiline
            minRows={5}
            label="توضیحات مدیریت"
            id="adminComment"
            variant="outlined"
            fullWidth
          />
        )}
      />
      
      <Divider className="my-24" />
      
      <Typography variant="h6" className="font-bold mt-16 mb-8">
        سوابق و رکوردهای این شرکت
      </Typography>
      
      {isLoadingComments && comments.length === 0 ? (
        <div className="flex justify-center my-32">
          <CircularProgress />
        </div>
      ) : (
        <RecordsTimeline
          records={comments}
          loading={isLoadingComments}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          editorComponent={editorComponent}
          classes={{ editorContainer: "mt-10 mb-10" }}
          currentUserRoles={userRoles}
          entityType="Company"
          entityId={companyId}
        />
      )}
      
      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ManagementDescTab;