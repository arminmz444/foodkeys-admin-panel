import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import { BiSolidDiscount } from "react-icons/bi";
import { FiCopy } from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useClipboard } from "@siberiacancode/reactuse";
import AddDiscount from "./AddDiscount";
import { useDispatch } from "react-redux";
import {
  closeDialog,
  openDialog,
} from "@fuse/core/FuseDialog/fuseDialogSlice.js";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import axios from "axios";
import { format } from "date-fns-jalali";

function DiscountTab() {
  const { copy } = useClipboard();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedDiscountId, setSelectedDiscountId] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  });

  // Fetch discounts from backend
  const fetchDiscounts = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await axios.get("/discount", {
        params: {
          name: search || undefined,
          pageNumber: page,
          pageSize: pagination.pageSize,
          sortBy: "createdAt",
          sortDir: "desc",
        },
      });

      if (response?.data?.status === "SUCCESS") {
        setDiscounts(response.data.data || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (error) {
      console.error("Error fetching discounts:", error);
      dispatch(
          showMessage({
            message: "خطا در دریافت لیست تخفیف‌ها",
            severity: "error",
            autoHideDuration: 3000,
          })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts(pagination.pageNumber, searchTerm);
  }, [pagination.pageNumber]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchDiscounts(1, event.target.value);
    }, 500);
  };

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({ ...prev, pageNumber: value }));
  };

  const handleEdit = (discountId) => {
    setSelectedDiscountId(discountId);
    setOpen(true);
  };

  const handleDelete = async (discountId, discountName) => {
    dispatch(
        openDialog({
          children: (
              <>
                <DialogTitle>حذف تخفیف</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    آیا از حذف تخفیف "{discountName}" مطمئن هستید؟ این عملیات قابل
                    بازگشت نیست.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => dispatch(closeDialog())}>لغو</Button>
                  <Button
                      onClick={async () => {
                        try {
                          await axios.delete(`/discount/${discountId}`);
                          dispatch(
                              showMessage({
                                message: "تخفیف با موفقیت حذف شد",
                                severity: "success",
                                autoHideDuration: 3000,
                              })
                          );
                          fetchDiscounts(pagination.pageNumber, searchTerm);
                        } catch (error) {
                          dispatch(
                              showMessage({
                                message:
                                    error.response?.data?.message || "خطا در حذف تخفیف",
                                severity: "error",
                                autoHideDuration: 3000,
                              })
                          );
                        }
                        dispatch(closeDialog());
                      }}
                      color="error"
                      variant="contained"
                  >
                    حذف
                  </Button>
                </DialogActions>
              </>
          ),
        })
    );
  };

  const handleCopyCode = (code) => {
    copy(code);
    dispatch(
        showMessage({
          message: "کد تخفیف کپی شد",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          autoHideDuration: 2000,
        })
    );
  };

  const handleDialogClose = () => {
    setOpen(false);
    setSelectedDiscountId(null);
  };

  const handleDiscountSuccess = () => {
    fetchDiscounts(pagination.pageNumber, searchTerm);
  };

  const getStatusColor = (status) => {
      return isDiscountActive(status) ? "success" : "error"
    // switch (status) {
    //   case "ACTIVE":
    //     return "success";
    //   case "INACTIVE":
    //     return "default";
    //   case "EXPIRED":
    //     return "error";
    //   default:
    //     return "default";
    // }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "yyyy/MM/dd HH:mm");
    } catch {
      return dateString;
    }
  };

  const isDiscountActive = (discount) => {
    const now = new Date();
    const start = new Date(discount.startDateTime);
    const end = new Date(discount.expireDateTime);
    return (
        now >= start && now <= end
    );
  };

  return (
      <div>
        <div className="flex items-center justify-center gap-10 mb-24">
          <TextField
              className="w-full"
              label="جستجو"
              placeholder="کد تخفیف مورد نظر را جستجو کنید"
              value={searchTerm}
              onChange={handleSearch}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                      <FuseSvgIcon size={20}>heroicons-outline:search</FuseSvgIcon>
                    </InputAdornment>
                ),
              }}
          />
          <AddDiscount
              key={selectedDiscountId ?? 'new'}
              open={open}
              setOpen={setOpen}
              handleClickOpen={() => {
                setSelectedDiscountId(null);
                setOpen(true);
              }}
              handleClose={handleDialogClose}
              discountId={selectedDiscountId}
              onSuccess={handleDiscountSuccess}
          />
        </div>

        <Divider />

        {loading ? (
            <Box className="flex justify-center items-center py-48">
              <CircularProgress />
            </Box>
        ) : discounts.length === 0 ? (
            <Typography className="text-center my-32" color="textSecondary">
              تخفیفی یافت نشد.
            </Typography>
        ) : (
            <>
              <List>
                {discounts.map((discount) => (
                    <ListItem
                        divider
                        key={discount.name}
                        disablePadding
                        className="py-12 flex flex-col items-start sm:items-center sm:flex-row space-y-16 sm:space-y-0"
                    >
                      <div className="flex flex-1 items-center">
                  <span
                      className={`w-10 h-10 ml-5 rounded-full ${
                          isDiscountActive(discount)
                              ? "bg-green-500"
                              : "bg-red-400"
                      } ${isDiscountActive(discount) ? "animate-pulse" : ""}`}
                  />
                        <ListItemAvatar>
                          <BiSolidDiscount size={30} />
                        </ListItemAvatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-8">
                            <Typography variant="h6">
                              {discount.displayName}
                            </Typography>
                            <Chip
                                label={`${discount.percentage}%`}
                                size="small"
                                color="primary"
                            />
                            <Chip
                                label={isDiscountActive(discount) ? "فعال" : "غیرفعال"}
                                size="small"
                                color={getStatusColor(discount)}
                            />
                          </div>
                          <div className="flex items-center gap-5 mt-4">
                            <Typography color="GrayText">{discount.name}</Typography>
                            <Tooltip title="کپی کد تخفیف">
                              <IconButton
                                  size="small"
                                  onClick={() => handleCopyCode(discount.name)}
                              >
                                <FiCopy size={16} />
                              </IconButton>
                            </Tooltip>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-16 mt-8 text-sm text-gray-600">
                            <span>شروع: {formatDate(discount.startDateTimeFa || discount.startDateTime)}</span>
                            <span>پایان: {formatDate(discount.expireDateTimeFa || discount.expireDateTime)}</span>
                            {discount.maxUses && (
                                <span>
                          استفاده: {discount.currentUses || 0}/{discount.maxUses}
                        </span>
                            )}
                          </div>

                          {/* Display constraints if any */}
                          {discount.policyRule && discount.policyRule.constraints &&
                              discount.policyRule.constraints.length > 0 && (
                                  <div className="mt-8 flex flex-wrap gap-4">
                                    {discount.includedUserIds && discount.includedUserIds.length > 0 && (
                                        <Chip
                                            label={`کاربران مجاز: ${discount.includedUserIds.length}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                    {discount.excludedUserIds && discount.excludedUserIds.length > 0 && (
                                        <Chip
                                            label={`کاربران محروم: ${discount.excludedUserIds.length}`}
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                        />
                                    )}
                                    {discount.includedBundleIds && discount.includedBundleIds.length > 0 && (
                                        <Chip
                                            label={`پلن‌های مجاز: ${discount.includedBundleIds.length}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                    {discount.excludedBundleIds && discount.excludedBundleIds.length > 0 && (
                                        <Chip
                                            label={`پلن‌های محروم: ${discount.excludedBundleIds.length}`}
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                        />
                                    )}
                                  </div>
                              )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Button size="small" onClick={() => handleEdit(discount.name)}>
                          <MdEdit size={20} />
                        </Button>
                        <IconButton
                            color="error"
                            onClick={() => handleDelete(discount.name, discount.displayName)}
                        >
                          <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
                        </IconButton>
                      </div>
                    </ListItem>
                ))}
              </List>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                  <Box className="flex justify-center mt-24 mb-12">
                    <Pagination
                        count={pagination.totalPages}
                        page={pagination.pageNumber}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                    />
                  </Box>
              )}
            </>
        )}
      </div>
  );
}

export default DiscountTab;