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
  Link,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Divider,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { X, Check, AlertTriangle, ExternalLink } from "lucide-react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
// import jalaali from 'dayjs/plugin/jalaali';
import {
  useAnswerCompanySubmitRequestMutation,
  useAnswerCompanyRevisionRequestMutation,
  useGetRequestWorkflowQuery,
} from "../../FoodIndustryBankApi";
import ConfirmationDialog from "./ConfirmationDialog";

// dayjs.extend(jalaali);

const companyStatusOptions = [
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
    if (request?.company) {
      setFormData((prev) => ({
        ...prev,
        ranking: request.company.ranking || 0,
        rankingAll: request.company.rankingAll || 0,
        finalStatus: request.company.status || 0,
      }));
    }
  }, [request]);

  const { data: workflowData, isLoading: isWorkflowLoading } =
    useGetRequestWorkflowQuery(request?.requestId, {
      skip: !open || activeTab !== 1,
    });

  const [
    answerCompanySubmitRequest,
    {
      isLoading: isSubmitAnswerLoading,
      isError: isSubmitError,
      reset: resetSubmit,
    },
  ] = useAnswerCompanySubmitRequestMutation();

  const [
    answerCompanyRevisionRequest,
    {
      isLoading: isRevisionAnswerLoading,
      isError: isRevisionError,
      reset: resetRevision,
    },
  ] = useAnswerCompanyRevisionRequestMutation();

  const isLoading = isSubmitAnswerLoading || isRevisionAnswerLoading;
  const isError = isSubmitError || isRevisionError;

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
      if (request.requestType === 5) {
        await answerCompanyRevisionRequest({
          companyId: request.company.id,
          requestId: request.requestId,
          answerData: {
            answer: updatedData.answer,
            description: updatedData.description,
            ranking: updatedData.ranking,
          },
        }).unwrap();
      } else {
        await answerCompanySubmitRequest({
          companyId: request.company.id,
          requestId: request.requestId,
          answerData: updatedData,
        }).unwrap();
      }

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
    resetRevision();
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("jYYYY/jMM/jDD");
  };

  // const approvalWorkflowSteps = workflowData?.workflowSteps || [
  //   {
  //     taskNode: "ثبت درخواست",
  //     status: "Submitted",
  //     user: request?.requester
  //       ? `${request.requester.name || ""}`
  //       : "کاربر",
  //     timestamp: request?.createdAt
  //       ? dayjs(request.createdAt).format("YYYY-MM-DD HH:mm:ss")
  //       : "-",
  //   },
  //   ...(request?.answeredAt
  //     ? [
  //         {
  //           taskNode: "پاسخ به درخواست",
  //           status: request?.requestStatus === 2 ? "Approved" : "Denied",
  //           user: request?.responder
  //             ? `${request.responder.firstName || ""} ${request.responder.lastName || ""}`
  //             : "کارشناس",
  //           timestamp: dayjs(request?.answeredAt).format("YYYY-MM-DD HH:mm:ss"),
  //           comment: request?.employeeComment,
  //         },
  //       ]
  //     : []),
  //   ...(request?.requestStatus === 1
  //     ? [
  //         {
  //           taskNode: "تایید نهایی",
  //           status: "Pending",
  //           user: "مدیر سیستم",
  //           timestamp: "-",
  //         },
  //       ]
  //     : []),
  // ];

  const approvalWorkflowSteps = workflowData?.workflowSteps?.map((step) => {
    const stepRequest = step.request;
    return {
      taskNode:
        stepRequest.requestType === "ADMIN_REVIEW"
          ? "بررسی مدیر"
          : stepRequest.requestType === "SUBMIT_COMPANY"
            ? "ثبت شرکت"
            : "مرحله درخواست",
      status:
        stepRequest.requestStatus === "APPROVED"
          ? "Approved"
          : stepRequest.requestStatus === "DENIED"
            ? "Denied"
            : stepRequest.requestStatus === "PENDING"
              ? "Pending"
              : "Submitted",
      user: stepRequest.requesterFullName || "کاربر",
      timestamp: stepRequest.createdAtStr || "-",
      answeredByUser: stepRequest.responderFullName,
      answeredAt: stepRequest.answeredAtStr,
      stepNumber: step.stepNumber,
      comment: stepRequest.description || "",
      childRequests: step.childRequests?.length || 0,
    };
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
  ];

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
    }
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
              بررسی درخواست: {request?.company?.name}
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
            <Tab label="اطلاعات شرکت" />
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
                            resetRevision();
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
                        helperText="رتبه بندی شرکت در دسته‌بندی خودش"
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
                        helperText="رتبه بندی شرکت در بین تمام شرکت‌ها"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="وضعیت نهایی شرکت"
                        name="finalStatus"
                        value={formData.finalStatus}
                        onChange={handleChange}
                        helperText="وضعیت شرکت پس از تایید/رد درخواست"
                      >
                        {companyStatusOptions.map((option) => (
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
                    نام شرکت:
                  </Typography>
                  <Typography>{request?.company?.name || "-"}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    نام انگلیسی:
                  </Typography>
                  <Typography>{request?.company?.nameEn || "-"}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    مدیرعامل:
                  </Typography>
                  <Typography>{request?.company?.ceo || "-"}</Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    شماره تماس مدیرعامل:
                  </Typography>
                  <Typography>
                    {request?.company?.ceoPhoneNumber || "-"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    تاریخ تاسیس:
                  </Typography>
                  <Typography>
                    {formatDate(request?.company?.establishDate)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2" color="text.secondary">
                    نوع شرکت:
                  </Typography>
                  <Typography>
                    {request?.company?.companyTypeStr || "-"}
                  </Typography>
                </div>
              </div>

              {request?.company?.products &&
                request.company.products.length > 0 && (
                  <>
                    <Typography variant="subtitle1" className="mb-2">
                      محصولات:
                    </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>نام محصول</TableCell>
                          <TableCell>توضیحات</TableCell>
                          <TableCell>دسته‌بندی</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {request.company.products.map((product, index) => (
                          <TableRow key={product.id || index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                              {product.description
                                ? product.description.substring(0, 50) +
                                  (product.description.length > 50 ? "..." : "")
                                : "-"}
                            </TableCell>
                            <TableCell>{product.categoryType || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                )}

              {request?.company?.contacts &&
                request.company.contacts.length > 0 && (
                  <>
                    <Typography variant="subtitle1" className="mt-6 mb-2">
                      اطلاعات تماس:
                    </Typography>
                    <Grid container spacing={2}>
                      {request.company.contacts.map((contact, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                          <Box
                            sx={{
                              border: "1px solid #eee",
                              p: 2,
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {contact.name} {contact.lastName}
                            </Typography>
                            <Typography variant="body2">
                              {contact.position &&
                                `${contact.position} ${contact.isCEO ? "(مدیرعامل)" : ""}`}
                            </Typography>
                            <Typography variant="body2">
                              {contact.email && (
                                <span>ایمیل: {contact.email}</span>
                              )}
                            </Typography>
                            <Typography variant="body2">
                              {contact.phone && (
                                <span>تلفن: {contact.phone}</span>
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}

              <Box className="mt-6">
                <Typography variant="subtitle2" color="text.secondary">
                  موضوع فعالیت:
                </Typography>
                <Typography paragraph>
                  {request?.company?.subjectOfActivity || "-"}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  توضیحات:
                </Typography>
                <Typography paragraph>
                  {request?.company?.description || "-"}
                </Typography>
              </Box>
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
                  {approvalWorkflowSteps.map((step, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 items-center p-3 border-b"
                    >
                      <Typography fontWeight={500}>
                        {step.taskNode}{" "}
                        {step.stepNumber ? `(مرحله ${step.stepNumber})` : ""}
                      </Typography>
                      {getStatusChip(step.status)}
                      <div className="ms-8">
                        <Typography variant="body2">
                          درخواست‌کننده: {step.user}
                        </Typography>
                        {step.answeredByUser && (
                          <Typography className="mt-8" variant="body2">
                            پاسخ‌دهنده: {step.answeredByUser}
                          </Typography>
                        )}
                      </div>
                      <div>
                        <Typography>{step.timestamp}</Typography>
                        {step.answeredAt && (
                          <Typography variant="body2">
                            تاریخ پاسخ: {step.answeredAt}
                          </Typography>
                        )}
                        {step.comment && (
                          <Typography color="text.secondary" variant="body2">
                            توضیحات: {step.comment}
                          </Typography>
                        )}
                        {step.childRequests > 0 && (
                          <Typography variant="caption" color="primary">
                            {step.childRequests} درخواست مرتبط
                          </Typography>
                        )}
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

          {/* Tab 3: Company Details */}
          {activeTab === 2 && (
            <Box className="space-y-2">
              {/* Company Introduction */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>معرفی شرکت</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">نام شرکت</Typography>
                      <Typography>
                        {request?.company?.companyName || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">نام انگلیسی</Typography>
                      <Typography>
                        {request?.company?.companyNameEn || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">نوع شرکت</Typography>
                      <Typography>
                        {request?.company?.companyType || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">تاریخ تاسیس</Typography>
                      <Typography>
                        {request?.company?.establishDateStr ||
                          (request?.company?.establishDate
                            ? formatDate(request?.company?.establishDate)
                            : "ثبت نشده")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">تعداد کارکنان</Typography>
                      <Typography>
                        {request?.company?.employeesCount || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">موضوع فعالیت</Typography>
                      <Typography>
                        {request?.company?.subjectOfActivity || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">توضیحات</Typography>
                      <Typography>
                        {request?.company?.description || "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Company History */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>تاریخچه</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography paragraph>
                    {request?.company?.history || "اطلاعات تاریخچه موجود نیست."}
                  </Typography>
                </AccordionDetails>
              </Accordion>

              {/* Products and Services */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>محصولات و خدمات</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {request?.company?.products &&
                  request.company.products.length > 0 ? (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>نام محصول</TableCell>
                          <TableCell>دسته‌بندی</TableCell>
                          <TableCell>برون‌سپاری</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {request.company.products.map((product, index) => (
                          <TableRow key={product.id || index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.categoryType || "-"}</TableCell>
                            <TableCell>
                              {product.isOutsourced ? "بله" : "خیر"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography>محصولی ثبت نشده است.</Typography>
                  )}

                  {request?.company?.productTitles && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">
                        عناوین محصولات:
                      </Typography>
                      <Typography>{request.company.productTitles}</Typography>
                    </Box>
                  )}

                  {request?.company?.outSourcedProductTitles && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">
                        محصولات برون‌سپاری شده:
                      </Typography>
                      <Typography>
                        {request.company.outSourcedProductTitles}
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Contact Information */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>اطلاعات تماس</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {request?.company?.contacts &&
                    request.company.contacts.length > 0 ? (
                      request.company.contacts.map((contact, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                          <Box
                            sx={{
                              border: "1px solid #eee",
                              p: 2,
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {contact.name} {contact.lastName}
                            </Typography>
                            <Typography variant="body2">
                              {contact.position &&
                                `${contact.position} ${contact.isCEO ? "(مدیرعامل)" : ""}`}
                            </Typography>
                            <Typography variant="body2">
                              {contact.email && (
                                <span>ایمیل: {contact.email}</span>
                              )}
                            </Typography>
                            <Typography variant="body2">
                              {contact.phone && (
                                <span>تلفن: {contact.phone}</span>
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <Typography>اطلاعات تماسی ثبت نشده است.</Typography>
                      </Grid>
                    )}

                    {request?.company?.tels &&
                      request.company.tels.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" gutterBottom>
                            شماره تلفن‌ها:
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>نوع</TableCell>
                                <TableCell>شماره</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {request.company.tels.map((tel, index) => (
                                <TableRow key={tel.id || index}>
                                  <TableCell>{tel.telType || "-"}</TableCell>
                                  <TableCell>{tel.telNumber}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Grid>
                      )}
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Social Media */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>شبکه‌های اجتماعی</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {request?.company?.socialMedias &&
                  request.company.socialMedias.length > 0 ? (
                    <Grid container spacing={2}>
                      {request.company.socialMedias.map((social, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                          <Typography variant="subtitle2">
                            {social.type}
                          </Typography>
                          <Link
                            href={
                              social.name.startsWith("http")
                                ? social.name
                                : `https://${social.name}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            {social.name}
                            <ExternalLink size={12} />
                          </Link>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography>شبکه اجتماعی ثبت نشده است.</Typography>
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Location */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>موقعیت مکانی</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {request?.company?.location ? (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">کشور</Typography>
                        <Typography>
                          {request.company.location.country || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">شهر صنعتی</Typography>
                        <Typography>
                          {request.company.location.industrialCity || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">موقعیت دفتر</Typography>
                        <Typography>
                          {request.company.location.officeLocation || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">استان دفتر</Typography>
                        <Typography>
                          {request.company.location.officeState || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">شهر دفتر</Typography>
                        <Typography>
                          {request.company.location.officeCity || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                          صندوق پستی دفتر
                        </Typography>
                        <Typography>
                          {request.company.location.officePoBox || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                          موقعیت کارخانه
                        </Typography>
                        <Typography>
                          {request.company.location.factoryLocation || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                          استان کارخانه
                        </Typography>
                        <Typography>
                          {request.company.location.factoryState || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">شهر کارخانه</Typography>
                        <Typography>
                          {request.company.location.factoryCity || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                          صندوق پستی کارخانه
                        </Typography>
                        <Typography>
                          {request.company.location.factoryPoBox || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2">آدرس کامل</Typography>
                        <Typography>
                          {request.company.location.fullAddress || "-"}
                        </Typography>
                      </Grid>

                      {request.company.location.longitude &&
                        request.company.location.latitude && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom>
                              مختصات جغرافیایی:
                            </Typography>
                            <Typography>
                              طول جغرافیایی:{" "}
                              {request.company.location.longitude}, عرض
                              جغرافیایی: {request.company.location.latitude}
                            </Typography>
                            <Box
                              sx={{
                                height: 200,
                                width: "100%",
                                bgcolor: "action.hover",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mt: 1,
                              }}
                            >
                              <Typography color="text.secondary">
                                محل نمایش نقشه
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                    </Grid>
                  ) : (
                    <Typography>اطلاعات مکانی ثبت نشده است.</Typography>
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Leadership & Ownership */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>مدیریت و مالکیت</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">مالک</Typography>
                      <Typography>{request?.company?.owner || "-"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">مدیرعامل</Typography>
                      <Typography>{request?.company?.ceo || "-"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">تلفن مدیرعامل</Typography>
                      <Typography>
                        {request?.company?.ceoPhoneNumber || "-"}
                      </Typography>
                    </Grid>
                  </Grid>

                  {request?.company?.stakeholders &&
                    request.company.stakeholders.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          سهامداران:
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>#</TableCell>
                              <TableCell>نام</TableCell>
                              <TableCell>نام خانوادگی</TableCell>
                              <TableCell>تلفن</TableCell>
                              <TableCell>ایمیل</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {request.company.stakeholders.map(
                              (stakeholder, index) => (
                                <TableRow key={stakeholder.id || index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{stakeholder.name}</TableCell>
                                  <TableCell>
                                    {stakeholder.lastName || "-"}
                                  </TableCell>
                                  <TableCell>
                                    {stakeholder.phone || "-"}
                                  </TableCell>
                                  <TableCell>
                                    {stakeholder.email || "-"}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    )}

                  {request?.company?.companyStakeholders && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">
                        اطلاعات سهامداران (متنی):
                      </Typography>
                      <Typography>
                        {request.company.companyStakeholders}
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Additional Information */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>اطلاعات تکمیلی</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">شعار تبلیغاتی</Typography>
                      <Typography>
                        {request?.company?.advertisingSlogan || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">هولدینگ</Typography>
                      <Typography>
                        {request?.company?.holding || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">
                        منشا مواد اولیه
                      </Typography>
                      <Typography>
                        {request?.company?.rawMaterialsOrigin || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">مساحت ساختمان</Typography>
                      <Typography>
                        {request?.company?.buildingArea || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">مساحت زمین</Typography>
                      <Typography>
                        {request?.company?.landArea || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">کلمات کلیدی</Typography>
                      <Typography>
                        {request?.company?.keyWords || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">برچسب‌ها</Typography>
                      <Typography>{request?.company?.tags || "-"}</Typography>
                    </Grid>
                  </Grid>

                  {request?.company?.additionalInfo && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2">
                        اطلاعات اضافی:
                      </Typography>
                      <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-60">
                        {request.company.additionalInfo}
                      </pre>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Registrant Information */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>اطلاعات ثبت‌کننده</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">نام ثبت‌کننده</Typography>
                      <Typography>
                        {request?.company?.registrant || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">
                        نام کاربری ثبت‌کننده
                      </Typography>
                      <Typography>
                        {request?.company?.registrantUsername || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">
                        تلفن ثبت‌کننده
                      </Typography>
                      <Typography>
                        {request?.company?.registrantPhone || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">
                        تلفن ثابت ثبت‌کننده
                      </Typography>
                      <Typography>
                        {request?.company?.registrantTel || "-"}
                      </Typography>
                    </Grid>
                  </Grid>

                  {request?.company?.registrantUser && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        اطلاعات کاربر ثبت‌کننده:
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            نام:{" "}
                            {request.company.registrantUser.firstName || "-"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            نام خانوادگی:{" "}
                            {request.company.registrantUser.lastName || "-"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            ایمیل: {request.company.registrantUser.email || "-"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            تلفن: {request.company.registrantUser.phone || "-"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Industry & Categories */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>صنعت و دسته‌بندی</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {request?.company?.subCategory && (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                          دسته‌بندی اصلی
                        </Typography>
                        <Typography>
                          {request.company.subCategory.category?.name || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">زیر دسته</Typography>
                        <Typography>
                          {request.company.subCategory.name || "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}

                  {request?.company?.industries &&
                    request.company.industries.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          صنایع مرتبط:
                        </Typography>
                        <Grid container spacing={1}>
                          {request.company.industries.map((industry, index) => (
                            <Grid item key={industry.id || index}>
                              <Chip
                                label={industry.name}
                                color={
                                  industry.isPrimary ? "primary" : "default"
                                }
                                size="small"
                                sx={{ m: 0.5 }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}

                  {request?.company?.activities &&
                    request.company.activities.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          فعالیت‌های مرتبط:
                        </Typography>
                        <Grid container spacing={1}>
                          {request.company.activities.map((activity, index) => (
                            <Grid item key={activity.id || index}>
                              <Chip
                                label={activity.name}
                                size="small"
                                sx={{ m: 0.5 }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                </AccordionDetails>
              </Accordion>

              {/* Brands */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>برندها</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {request?.company?.brands &&
                  request.company.brands.length > 0 ? (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>نام برند</TableCell>
                          <TableCell>نام انگلیسی</TableCell>
                          <TableCell>برند اصلی</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {request.company.brands.map((brand, index) => (
                          <TableRow key={brand.id || index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{brand.name}</TableCell>
                            <TableCell>{brand.nameEn || "-"}</TableCell>
                            <TableCell>
                              {brand.isPrimary ? "بله" : "خیر"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography>برندی ثبت نشده است.</Typography>
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Gallery Files */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>گالری تصاویر</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {request?.company?.galleryFile &&
                  request.company.galleryFile.length > 0 ? (
                    <Grid container spacing={2}>
                      {request.company.galleryFile.map((file, index) => (
                        <Grid item xs={6} sm={4} md={3} key={file.id || index}>
                          <Box
                            sx={{
                              position: "relative",
                              height: 140,
                              border: "1px solid #eee",
                              borderRadius: 1,
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              component="img"
                              src={
                                file.url ||
                                "/assets/images/placeholders/image-placeholder.jpg"
                              }
                              alt={file.name}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                bgcolor: "rgba(0,0,0,0.6)",
                                color: "white",
                                p: 0.5,
                                textAlign: "center",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {file.name}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography>تصویری در گالری ثبت نشده است.</Typography>
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Audit Information */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={500}>اطلاعات ممیزی</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">تاریخ ایجاد</Typography>
                      <Typography>
                        {formatDate(request?.company?.createdAt)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">
                        تاریخ بروزرسانی
                      </Typography>
                      <Typography>
                        {formatDate(request?.company?.updatedAt)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">وضعیت</Typography>
                      <Typography>{request?.company?.status || "-"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">رتبه‌بندی</Typography>
                      <Typography>
                        {request?.company?.ranking || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">رتبه‌بندی کلی</Typography>
                      <Typography>
                        {request?.company?.rankingAll || "-"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">بازدید</Typography>
                      <Typography>{request?.company?.visit || "0"}</Typography>
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
