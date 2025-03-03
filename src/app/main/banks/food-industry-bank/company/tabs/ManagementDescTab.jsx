// import TextField from '@mui/material/TextField';
// import { Controller, useFormContext } from 'react-hook-form';

// function ManagementDescTab(props) {
// 	const methods = useFormContext();
// 	const { control, formState } = methods;
// 	const { errors } = formState;

// 	return (
// 		<div>
// 			<Controller
// 				name="managementDesc"
// 				control={control}
// 				render={({ field }) => (
// 					<TextField
// 						{...field}
// 						className="mt-8 mb-16 sm:mx-4"
// 						multiline
// 						minRows={5}
// 						label="توضیحات مدیریت"
// 						id="managementDesc"
// 						variant="outlined"
// 						fullWidth
// 					/>
// 				)}
// 			/>
// 			<Controller
// 				name="record"
// 				control={control}
// 				render={({ field }) => (
// 					<TextField
// 						{...field}
// 						className="mt-8 mb-16 sm:mx-4"
// 						multiline
// 						minRows={5}
// 						label="ثبت سوابق"
// 						id="record"
// 						variant="outlined"
// 						fullWidth
// 					/>
// 				)}
// 			/>
// 		</div>
// 	);
// }

// export default ManagementDescTab;

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVert from "@mui/icons-material/MoreVert";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { motion } from "framer-motion";

const mockRecords = [
  {
  user: {
    firstName: "آرمین",
    lastName: "مظفری",
    username: "09352388350",
    createdAt: "2022-01-01",
  },
  text: "امتن رکورد تستی ، بعدا از سرور بیاید"
},
{
  user: {
    firstName: "کریم",
    lastName: "مظفری",
    username: "09352388350",
    createdAt: "2022-01-01",
  },
  text: "۲متن رکورد"
},
{
  user: {
    firstName: "امیر",
    lastName: "نورب=ی",
    username: "09352388350",
    createdAt: "2022-01-01",
  },
  text: "۳متن رکورد"
},
{
  user: {
    firstName: "ابوالفضل",
    lastName: "مظفری",
    username: "09352388350",
    createdAt: "2022-01-01",
  },
  text: "متن رکورد"
},
]
// A small helper to truncate text
function truncateText(text, length = 100) {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// A single timeline item
function RecordItem({ record, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);

  const handleToggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const handleDelete = async () => {
    if (!window.confirm("حذف رکورد؟")) return;
    await onDelete(record.id);
  };

  return (
    <div className="border border-gray-300 p-16 rounded-lg mb-16 relative">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <Typography variant="subtitle1" className="font-bold">
            {record.user?.firstName} {record.user?.lastName} ({record.user?.username})
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {record.createdAt || ""}
          </Typography>
        </div>
        {/* The SpeedDial or menu for each record */}
        <SpeedDial
          ariaLabel="Record actions"
          icon={<MoreVert />}
          onClose={() => setOpenSpeedDial(false)}
          onOpen={() => setOpenSpeedDial(true)}
          open={openSpeedDial}
          direction="left"
          FabProps={{
            size: "small",
            color: "primary",
          }}
        >
          <SpeedDialAction
            icon={<EditIcon />}
            tooltipTitle="ویرایش"
            onClick={() => alert("Edit not implemented")}
          />
          <SpeedDialAction
            icon={<DeleteIcon />}
            tooltipTitle="حذف"
            onClick={handleDelete}
          />
        </SpeedDial>
      </div>
      <Divider className="my-8" />
      <Typography variant="body1">
        {expanded ? record.text : truncateText(record.text, 150)}
      </Typography>
      {record.text?.length > 150 && (
        <Button variant="text" size="small" onClick={handleToggleExpand}>
          {expanded ? "بستن" : "ادامه ..."}
        </Button>
      )}
    </div>
  );
}

function ManagementDescTab() {
  const { control } = useFormContext();
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Load records from server with infinite approach
  const loadRecords = async () => {
    // const { data } = await axios.get(
    //   `/api/company/123/records?page=${page}&size=10`
    // );
    // if (!data || data.length === 0) {
    //   setHasMore(false);
    //   return;
    // }
    // setRecords((prev) => [...prev, ...data]);
    // setPage((prev) => prev + 1);

    setRecords(mockRecords)
    setHasMore(false)
  };

  useEffect(() => {
    // On mount, load first page
    loadRecords();
    // eslint-disable-next-line
  }, []);

  // Deleting a record from the timeline
  const handleDelete = async (recordId) => {
    await axios.delete(`/api/company/123/records/${recordId}`);
    setRecords((prev) => prev.filter((r) => r.id !== recordId));
  };

  return (
    <div>
      <Controller
        name="managementDesc"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16 sm:mx-4"
            multiline
            minRows={5}
            label="توضیحات مدیریت"
            id="managementDesc"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Controller
        name="record"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16 sm:mx-4"
            multiline
            minRows={5}
            label="ثبت سوابق"
            id="record"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Typography variant="h6" className="font-bold mt-16 mb-8">
        سوابق و رکوردهای این شرکت
      </Typography>
      {/* InfiniteScroll component */}
      <InfiniteScroll
        dataLength={records.length}
        next={loadRecords}
        hasMore={hasMore}
        loader={<Typography>در حال بارگذاری...</Typography>}
        scrollThreshold={0.9}
        style={{ overflow: "visible" }}
      >
        {records.map((record) => (
          <RecordItem key={record.id} record={record} onDelete={handleDelete} />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default ManagementDescTab;
