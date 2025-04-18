// src/app/modules/newsletter/NewsletterDetail.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetNewsletterQuery, useSendNewsletterMutation } from './store/api/NewsletterApi';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import format from 'date-fns/format';
import { faIR } from 'date-fns/locale';

function NewsletterDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sendDialogOpen, setSendDialogOpen] = useState(false);

  const { data: newsletter, isLoading, error } = useGetNewsletterQuery(id);
  const [sendNewsletter, { isLoading: isSending }] = useSendNewsletterMutation();

  const handleSendClick = () => {
    setSendDialogOpen(true);
  };

  const handleConfirmSend = async () => {
    try {
      await sendNewsletter(id).unwrap();
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

  if (error || !newsletter) {
    return (
      <Alert severity="error" className="mt-16">
        خطا در بارگذاری خبرنامه
      </Alert>
    );
  }

  return (
    <div className="w-full p-24 md:p-32">
      <div className="mb-24">
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="#" onClick={() => navigate('/newsletters')}>
            خبرنامه‌ها
          </Link>
          <Typography color="textPrimary">جزئیات خبرنامه</Typography>
        </Breadcrumbs>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-24">
        <div>
          <Typography
            component={motion.h1}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-3xl font-bold tracking-tight leading-tight"
          >
            {newsletter.title}
          </Typography>
          <div className="flex items-center mt-8">
            {newsletter.sent ? (
              <Chip 
                label="ارسال شده" 
                color="success" 
                size="small" 
                icon={<FuseSvgIcon size={16}>heroicons-outline:check</FuseSvgIcon>} 
                className="ml-8"
              />
            ) : (
              <Chip 
                label="در انتظار" 
                color="warning" 
                size="small" 
                icon={<FuseSvgIcon size={16}>heroicons-outline:clock</FuseSvgIcon>} 
                className="ml-8"
              />
            )}
            <Typography className="text-secondary text-14">
              ایجاد شده توسط <strong>{newsletter.createdBy}</strong>
            </Typography>
          </div>
        </div>

        <div className="flex items-center mt-12 sm:mt-0 space-x-8">
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/newsletters')}
            startIcon={<FuseSvgIcon>heroicons-outline:arrow-right</FuseSvgIcon>}
            className="ml-8"
          >
            بازگشت
          </Button>
          
          {!newsletter.sent && (
            <>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate(`/newsletters/edit/${newsletter.id}`)}
                startIcon={<FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>}
                className="ml-8"
              >
                ویرایش
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendClick}
                startIcon={<FuseSvgIcon>heroicons-outline:paper-airplane</FuseSvgIcon>}
              >
                ارسال فوری
              </Button>
            </>
          )}
        </div>
      </div>

      <Paper component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="shadow rounded-lg overflow-hidden">
        <div className="p-24 md:p-32 bg-gray-50">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography className="font-medium">تاریخ ایجاد</Typography>
              <Typography className="mt-4 text-16">{formatDate(newsletter.createdAt)}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography className="font-medium">تاریخ زمانبندی</Typography>
              <Typography className="mt-4 text-16">{formatDate(newsletter.scheduledDate)}</Typography>
            </Grid>
            {newsletter.sent && (
              <Grid item xs={12} md={6}>
                <Typography className="font-medium">تاریخ ارسال</Typography>
                <Typography className="mt-4 text-16">{formatDate(newsletter.sentAt)}</Typography>
              </Grid>
            )}
            {newsletter.updatedBy && (
              <Grid item xs={12} md={6}>
                <Typography className="font-medium">آخرین بروزرسانی توسط</Typography>
                <Typography className="mt-4 text-16">{newsletter.updatedBy}</Typography>
              </Grid>
            )}
            {newsletter.updatedAt && (
              <Grid item xs={12} md={6}>
                <Typography className="font-medium">تاریخ آخرین بروزرسانی</Typography>
                <Typography className="mt-4 text-16">{formatDate(newsletter.updatedAt)}</Typography>
              </Grid>
            )}
          </Grid>
        </div>
        <Divider />
        <div className="p-24 md:p-32">
          <Typography component="h2" className="text-xl font-bold mb-16">محتوای خبرنامه</Typography>
          <div 
            className="newsletter-content rtl"
            dangerouslySetInnerHTML={{ __html: newsletter.content }}
          />
        </div>
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
            <strong>{newsletter?.title}</strong>
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

export default NewsletterDetail;