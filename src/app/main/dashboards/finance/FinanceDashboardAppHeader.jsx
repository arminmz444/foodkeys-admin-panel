// src/app/main/dashboards/finance/FinanceDashboardAppHeader.jsx
import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';

/**
 * The FinanceDashboardAppHeader component.
 */
function FinanceDashboardAppHeader({ onRefresh, isRefreshing }) {
  return (
    <div className="flex w-full container">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
        <div className="flex flex-col flex-auto">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            داشبورد مالی
          </Typography>
          <Typography
            className="font-medium tracking-tight"
            color="text.secondary"
          >
            آخرین وضعیت تراکنش‌های مالی تمام اپلیکیشن‌های سام 
          </Typography>
        </div>
        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Tooltip title="بروزرسانی داده‌ها">
            <IconButton
              onClick={onRefresh}
              disabled={isRefreshing}
              color="primary"
              size="large"
            >
              <motion.div
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ 
                  duration: 1, 
                  repeat: isRefreshing ? Infinity : 0,
                  ease: "linear"
                }}
              >
                <FuseSvgIcon size={24}>heroicons-solid:arrow-path</FuseSvgIcon>
              </motion.div>
            </IconButton>
          </Tooltip>
          <Button
            className="whitespace-nowrap"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:document-report</FuseSvgIcon>}
          >
            گزارش‌ها
          </Button>
          <Button
            className="whitespace-nowrap"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
          >
            تنظیمات
          </Button>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>}
          >
            خروجی
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FinanceDashboardAppHeader;