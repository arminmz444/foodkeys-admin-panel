// src/app/modules/newsletter/NewsletterList.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  useGetNewslettersQuery, 
  useDeleteNewsletterMutation,
  useSendNewsletterMutation
} from './store/api/NewsletterApi';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import format from 'date-fns/format';
import { faIR } from 'date-fns/locale';

function NewsletterList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);

  const { data, isLoading, error } = useGetNewslettersQuery({
    pageNumber: page + 1,
    pageSize: rowsPerPage
  });

  const [deleteNewsletter, { isLoading: isDeleting }] = useDeleteNewsletterMutation();
  const [sendNewsletter, { isLoading: isSending }] = useSendNewsletterMutation();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (newsletter) => {
    setSelectedNewsletter(newsletter);
    setDeleteDialogOpen(true);
  };

  const handleSendClick = (newsletter) => {
    setSelectedNewsletter(newsletter);
    setSendDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteNewsletter(selectedNewsletter.id).unwrap();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete newsletter:', error);
    }
  };

  const handleConfirmSend = async () => {
    try {
      await sendNewsletter(selectedNewsletter.id).unwrap();
      setSendDialogOpen(false);
    } catch (error) {
      console.error('Failed to send newsletter:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      // Handle ISO string dates properly
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // If it can't be parsed, return as is
      }
      return format(date, 'yyyy/MM/dd HH:mm', { locale: faIR });
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center mt-24">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="mt-16">
        خطا در بارگذاری خبرنامه‌ها
      </Alert>
    );
  }

  const newsletters = data?.data || [];
  const totalCount = data?.pagination?.totalElements || 0;

  return (
    <div className="w-full p-24 md:p-32">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-24">
        <div>
          <Typography
            component={motion.h1}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-3xl font-bold tracking-tight leading-tight"
          >
            خبرنامه‌ها
          </Typography>
          <Typography 
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-secondary mt-4"
          >
            مدیریت خبرنامه‌ها
          </Typography>
        </div>

        <Button
          component={motion.button}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 sm:mt-0"
          variant="contained"
          color="primary"
          startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
          onClick={() => navigate('/newsletters/new')}
        >
          ایجاد خبرنامه
        </Button>
      </div>

      <Paper component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="shadow rounded-xl overflow-hidden">
        <TableContainer>
          <Table stickyHeader aria-label="newsletters table">
            <TableHead>
              <TableRow>
                <TableCell align="right">عنوان</TableCell>
                <TableCell>تاریخ ایجاد</TableCell>
                <TableCell>تاریخ زمانبندی</TableCell>
                <TableCell>وضعیت</TableCell>
                <TableCell>ایجاد شده توسط</TableCell>
                <TableCell align="right">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newsletters.map((newsletter) => (
                <TableRow key={newsletter.id} hover>
                  <TableCell dir='ltr' component="th" scope="row">
                    {newsletter.title}
                  </TableCell>
                  <TableCell>{formatDate(newsletter.createdAt)}</TableCell>
                  <TableCell>{formatDate(newsletter.scheduledDate)}</TableCell>
                  <TableCell>
                    {newsletter.sent ? (
                      <Chip 
                        label="ارسال شده" 
                        color="success" 
                        size="small" 
                        icon={<FuseSvgIcon size={16}>heroicons-outline:check</FuseSvgIcon>} 
                      />
                    ) : (
                      <Chip 
                        label="در انتظار" 
                        color="warning" 
                        size="small" 
                        icon={<FuseSvgIcon size={16}>heroicons-outline:clock</FuseSvgIcon>} 
                      />
                    )}
                  </TableCell>
                  <TableCell>{newsletter.createdBy}</TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end">
                      <Tooltip title="مشاهده">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/newsletters/detail/${newsletter.id}`)}
                        >
                          <FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
                        </IconButton>
                      </Tooltip>
                      
                      {!newsletter.sent && (
                        <>
                          <Tooltip title="ویرایش">
                            <IconButton
                              color="secondary"
                              onClick={() => navigate(`/newsletters/edit/${newsletter.id}`)}
                            >
                              <FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="ارسال">
                            <IconButton
                              color="success"
                              onClick={() => handleSendClick(newsletter)}
                            >
                              <FuseSvgIcon>heroicons-outline:paper-airplane</FuseSvgIcon>
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="حذف">
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(newsletter)}
                            >
                              <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {newsletters.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="py-32">
                    <Typography color="textSecondary" className="text-16">
                      هیچ خبرنامه‌ای یافت نشد
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="تعداد در صفحه:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} از ${count}`}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>حذف خبرنامه</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از حذف این خبرنامه اطمینان دارید؟ <br />
            <strong>{selectedNewsletter?.title}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
            انصراف
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained" 
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : null}
          >
            {isDeleting ? "در حال حذف..." : "حذف"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Confirmation Dialog */}
      <Dialog
        open={sendDialogOpen}
        onClose={() => setSendDialogOpen(false)}
      >
        <DialogTitle>ارسال خبرنامه</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از ارسال فوری این خبرنامه اطمینان دارید؟ <br />
            <strong>{selectedNewsletter?.title}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendDialogOpen(false)} disabled={isSending}>
            انصراف
          </Button>
          <Button 
            onClick={handleConfirmSend} 
            color="primary" 
            variant="contained" 
            disabled={isSending}
            startIcon={isSending ? <CircularProgress size={16} /> : null}
          >
            {isSending ? "در حال ارسال..." : "ارسال"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NewsletterList;