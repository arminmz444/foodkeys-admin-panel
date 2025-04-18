import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  Divider,
} from '@mui/material';
import {
  PlayArrow as ProcessIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  RemoveRedEye as ViewIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import {
  useGetArchiveTasksQuery,
  useGetArchiveTasksByEntityQuery,
  useProcessArchiveTaskMutation,
  useCancelArchiveTaskMutation,
  useDeleteArchiveTaskMutation,
} from './store/archiveApi';
import ConfirmDialog from './ConfirmDialog';
import ArchiveTaskNotFound from './ArchiveTaskNotFound';

function ArchiveTaskList({
  entityType,
  entityId,
  searchText,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onShowSnackbar,
}) {
  const navigate = useNavigate();

  const [selectedTask, setSelectedTask] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Fetch tasks - either all or by entity
  const tasksQuery = entityType && entityId
    ? useGetArchiveTasksByEntityQuery({
        entityType,
        entityId,
        page,
        size: rowsPerPage,
        searchText: searchText || undefined,
      })
    : useGetArchiveTasksQuery({
        page,
        size: rowsPerPage,
        searchText: searchText || undefined,
      });

  const { data: tasksData, isLoading, error, refetch } = tasksQuery;

  // Mutations
  const [processTask, { isLoading: isProcessing }] = useProcessArchiveTaskMutation();
  const [cancelTask, { isLoading: isCanceling }] = useCancelArchiveTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteArchiveTaskMutation();

  // Handle menu open
  const handleMenuOpen = (event, task) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Handle view result archive
  const handleViewResultArchive = (archiveId) => {
    if (!archiveId) {
      onShowSnackbar("این وظیفه هنوز آرشیوی ایجاد نکرده است", "warning");
      return;
    }

    navigate(`/apps/archive/${archiveId}`);
    handleMenuClose();
  };
  
  // Handle view task details
  const handleViewTaskDetails = (taskId) => {
    navigate(`/apps/archive-tasks/${taskId}`);
    handleMenuClose();
  };

  // Prepare for process
  const handlePrepareProcess = (task) => {
    setConfirmAction({
      type: "process",
      taskId: task.id,
      name: task.name,
    });
    setConfirmDialogOpen(true);
    handleMenuClose();
  };

  // Prepare for cancel
  const handlePrepareCancel = (task) => {
    setConfirmAction({
      type: "cancel",
      taskId: task.id,
      name: task.name,
    });
    setConfirmDialogOpen(true);
    handleMenuClose();
  };

  // Prepare for delete
  const handlePrepareDelete = (task) => {
    setConfirmAction({
      type: "delete",
      taskId: task.id,
      name: task.name,
    });
    setConfirmDialogOpen(true);
    handleMenuClose();
  };

  // Execute process
  const handleProcess = async () => {
    if (!confirmAction) return;

    try {
      await processTask(confirmAction.taskId).unwrap();
      onShowSnackbar(`وظیفه آرشیو با موفقیت پردازش شد`, "success");
      refetch();
    } catch (error) {
      onShowSnackbar(
        `خطا در پردازش وظیفه آرشیو: ${error.message || "خطای ناشناخته"}`,
        "error"
      );
    } finally {
      setConfirmDialogOpen(false);
      setConfirmAction(null);
    }
  };

  // Execute cancel
  const handleCancel = async () => {
    if (!confirmAction) return;

    try {
      await cancelTask(confirmAction.taskId).unwrap();
      onShowSnackbar(`وظیفه آرشیو با موفقیت لغو شد`, "success");
      refetch();
    } catch (error) {
      onShowSnackbar(
        `خطا در لغو وظیفه آرشیو: ${error.message || "خطای ناشناخته"}`,
        "error"
      );
    } finally {
      setConfirmDialogOpen(false);
      setConfirmAction(null);
    }
  };

  // Execute delete
  const handleDelete = async () => {
    if (!confirmAction) return;

    try {
      await deleteTask(confirmAction.taskId).unwrap();
      onShowSnackbar(`وظیفه آرشیو با موفقیت حذف شد`, "success");
      refetch();
    } catch (error) {
      onShowSnackbar(
        `خطا در حذف وظیفه آرشیو: ${error.message || "خطای ناشناخته"}`,
        "error"
      );
    } finally {
      setConfirmDialogOpen(false);
      setConfirmAction(null);
    }
  };

  // Execute confirm action
  const handleConfirmAction = () => {
    switch (confirmAction?.type) {
      case 'process':
        handleProcess();
        break;
      case 'cancel':
        handleCancel();
        break;
      case 'delete':
        handleDelete();
        break;
      default:
        setConfirmDialogOpen(false);
        setConfirmAction(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPpp', { locale: faIR });
    } catch (e) {
      return dateString || '-';
    }
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "default";
      case "PROCESSING":
        return "info";
      case "COMPLETED":
        return "success";
      case "FAILED":
        return "error";
      case "CANCELED":
        return "warning";
      default:
        return "default";
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "در انتظار";
      case "PROCESSING":
        return "در حال پردازش";
      case "COMPLETED":
        return "تکمیل شده";
      case "FAILED":
        return "ناموفق";
      case "CANCELED":
        return "لغو شده";
      default:
        return status;
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Box className="w-full flex justify-center items-center p-32">
        <CircularProgress />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box className="w-full p-32">
        <Typography color="error" className="text-center">
          خطا در بارگذاری وظایف آرشیو: {error.message || "خطای ناشناخته"}
        </Typography>
      </Box>
    );
  }

  // Render empty state
  if (!tasksData?.data || tasksData.data.length === 0) {
    return <ArchiveTaskNotFound onRefresh={refetch} />;
  }

  return (
    <div className="w-full flex flex-col p-16 md:p-24">
      {/* Loading overlay */}
      {(isProcessing || isCanceling || isDeleting) && (
        <Box className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-20 z-10">
          <CircularProgress />
        </Box>
      )}

      {/* Tasks table */}
      <TableContainer component={Paper} className="mb-24">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>نام وظیفه</TableCell>
              <TableCell>نوع موجودیت</TableCell>
              <TableCell>نوع آرشیو</TableCell>
              <TableCell>وضعیت</TableCell>
              <TableCell>ایجاد کننده</TableCell>
              <TableCell>تاریخ ایجاد</TableCell>
              <TableCell align="right">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasksData.data.map((task) => (
              <TableRow key={task.id} hover>
                <TableCell>
                  <Typography 
                    variant="body2"
                    className="cursor-pointer hover:underline"
                    onClick={() => handleViewTaskDetails(task.id)}
                  >
                    {task.name}
                  </Typography>
                </TableCell>
                <TableCell>{task.entityName || "-"}</TableCell>
                <TableCell>{task.archiveType || "-"}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(task.status)}
                    color={getStatusColor(task.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{task.createdBy || "-"}</TableCell>
                <TableCell>{formatDate(task.createdAt)}</TableCell>
                <TableCell align="right">
                  <Box className="flex justify-end">
                    {task.status === "PENDING" && (
                      <Tooltip title="پردازش">
                        <IconButton
                          size="small"
                          onClick={() => handlePrepareProcess(task)}
                        >
                          <ProcessIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {task.resultArchiveId && (
                      <Tooltip title="مشاهده آرشیو">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleViewResultArchive(task.resultArchiveId)
                          }
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="بیشتر">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, task)}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {tasksData?.pagination?.totalPages > 1 && (
        <Box className="flex justify-center mt-16">
          <Pagination
            count={tasksData.pagination.totalPages}
            page={page + 1}
            onChange={(e, value) => onPageChange(e, value - 1)}
          />
        </Box>
      )}

      {/* Context menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={() => selectedTask && handleViewTaskDetails(selectedTask.id)}
        >
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="مشاهده جزئیات" />
        </MenuItem>

        {selectedTask?.resultArchiveId && (
          <MenuItem
            onClick={() =>
              handleViewResultArchive(selectedTask.resultArchiveId)
            }
          >
            <ListItemIcon>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="مشاهده آرشیو" />
          </MenuItem>
        )}

        {selectedTask?.status === "PENDING" && (
          <MenuItem onClick={() => handlePrepareProcess(selectedTask)}>
            <ListItemIcon>
              <ProcessIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="پردازش" />
          </MenuItem>
        )}

        {(selectedTask?.status === "PENDING" ||
          selectedTask?.status === "PROCESSING") && (
          <MenuItem onClick={() => handlePrepareCancel(selectedTask)}>
            <ListItemIcon>
              <CancelIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="لغو" />
          </MenuItem>
        )}

        <Divider />

        <MenuItem
          onClick={() => handlePrepareDelete(selectedTask)}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon sx={{ color: "error.main" }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="حذف" />
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={confirmDialogOpen}
        title={
          confirmAction?.type === "delete"
            ? "حذف وظیفه آرشیو"
            : confirmAction?.type === "cancel"
              ? "لغو وظیفه آرشیو"
              : "پردازش وظیفه آرشیو"
        }
        content={
          confirmAction?.type === "delete"
            ? `آیا از حذف وظیفه آرشیو "${confirmAction?.name}" اطمینان دارید؟ این عمل غیرقابل بازگشت است.`
            : confirmAction?.type === "cancel"
              ? `آیا از لغو وظیفه آرشیو "${confirmAction?.name}" اطمینان دارید؟`
              : `آیا از پردازش وظیفه آرشیو "${confirmAction?.name}" اطمینان دارید؟`
        }
        confirmText={
          confirmAction?.type === "delete"
            ? "حذف"
            : confirmAction?.type === "cancel"
              ? "لغو"
              : "پردازش"
        }
        cancelText="انصراف"
        confirmColor={
          confirmAction?.type === "delete"
            ? "error"
            : confirmAction?.type === "cancel"
              ? "warning"
              : "primary"
        }
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setConfirmDialogOpen(false);
          setConfirmAction(null);
        }}
      />
    </div>
  );
}

export default ArchiveTaskList;