// src/app/modules/newsletter/PendingNewsletters.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  useGetPendingNewslettersQuery,
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
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import format from 'date-fns/format';
import { faIR } from 'date-fns/locale';

function PendingNewsletters() {
  const navigate = useNavigate();
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);

  const { data: newsletters, isLoading, error } = useGetPendingNewslettersQuery();
  const [sendNewsletter, { isLoading: isSending }] = useSendNewsletterMutation();

  const handleSendClick = (newsletter) => {
    setSelectedNewsletter(newsletter);
    setSendDialogOpen(true);
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

  const calculateTimeRemaining = (scheduledDate) => {
    if (!scheduledDate) return '-';
    
    try {
      const now = new Date();
      const scheduled = new Date(scheduledDate);
      
      if (isNaN(scheduled.getTime())) {
        return '-'; // Invalid date
      }
      
      if (now > scheduled) {
        return 'آماده ارسال';
      }
      
      const diffMs = scheduled - now;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffDays > 0) {
        return `${diffDays} روز ${diffHours} ساعت`;
      } else if (diffHours > 0) {
        return `${diffHours} ساعت ${diffMinutes} دقیقه`;
      } else {
        return `${diffMinutes} دقیقه`;
      }
    } catch (error) {
      console.error("Error calculating time remaining:", error);
      return '-';
    }
  };

  const isScheduledInPast = (scheduledDate) => {
    if (!scheduledDate) return false;
    try {
      const now = new Date();
      const scheduled = new Date(scheduledDate);
      
      if (isNaN(scheduled.getTime())) {
        return false; // Invalid date
      }
      
      return now > scheduled;
    } catch (error) {
      console.error("Error checking if scheduled in past:", error);
      return false;
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
        خطا در بارگذاری خبرنامه‌های در انتظار
      </Alert>
    );
  }

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
            خبرنامه‌های در انتظار
          </Typography>
          <Typography 
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-secondary mt-4"
          >
            خبرنامه‌های در انتظار ارسال
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
          <Table stickyHeader aria-label="pending newsletters table">
            <TableHead>
              <TableRow>
                <TableCell>عنوان</TableCell>
                <TableCell>تاریخ ایجاد</TableCell>
                <TableCell>تاریخ زمانبندی</TableCell>
                <TableCell>زمان باقیمانده</TableCell>
                <TableCell>ایجاد شده توسط</TableCell>
                <TableCell align="right">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newsletters && newsletters.map((newsletter) => (
                <TableRow key={newsletter.id} hover>
                  <TableCell component="th" scope="row">
                    {newsletter.title}
                  </TableCell>
                  <TableCell>{formatDate(newsletter.createdAt)}</TableCell>
                  <TableCell>{formatDate(newsletter.scheduledDate)}</TableCell>
                  <TableCell>
                    {isScheduledInPast(newsletter.scheduledDate) ? (
                      <Chip 
                        label="آماده ارسال" 
                        color="success" 
                        size="small" 
                        icon={<FuseSvgIcon size={16}>heroicons-outline:check</FuseSvgIcon>} 
                      />
                    ) : (
                      calculateTimeRemaining(newsletter.scheduledDate)
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
                      
                      <Tooltip title="ویرایش">
                        <IconButton
                          color="secondary"
                          onClick={() => navigate(`/newsletters/edit/${newsletter.id}`)}
                        >
                          <FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="ارسال فوری">
                        <IconButton
                          color="success"
                          onClick={() => handleSendClick(newsletter)}
                        >
                          <FuseSvgIcon>heroicons-outline:paper-airplane</FuseSvgIcon>
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {(!newsletters || newsletters.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} align="center" className="py-32">
                    <Typography color="textSecondary" className="text-16">
                      هیچ خبرنامه در انتظاری یافت نشد
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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

export default PendingNewsletters;