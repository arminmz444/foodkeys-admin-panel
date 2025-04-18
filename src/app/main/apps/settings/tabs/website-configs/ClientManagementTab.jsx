import React from 'react';
import { 
  Typography, 
  Paper, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Box,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'framer-motion';

// Styled components
const Root = styled('div')(({ theme }) => ({
  '& .header': {
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(3),
  },
}));

const FeatureCard = ({ title, description, icon, buttonText, buttonAction, disabled = false }) => (
  <Card className="rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
    <CardContent className="p-24 flex flex-col h-full">
      <div className="flex items-center mb-16">
        <FuseSvgIcon className="mr-8" color="primary" size={24}>
          {icon}
        </FuseSvgIcon>
        <Typography variant="h6">{title}</Typography>
      </div>
      
      <Typography className="flex-1 mb-16" variant="body2" color="text.secondary">
        {description}
      </Typography>
      
      <Button 
        variant="outlined" 
        color="primary" 
        className="self-start"
        onClick={buttonAction}
        disabled={disabled}
        startIcon={<FuseSvgIcon>{disabled ? 'heroicons-outline:lock-closed' : 'heroicons-outline:arrow-right'}</FuseSvgIcon>}
      >
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);

const ClientManagementTab = () => {
  const handleButtonClick = () => {
    // This would normally navigate to the feature screen or open a dialog
    console.log('Feature button clicked');
  };
  
  return (
    <Root className="flex flex-col flex-auto min-h-full">
      <div className="header p-24 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <Typography className="text-3xl font-bold tracking-tight leading-8">
            مدیریت مشتریان
          </Typography>
          <Typography className="font-medium tracking-tight" color="text.secondary">
            مشتریان سیستم و دسترسی‌های آن‌ها را مدیریت کنید
          </Typography>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 p-24"
      >
        <div className="w-full">
          <Alert severity="info" className="mb-24">
            این بخش در حال توسعه است و به زودی ویژگی‌های جدیدی به آن اضافه خواهد شد.
          </Alert>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FeatureCard 
                title="مدیریت کاربران"
                description="افزودن، ویرایش و حذف کاربران سیستم و تعیین سطح دسترسی آن‌ها"
                icon="heroicons-outline:users"
                buttonText="مشاهده کاربران"
                buttonAction={handleButtonClick}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FeatureCard 
                title="مدیریت نقش‌ها"
                description="تعریف نقش‌های مختلف سیستم و تعیین دسترسی‌های هر نقش"
                icon="heroicons-outline:user-group"
                buttonText="مشاهده نقش‌ها"
                buttonAction={handleButtonClick}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FeatureCard 
                title="مدیریت مجوزها"
                description="تعریف مجوزهای دسترسی به بخش‌های مختلف سیستم"
                icon="heroicons-outline:key"
                buttonText="مشاهده مجوزها"
                buttonAction={handleButtonClick}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FeatureCard 
                title="گزارش فعالیت‌ها"
                description="مشاهده گزارش فعالیت‌های کاربران در سیستم"
                icon="heroicons-outline:chart-bar"
                buttonText="مشاهده گزارش‌ها"
                buttonAction={handleButtonClick}
                disabled={true}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FeatureCard 
                title="تنظیمات احراز هویت"
                description="تنظیمات مربوط به احراز هویت کاربران و امنیت سیستم"
                icon="heroicons-outline:lock-closed"
                buttonText="مشاهده تنظیمات"
                buttonAction={handleButtonClick}
                disabled={true}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FeatureCard 
                title="مدیریت API"
                description="مدیریت دسترسی‌های API و کلیدهای API برای توسعه‌دهندگان"
                icon="heroicons-outline:code"
                buttonText="مشاهده API‌ها"
                buttonAction={handleButtonClick}
                disabled={true}
              />
            </Grid>
          </Grid>
          
          <Box className="mt-48 text-center">
            <Typography variant="body2" color="text.secondary">
              برای اطلاعات بیشتر درباره مدیریت مشتریان، لطفا با تیم پشتیبانی تماس بگیرید.
            </Typography>
          </Box>
        </div>
      </motion.div>
    </Root>
  );
};

export default ClientManagementTab;