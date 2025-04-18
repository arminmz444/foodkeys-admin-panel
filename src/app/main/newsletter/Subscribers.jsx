// src/app/modules/newsletter/Subscribers.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subscriberSchema } from './newsletterValidation';
import { 
  useGetSubscribersQuery,
  useSubscribeToNewsletterMutation,
  useUnsubscribeFromNewsletterMutation
} from './store/api/NewsletterApi';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Controller } from 'react-hook-form';

function Subscribers() {
  const [unsubscribeDialogOpen, setUnsubscribeDialogOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);

  const { data: subscribers, isLoading, error } = useGetSubscribersQuery();
  const [subscribeToNewsletter, { isLoading: isSubscribing, error: subscribeError }] = useSubscribeToNewsletterMutation();
  const [unsubscribeFromNewsletter, { isLoading: isUnsubscribing }] = useUnsubscribeFromNewsletterMutation();

  const methods = useForm({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      email: '',
      name: ''
    }
  });

  const { reset, handleSubmit, control, formState } = methods;
  const { errors } = formState;

  const onSubmit = async (data) => {
    try {
      await subscribeToNewsletter(data).unwrap();
      reset();
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  const handleUnsubscribeClick = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setUnsubscribeDialogOpen(true);
  };

  const handleConfirmUnsubscribe = async () => {
    try {
      await unsubscribeFromNewsletter({ email: selectedSubscriber.email }).unwrap();
      setUnsubscribeDialogOpen(false);
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    }
  };

  return (
    <div className="w-full p-24 md:p-32">
      <Typography
        component={motion.h1}
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className="text-3xl font-bold tracking-tight leading-tight mb-4"
      >
        مشترکین خبرنامه
      </Typography>
      <Typography 
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-lg text-secondary mb-24"
      >
        مدیریت مشترکین خبرنامه
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }} className="p-24 shadow rounded-xl">
            <Typography className="text-xl font-semibold mb-16">افزودن مشترک جدید</Typography>
            
            {subscribeError && (
              <Alert severity="error" className="mb-16">
                خطا در افزودن مشترک
              </Alert>
            )}
            
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="ایمیل"
                      placeholder="ایمیل را وارد کنید"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      required
                      fullWidth
                      variant="outlined"
                      className="mb-16"
                      InputProps={{
                        startAdornment: (
                          <FuseSvgIcon className="ml-8" size={20}>heroicons-outline:mail</FuseSvgIcon>
                        )
                      }}
                    />
                  )}
                />
                
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="نام"
                      placeholder="نام را وارد کنید (اختیاری)"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      variant="outlined"
                      className="mb-24"
                      InputProps={{
                        startAdornment: (
                          <FuseSvgIcon className="ml-8" size={20}>heroicons-outline:user</FuseSvgIcon>
                        )
                      }}
                    />
                  )}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubscribing}
                  startIcon={isSubscribing ? <CircularProgress size={16} /> : <FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
                  fullWidth
                >
                  {isSubscribing ? "در حال افزودن..." : "افزودن مشترک"}
                </Button>
              </form>
            </FormProvider>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }} className="shadow rounded-xl overflow-hidden">
            <Typography className="text-xl font-semibold p-24 pb-0">لیست مشترکین</Typography>
            
            {isLoading ? (
              <div className="w-full flex justify-center py-32">
                <CircularProgress />
              </div>
            ) : error ? (
              <Alert severity="error" className="m-24 mt-16">
                خطا در بارگذاری مشترکین
              </Alert>
            ) : (
              <TableContainer className="max-h-600">
                <Table stickyHeader aria-label="subscribers table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ایمیل</TableCell>
                      <TableCell>نام</TableCell>
                      <TableCell align="right">عملیات</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscribers && subscribers.map((subscriber) => (
                      <TableRow key={subscriber.email} hover>
                        <TableCell component="th" scope="row">
                          {subscriber.email}
                        </TableCell>
                        <TableCell>{subscriber.name || '-'}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="لغو اشتراک">
                            <IconButton
                              color="error"
                              onClick={() => handleUnsubscribeClick(subscriber)}
                            >
                              <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {(!subscribers || subscribers.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" className="py-32">
                          <Typography color="textSecondary" className="text-16">
                            هیچ مشترکی یافت نشد
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Unsubscribe Confirmation Dialog */}
      <Dialog
        open={unsubscribeDialogOpen}
        onClose={() => setUnsubscribeDialogOpen(false)}
      >
        <DialogTitle>تایید لغو اشتراک</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از لغو اشتراک این ایمیل از خبرنامه اطمینان دارید؟ <br />
            <strong>{selectedSubscriber?.email}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnsubscribeDialogOpen(false)} disabled={isUnsubscribing}>
            انصراف
          </Button>
          <Button 
            onClick={handleConfirmUnsubscribe} 
            color="error" 
            variant="contained" 
            disabled={isUnsubscribing}
            startIcon={isUnsubscribing ? <CircularProgress size={16} /> : null}
          >
            {isUnsubscribing ? "در حال لغو اشتراک..." : "لغو اشتراک"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Subscribers;