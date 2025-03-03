// // ActivityLogManagerPage.tsx
// import React, { useState, useEffect } from 'react';
// import { Box, Typography, TextField, Paper, Button } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';


// function ActivityLogManagerApp() {
//   const [logs, setLogs] = useState([]);
//   const [searchText, setSearchText] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');

//   useEffect(() => {
//     // Placeholder: fetch activity logs from API
//     const fakeLogs = [
//       { id: 1, activity: 'Login', user: 'alice', date: '2025-03-01', details: 'User logged in' },
//       { id: 2, activity: 'Data Update', user: 'bob', date: '2025-03-02', details: 'Updated record #42' },
//     ];
//     setLogs(fakeLogs);
//   }, []);

//   const filteredLogs = logs.filter(log => 
//     log.activity.toLowerCase().includes(searchText.toLowerCase()) &&
//     (selectedDate ? log.date === selectedDate : true)
//   );

//   const columns = [
//     { field: 'id', headerName: 'ID', width: 70 },
//     { field: 'activity', headerName: 'Activity', width: 150 },
//     { field: 'user', headerName: 'User', width: 130 },
//     { field: 'date', headerName: 'Date', width: 120 },
//     { field: 'details', headerName: 'Details', width: 300 },
//   ];

//   return (
//     <Box p={2}>
//       <Typography variant="h6" gutterBottom>Activity Log Manager</Typography>
//       <Box display="flex" alignItems="center" mb={2}>
//         <TextField 
//           label="Search Activity" 
//           variant="outlined" 
//           size="small" 
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//           style={{ marginRight: 16 }}
//         />
//         <TextField 
//           label="Select Date" 
//           type="date"
//           variant="outlined" 
//           size="small"
//           InputLabelProps={{ shrink: true }}
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           style={{ marginRight: 16 }}
//         />
//         <Button variant="contained" color="primary">Configure</Button>
//       </Box>
//       <Paper style={{ height: 400, width: '100%' }}>
//         <DataGrid rows={filteredLogs} columns={columns} pageSize={5} />
//       </Paper>
//     </Box>
//   );
// }

// export default ActivityLogManagerApp;
import React from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Add } from "@mui/icons-material";

function ActivityLogManagerApp() {
  return (
    <div
      dir="rtl"
      className="w-full h-screen bg-gray-50 p-4 text-gray-800 font-sans"
    >
      {/* Top section: "افزودن تقاضا" button and filter buttons */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Add Request Button */}
          <Button
            variant="contained"
            color="success"
            startIcon={<Add />}
            className="whitespace-nowrap"
          >
            افزودن تقاضا
          </Button>

          {/* Time Range Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outlined" color="inherit">
              همه
            </Button>
            <Button variant="outlined" color="inherit">
              امروز
            </Button>
            <Button variant="outlined" color="inherit">
              هفته
            </Button>
            <Button variant="outlined" color="inherit">
              ماه
            </Button>
            <Button variant="outlined" color="inherit">
              ۳ ماه
            </Button>
            <Button variant="outlined" color="inherit">
              ۶ ماه
            </Button>
            <Button variant="outlined" color="inherit">
              سال
            </Button>
          </div>

          {/* Example Search Field */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="جستجو"
            className="max-w-[200px]"
          />
        </div>

        {/* Date pickers / Additional filters row (example placeholders) */}
        <div className="flex flex-wrap items-center gap-4">
          <TextField
            label="تاریخ ثبت (ارسال شده)"
            variant="outlined"
            size="small"
          />
          <TextField
            label="تاریخ انجام (تکمیل شده)"
            variant="outlined"
            size="small"
          />

          <FormControl size="small" className="min-w-[120px]">
            <InputLabel id="type-label">نوع</InputLabel>
            <Select labelId="type-label" label="نوع">
              <MenuItem value="همه">همه</MenuItem>
              <MenuItem value="درخواست">درخواست</MenuItem>
              <MenuItem value="پیشنهاد">پیشنهاد</MenuItem>
            </Select>
          </FormControl>

          <TextField label="کاربر" variant="outlined" size="small" />
          <TextField label="مقام" variant="outlined" size="small" />
          <TextField label="موضوع مرتبط" variant="outlined" size="small" />
        </div>
      </div>

      {/* Table section */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead className="bg-gray-200">
              <TableRow>
                <TableCell className="font-semibold">عنوان تقاضا</TableCell>
                <TableCell className="font-semibold">مسئول انجام</TableCell>
                <TableCell className="font-semibold">تاریخ درخواست</TableCell>
                <TableCell className="font-semibold">تاریخ انجام</TableCell>
                <TableCell className="font-semibold">وضعیت</TableCell>
                <TableCell className="font-semibold">کاربر مربوطه</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Example: No data row */}
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  هیچ تقاضایی یافت نشد
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Bottom-right orange hint/alert box */}
      <div className="fixed bottom-4 right-4 bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-3 rounded shadow-md">
        <p className="text-sm">
          این بخش الان خالی است. موردی ارسال کنید یا یک تقاضا ثبت نمایید.
        </p>
      </div>
    </div>
  );
}


export default ActivityLogManagerApp;