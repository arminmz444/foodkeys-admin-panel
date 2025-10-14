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
} from "../../AgricultureIndustryApi";
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