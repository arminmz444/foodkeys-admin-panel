import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Button,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  IconButton,
  Divider,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { X, Check, AlertTriangle } from "lucide-react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import {
  useAnswerServiceSubmitRequestMutation,
  useGetServiceRequestByIdQuery,
} from "../../ServicesBankApi";
import ConfirmationDialog from "./ConfirmationDialog";

// Service status options
const serviceStatusOptions = [
  { value: "PENDING", label: "در انتظار تایید" },
  { value: "VERIFIED", label: "تایید شده" },
  { value: "DENIED", label: "رد شده" },
  { value: "ARCHIVED", label: "غیرفعال" },
  { value: "DELETED", label: "حذف شده" },
];

export default function ApprovalModal({
  open,
  onClose,
  request,
  service,
  onActionComplete,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState("approve");
  const [formData, setFormData] = useState({
    answer: "APPROVED", // Or 'DENIED'
    description: "",
    additionalInfo: "",
    ranking: 0,
    rankingAll: 0,
    finalStatus: 0,
  });

  useEffect(() => {
    if (service) {
      setFormData((prev) => ({
        ...prev,
        ranking: service.ranking || 0,
        rankingAll: service.rankingAll || 0,
        finalStatus: service.status || 0,
      }));
    }
  }, [service]);

  const { data: workflowData, isLoading: isWorkflowLoading } =
    useGetServiceRequestByIdQuery(request?.requestId, {
      skip: !open || activeTab !== 1,
    });

  const [
    answerServiceSubmitRequest,
    {
      isLoading: isSubmitAnswerLoading,
      isError: isSubmitError,
      reset: resetSubmit,
    },
  ] = useAnswerServiceSubmitRequestMutation();

  const isLoading = isSubmitAnswerLoading;
  const isError = isSubmitError;

  const handleApprove = () => {
    setConfirmAction("approve");
    setFormData((prev) => ({ ...prev, answer: "APPROVED" }));
    setConfirmDialogOpen(true);
  };

  const handleReject = () => {
    setConfirmAction("reject");
    setFormData((prev) => ({ ...prev, answer: "DENIED" }));
    setConfirmDialogOpen(true);
  };

  const handleConfirm = async (comment) => {
    const updatedData = {
      ...formData,
      description: comment,
    };

    try {
      await answerServiceSubmitRequest({
        requestId: request.requestId,
        serviceId: request.serviceId,
        answerData: updatedData,
      }).unwrap();

      onClose();
      if (onActionComplete) {
        onActionComplete();
      }
    } catch (err) {
      console.error("Failed to answer request:", err);
    }

    setConfirmDialogOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    resetSubmit();
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("jYYYY/jMM/jDD");
  };

  const getStatusChip = (status) => {
    const colors = {
      Submitted: "bg-cyan-100 text-cyan-800",
      Approved: "bg-green-100 text-green-800",
      Denied: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
    };
    const persianNames = {
      Submitted: "ثبت شده",
      Approved: "تایید شده",
      Denied: "رد شده",
      Pending: "در انتظار تایید",
    };
    return (
      <span className={`px-2 py-1 rounded text-sm ${colors[status]}`}>
        {persianNames[status]}
      </span>
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle className="flex justify-between items-center">
          <div className="flex-1">
            <Typography variant="h6">
              بررسی درخواست: {service?.name || request?.serviceName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              شناسه درخواست: {request?.requestId}
            </Typography>
          </div>
          <IconButton onClick={handleClose} size="small">
            <X />
          </IconButton>
        </DialogTitle>

        <Divider />

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="وضعیت درخواست" />
            <Tab label="گردش کار" />
            <Tab label="اطلاعات سرویس" />
          </Tabs>
        </Box>

        <DialogContent>
          {activeTab === 0 && (
            <div>
              {request?.requestStatus === "PENDING" ? (
                <>
                  {isError && (
                    <Alert
                      severity="error"
                      sx={{ mb: 2 }}
                      action={
                        <Button
                          color="inherit"
                          size="small"
                          onClick={() => {
                            resetSubmit();
                          }}
                        >
                          پاک کردن
                        </Button>
                      }
                    >
                      خطا در ثبت پاسخ. لطفا دوباره تلاش کنید.
                    </Alert>
                  )}

                  <Box className="flex gap-2 mb-16 ms-2">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleApprove}
                      startIcon={<Check />}
                      disabled={isLoading}
                    >
                      تایید
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReject}
                      startIcon={<AlertTriangle />}
                      disabled={isLoading}
                      className="ms-4"
                    >
                      رد
                    </Button>

                    {isLoading && <CircularProgress size={24} sx={{ ml: 2 }} />}
                  </Box>

                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="رتبه بندی"
                        name="ranking"
                        type="number"
                        value={formData.ranking}
                        onChange={handleChange}
                        helperText="رتبه بندی سرویس در دسته‌بندی خودش"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="رتبه بندی کلی"
                        name="rankingAll"
                        type="number"
                        value={formData.rankingAll}
                        onChange={handleChange}
                        helperText="رتبه بندی سرویس در بین تمام سرویس‌ها"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="وضعیت نهایی سرویس"
                        name="finalStatus"
                        value={formData.finalStatus}
                        onChange={handleChange}
                        helperText="وضعیت سرویس پس از تایید/رد درخواست"
                      >
                        {serviceStatusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="توضیحات اضافی"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        helperText="توضیحات اضافی برای ثبت در سیستم (اختیاری)"
                      />
                    </Grid>
                  </Grid>
                </>
              ) : (
                <Alert
                  severity={
                    request?.requestStatus === "APPROVED"
                      ? "success"
                      : "warning"
                  }
                  sx={{ mb: 3 }}
                >
                  {request?.requestStatus === "APPROVED"
                    ? "این درخواست قبلاً تایید شده است."
                    : "این درخواست قبلاً رد شده است."}
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    نام سرویس:
                  </Typography>
                  <Typography>{service?.name || request?.serviceName || "-"}</Typography>
                </div>
                <div>
                  <Typography className="mt-8" variant="subtitle2" color="text.secondary">
                   زیرشاخه:
                  </Typography>
                  <Typography>{service?.subCategoryName || "-"}</Typography>
                </div>
                {/* <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    کلمات کلیدی:
                  </Typography>
                  <Typography>{service?.keyWords || "-"}</Typography>
                </div> */}
                <div>
                  <Typography className="mt-8" variant="subtitle2" color="text.secondary">
                    توضیحات:
                  </Typography>
                  <Typography>{service?.description || "-"}</Typography>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-6">
              <Typography variant="h6" gutterBottom>
                گردش کاری درخواست
              </Typography>

              {isWorkflowLoading ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {workflowData?.workflowSteps?.map((step, index) => {
                    const stepRequest = step.request;
                    return (
                      <div
                        key={index}
                        className="grid grid-cols-4 gap-4 items-center p-3 border-b"
                      >
                        <Typography fontWeight={500}>
                          {stepRequest.requestType === "ADMIN_REVIEW"
                            ? "بررسی مدیر"
                            : stepRequest.requestType === "SUBMIT_SERVICE"
                              ? "ثبت سرویس"
                              : stepRequest.requestType === "UPDATE_SERVICE"
                                ? "به‌روزرسانی سرویس"
                                : stepRequest.requestType === "CONSUMER_CREATE_SERVICE_REQUEST"
                                  ? "درخواست ایجاد سرویس"
                                  : stepRequest.requestType === "CONSUMER_UPDATE_SERVICE_REQUEST"
                                    ? "درخواست ویرایش سرویس"
                                    : stepRequest.requestType === "CONSUMER_DELETE_SERVICE_REQUEST"
                                      ? "درخواست حذف سرویس"
                                      : "مرحله درخواست"}{" "}
                          {step.stepNumber ? `(مرحله ${step.stepNumber})` : ""}
                        </Typography>
                        {getStatusChip(
                          stepRequest.requestStatus === "APPROVED"
                            ? "Approved"
                            : stepRequest.requestStatus === "DENIED"
                              ? "Denied"
                              : stepRequest.requestStatus === "PENDING"
                                ? "Pending"
                                : "Submitted"
                        )}
                        <div className="ms-8">
                          <Typography variant="body2">
                            درخواست‌کننده: {stepRequest.requesterFullName || "کاربر"}
                          </Typography>
                          {stepRequest.responderFullName && (
                            <Typography className="mt-8" variant="body2">
                              پاسخ‌دهنده: {stepRequest.responderFullName}
                            </Typography>
                          )}
                        </div>
                        <div>
                          <Typography>{stepRequest.createdAtStr || "-"}</Typography>
                          {stepRequest.answeredAtStr && (
                            <Typography variant="body2">
                              تاریخ پاسخ: {stepRequest.answeredAtStr}
                            </Typography>
                          )}
                          {stepRequest.description && (
                            <Typography color="text.secondary" variant="body2">
                              توضیحات: {stepRequest.description}
                            </Typography>
                          )}
                          {step.childRequests > 0 && (
                            <Typography variant="caption" color="primary">
                              {step.childRequests} درخواست مرتبط
                            </Typography>
                          )}
                        </div>
                      </div>
                    );
                  }) || [
                    {
                      taskNode: "ثبت درخواست",
                      status: "Submitted",
                      user: request?.requester?.name || "کاربر",
                      timestamp: request?.createdAtStr || "-",
                    },
                    ...(request?.requestStatus === "PENDING"
                      ? [
                          {
                            taskNode: "تایید نهایی",
                            status: "Pending",
                            user: "مدیر سیستم",
                            timestamp: "-",
                          },
                        ]
                      : []),
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 items-center p-3 border-b"
                    >
                      <Typography fontWeight={500}>{step.taskNode}</Typography>
                      {getStatusChip(step.status)}
                      <div className="ms-8">
                        <Typography variant="body2">
                          درخواست‌کننده: {step.user}
                        </Typography>
                      </div>
                      <div>
                        <Typography>{step.timestamp}</Typography>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {request?.metadata && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    اطلاعات متادیتا:
                  </Typography>
                  <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-60">
                    {request.metadata}
                  </pre>
                </Box>
              )}
            </div>
          )}

          {/* Tab 3: Service Details */}
          {activeTab === 2 && (
            <Box className="space-y-2">
              {/* Service Introduction */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>معرفی سرویس</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">نام سرویس</Typography>
                      <Typography>{service?.name || "-"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">زیردسته</Typography>
                      <Typography>{service?.subCategory?.name || "-"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">رتبه</Typography>
                      <Typography>{service?.ranking || "-"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">رتبه کلی</Typography>
                      <Typography>{service?.rankingAll || "-"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">وضعیت</Typography>
                      <Typography>{service?.status || "-"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">بازدید</Typography>
                      <Typography>{service?.visit || "0"}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">توضیحات</Typography>
                      <Typography>{service?.description || "-"}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">کلمات کلیدی</Typography>
                      <Typography>{service?.keyWords || "-"}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">برچسب‌ها</Typography>
                      <Typography>{service?.tags || "-"}</Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Service Schema */}
              {service?.schema && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={500}>اسکیمای سرویس</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-60">
                      {JSON.stringify(service.schema, null, 2)}
                    </pre>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Audit Information */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>اطلاعات ممیزی</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">تاریخ ایجاد</Typography>
                      <Typography>{formatDate(service?.createdAt)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">تاریخ بروزرسانی</Typography>
                      <Typography>{formatDate(service?.updatedAt)}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">وضعیت</Typography>
                      <Typography>{service?.status || "-"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">رتبه‌بندی</Typography>
                      <Typography>{service?.ranking || "-"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">رتبه‌بندی کلی</Typography>
                      <Typography>{service?.rankingAll || "-"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">بازدید</Typography>
                      <Typography>{service?.visit || "0"}</Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={confirmDialogOpen}
        title={confirmAction === "approve" ? "تایید درخواست" : "رد درخواست"}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
