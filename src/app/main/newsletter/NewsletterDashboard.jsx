// src/app/modules/newsletter/NewsletterDashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGetNewsletterStatsQuery } from './store/api/NewsletterApi';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

function StatsCard({ title, value, icon, color = 'primary' }) {
  return (
    <Card component={motion.div} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="shadow-lg">
      <CardContent className="p-6 flex flex-col items-center md:flex-row md:items-start">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white mb-4 md:mb-0 md:mr-4 bg-${color}`}>
          <FuseSvgIcon size={24}>{icon}</FuseSvgIcon>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <Typography className="text-lg font-medium text-secondary leading-none">{title}</Typography>
          <Typography className="text-3xl font-bold mt-2">{value}</Typography>
        </div>
      </CardContent>
    </Card>
  );
}

function NewsletterDashboard() {
  const { data: stats, isLoading, error } = useGetNewsletterStatsQuery();

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
        خطا در بارگذاری آمار خبرنامه
      </Alert>
    );
  }

  return (
    <div className="w-full p-24 md:p-32">
      <div className="flex flex-col items-center sm:items-start mb-24">
        <Typography
          component={motion.h1}
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-3xl font-bold tracking-tight leading-tight"
        >
          داشبورد خبرنامه
        </Typography>
        <Typography 
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-lg text-secondary mt-4"
        >
          نمای کلی آمار خبرنامه
        </Typography>
      </div>

      <Grid container spacing={3} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-32">
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="کل خبرنامه‌ها"
            value={stats?.totalNewsletters || 0}
            icon="heroicons-outline:mail"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="خبرنامه‌های ارسال شده"
            value={stats?.sentNewsletters || 0}
            icon="heroicons-outline:paper-airplane"
            color="green"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="خبرنامه‌های در انتظار"
            value={stats?.pendingNewsletters || 0}
            icon="heroicons-outline:clock"
            color="orange"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="کل مشترکین"
            value={stats?.totalSubscribers || 0}
            icon="heroicons-outline:users"
            color="indigo"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatsCard
            title="مشترکین فعال"
            value={stats?.activeSubscribers || 0}
            icon="heroicons-outline:user-group"
            color="teal"
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default NewsletterDashboard;