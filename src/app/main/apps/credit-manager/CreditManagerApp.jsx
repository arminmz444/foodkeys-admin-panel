import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Typography,
  Alert,
  Switch,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { getServerFile } from "src/utils/string-utils";

/* ------------------------------------------------------------------
   UserList: 
   - Displays users with infinite scrolling.
   - Calls loadMore() when the user scrolls to the bottom.
   - Renders each user as a card. On click => onSelectUser.
   - Minimizes re-renders by using React.memo and carefully passing props.
------------------------------------------------------------------ */
const UserList = React.memo(function UserList({
  users,
  hasMore,
  loadMore,
  onSelectUser,
  selectedUserId,
}) {
  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h6" className="text-gray-800 font-semibold">
        لیست کاربران
      </Typography>

      <InfiniteScroll
        dataLength={users.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="flex items-center gap-2">
            <CircularProgress size={20} />
            <Typography>در حال بارگذاری...</Typography>
          </div>
        }
        scrollableTarget="scrollableUserList"
        style={{ overflow: "visible" }} // So we don't break the layout
      >
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {users.map((user) => (
              <motion.div
                key={user.value}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  onClick={() => onSelectUser(user)}
                  className={`cursor-pointer mb-1 transition-transform ${
                    user.value === selectedUserId
                      ? "bg-blue-100 border border-blue-400"
                      : "bg-white hover:shadow-md"
                  }`}
                >
                  <CardContent className="flex items-center gap-4">
                    <Avatar
                      src={getServerFile(user.avatar)}
                      alt={user.label}
                      className="w-10 h-10"
                    />
                    <div className="flex flex-col">
                      <Typography variant="body1" className="font-medium">
                        {user.label}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {user.username}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </InfiniteScroll>
    </div>
  );
});

/* ------------------------------------------------------------------
   CreditManagerPage:
   - Manages user list (infinite scroll from /user/options).
   - Tracks selected user + user credit (from /user/{id}/credit).
   - Applies changes (POST /user/{id}/credit).
   - Supports ghost mode (no transaction logging).
   - Avoids unnecessary re-renders with careful state usage & memoization.
------------------------------------------------------------------ */
export default function CreditManagerApp() {
  /* -------------------------
   * 1) State for user list
   * ------------------------- */
  const [users, setUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // hasMore => whether we should keep trying to load more
  const hasMore = useMemo(() => pageNumber <= totalPages, [pageNumber, totalPages]);

  /* -------------------------
   * 2) State for selected user & credit
   * ------------------------- */
  const [selectedUser, setSelectedUser] = useState(null);
  const [credit, setCredit] = useState(null);
  const [isLoadingCredit, setIsLoadingCredit] = useState(false);

  /* -------------------------
   * 3) Operation states
   * ------------------------- */
  const [ghostMode, setGhostMode] = useState(false);
  const [operation, setOperation] = useState("INCREASE"); // 'plus' or 'minus'
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /* -------------------------
   * 4) Fetch user list (infinite scroll)
   *    /user/options => { data: [...], pagination: { pageNumber, pageSize, totalPages, ...} }
   * ------------------------- */
  const loadUsers = useCallback(async () => {
    if (isLoadingUsers) return;
    setIsLoadingUsers(true);
    try {
      const res = await axios.get("/user/options", {
        params: {
          pageSize: 10,
          pageNumber, // starts from 1
        },
      });
      if (res.data.status === "SUCCESS") {
        const { data, pagination } = res.data;
        // data is an array of user objects: { label, value, username, avatar }
        // pagination: { pageSize, pageNumber, totalPages, totalItems }
        setUsers((prev) => [...prev, ...data]);
        setPageNumber(pagination.pageNumber + 1);
        setTotalPages(pagination.totalPages);
      }
    } catch (err) {
      console.error("خطا در واکشی لیست کاربران:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [pageNumber, isLoadingUsers]);

  // Initial load
  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------
   * 5) Select user => fetch credit from /user/{id}/credit
   * ------------------------- */
  const handleSelectUser = useCallback(
    async (user) => {
      setSelectedUser(user);
      setCredit(null);
      setErrorMessage("");
      setAmount("");
      setIsLoadingCredit(true);
      try {
        const res = await axios.get(`/user/${user.value}/credit`);
        if (res.data.status === "SUCCESS") {
          setCredit(res.data.data); // Suppose data = current credit
        } else {
          setErrorMessage("خطا در واکشی اعتبار کاربر");
        }
      } catch (err) {
        console.error("خطا در واکشی اعتبار:", err);
        setErrorMessage("خطا در واکشی اعتبار کاربر");
      } finally {
        setIsLoadingCredit(false);
      }
    },
    []
  );

  /* -------------------------
   * 6) Ghost mode toggle
   * ------------------------- */
  const handleGhostModeToggle = (e) => {
    setGhostMode(e.target.checked);
    setErrorMessage("");
    setOperation("INCREASE");
    setAmount("");
  };

  /* -------------------------
   * 7) Apply changes => POST /user/{id}/credit
   *    We do a local check to prevent credit going <= 0
   *    If ghostMode => directly set credit
   *    Otherwise => plus or minus
   * ------------------------- */
  const handleApplyChanges = useCallback(async () => {
    setErrorMessage("");

    if (!selectedUser) {
      setErrorMessage("لطفاً ابتدا کاربری را انتخاب کنید.");
      return;
    }
    if (!amount || isNaN(amount)) {
      setErrorMessage("لطفاً مبلغ را به درستی وارد کنید.");
      return;
    }

    const numericAmount = Number(amount);
    if (numericAmount < 0) {
      setErrorMessage("مبلغ وارد شده نمی‌تواند منفی باشد.");
      return;
    }

    // Local check before sending to backend
    let newCredit = credit ?? 0;
    if (ghostMode) {
      // Direct set
      if (numericAmount < 0) {
        setErrorMessage("اعتبار نمی‌تواند منفی باشد.");
        return;
      }
      newCredit = numericAmount;
    } else {
      // plus or minus
      if (operation === "INCREASE") {
        newCredit = (credit ?? 0) + numericAmount;
      } else {
        // minus
        if ((credit ?? 0) - numericAmount <= 0) {
          setErrorMessage("عملیات نامعتبر! با این مقدار، اعتبار کاربر صفر یا منفی می‌شود.");
          return;
        }
        newCredit = (credit ?? 0) - numericAmount;
      }
    }

    // Send to backend
    try {
      const res = await axios.post(`/user/${selectedUser.value}/credit`, {
        amount: numericAmount,
        ghostModeOn: ghostMode,
        operation, // "plus" or "minus"
      });
      if (res.data.status === "SUCCESS") {
        // Suppose the backend returns the updated credit in res.data.data
        setCredit(res.data.data);
      } else {
        setErrorMessage(res.data.message || "خطا در اعمال تغییرات");
      }
    } catch (err) {
      console.error("خطا در اعمال تغییرات:", err);
      setErrorMessage("خطا در اعمال تغییرات");
    }
  }, [selectedUser, amount, credit, ghostMode, operation]);

  return (
    <div
      dir="rtl"
      className="
        w-full min-h-screen
        bg-gray-50
        p-6
        flex flex-col
        gap-6
      "
    >
      {/* Alerts at the top */}
      {!ghostMode ? (
        <Alert severity="warning" variant="filled" className="!text-right !leading-8">
          توجه: تمامی تغییرات اعتبار در جداول تراکنش‌ها ثبت خواهند شد.
        </Alert>
      ) : (
        <Alert severity="info" variant="filled" className="!text-right !leading-8">
          حالت مخفی فعال است. هیچ تراکنشی ثبت نمی‌شود.
        </Alert>
      )}

      {/* Main container */}
      <div className="flex flex-col-reverse lg:flex-row-reverse gap-8">
        {/* LEFT: User List */}
        <div
          id="scrollableUserList"
          className="flex-1 overflow-auto max-h-[600px] pr-2"
        >
          <UserList
            users={users}
            hasMore={hasMore}
            loadMore={loadUsers}
            onSelectUser={handleSelectUser}
            selectedUserId={selectedUser?.value}
          />
        </div>

        {/* RIGHT: Credit Info & Controls */}
        <div className="flex-1 bg-white rounded shadow p-6 flex flex-col gap-6">
          <Typography variant="h6" className="font-bold text-gray-700">
            مدیریت اعتبار کاربر
          </Typography>

          {/* Ghost Mode Switch */}
          <div className="flex items-center gap-2">
            <Switch checked={ghostMode} onChange={handleGhostModeToggle} />
            <Typography variant="body2">حالت مخفی (عدم ثبت تراکنش)</Typography>
          </div>

          {/* Selected User & Credit */}
          {selectedUser ? (
            <div className="space-y-2">
              <Typography variant="body1" className="font-semibold">
                کاربر انتخاب‌شده: {selectedUser.label}
              </Typography>

              {isLoadingCredit ? (
                <div className="flex items-center gap-2">
                  <CircularProgress size={20} />
                  <Typography>در حال بارگذاری اعتبار...</Typography>
                </div>
              ) : (
                <Typography>
                  اعتبار فعلی:{" "}
                  <span className="font-bold text-blue-600">{credit ?? 0}</span>
                </Typography>
              )}
            </div>
          ) : (
            <Typography className="text-gray-500">
              لطفاً یک کاربر را از لیست انتخاب کنید
            </Typography>
          )}

          {/* Operation Controls */}
          <div className="flex flex-col gap-4">
            {/* If ghost mode is off, show plus/minus. Otherwise, direct set */}
            {!ghostMode ? (
              <>
                <RadioGroup
                  row
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                >
                  <FormControlLabel
                    value="INCREASE"
                    control={<Radio />}
                    label="افزایش"
                  />
                  <FormControlLabel
                    value="DECREASE"
                    control={<Radio />}
                    label="کاهش"
                  />
                </RadioGroup>
                <TextField
                  label="مبلغ"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth
                />
              </>
            ) : (
              <TextField
                label="مقدار نهایی اعتبار"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
              />
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <Typography className="text-red-500 font-semibold">
              {errorMessage}
            </Typography>
          )}

          {/* Apply Changes Button */}
          <div className="flex justify-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyChanges}
              disabled={!selectedUser || isLoadingCredit}
            >
              اعمال تغییرات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
