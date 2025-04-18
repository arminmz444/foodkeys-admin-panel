// src/app/main/banks/services/subcategories/SubcategoryCard.jsx
import { useState } from 'react';
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Card from "@mui/material/Card";
import { AvatarGroup, Chip, Tooltip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { formatDistanceToNow } from "date-fns-jalali";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import { motion } from 'framer-motion';

function SubcategoryCard({ subcategory }) {
  // Mock data for demonstration (replace with real data in production)
  const recentSubmissions = [
    { id: "1", name: "محمد احمدی", avatar: "assets/images/avatars/male-06.jpg" },
    { id: "2", name: "فاطمه محمدی", avatar: "assets/images/avatars/female-09.jpg" },
    { id: "3", name: "علی رضایی", avatar: "assets/images/avatars/male-07.jpg" },
  ];

  const submissionCount = Math.floor(Math.random() * 50) + 5; // Random number between 5 and 55

  // Format status as a readable label and color
  const getStatusChip = () => {
    switch (subcategory.status) {
      case 0:
        return { label: 'غیرفعال', color: 'error' };
      case 1:
        return { label: 'فعال', color: 'success' };
      case 2:
        return { label: 'در انتظار تایید', color: 'warning' };
      default:
        return { label: 'نامشخص', color: 'default' };
    }
  };

  const statusInfo = getStatusChip();

  return (
    <Card
      component={NavLinkAdapter}
      to={`/banks/service/subcategory/${subcategory.subCategoryId}/schema`}
      role="button"
      className="relative flex flex-col items-start w-full h-full p-20 shadow rounded-lg hover:shadow-xl transition-shadow duration-150 ease-in-out overflow-hidden"
      sx={{ minHeight: 320 }}
    >
      {/* Status indicator */}
      <div className="absolute top-0 left-0 m-8 rtl:left-auto rtl:right-0">
        <Chip
          size="small"
          label={statusInfo.label}
          color={statusInfo.color}
          variant="filled"
        />
      </div>

      <div className="flex flex-col flex-auto justify-start items-start w-full">
        {/* Icon */}
        <Box
          sx={{ backgroundColor: "secondary.light", color: "secondary.dark" }}
          className="flex items-center justify-center p-16 rounded-full"
        >
          <FuseSvgIcon>heroicons-outline:template</FuseSvgIcon>
        </Box>

        {/* Title and details */}
        <Typography className="mt-16 text-lg font-bold leading-6">
          {subcategory.subCategoryDisplayName}
        </Typography>
        
        <Typography className="mt-8 text-grey-500 text-md font-medium leading-5">
          {subcategory.subCategoryName}
        </Typography>
        
        <div className="mt-8 flex items-center">
          <Typography variant="body2" color="text.secondary" className="ml-4">
            شناسه:
          </Typography>
          <Typography variant="body2" className="font-medium">
            {subcategory.subCategoryId}
          </Typography>
        </div>
        
        <div className="mt-4 flex items-center">
          <Typography variant="body2" color="text.secondary" className="ml-4">
            ترتیب نمایش:
          </Typography>
          <Typography variant="body2" className="font-medium">
            {subcategory.subCategoryPageOrder || 0}
          </Typography>
        </div>
        
        {subcategory.subCategoryDescription && (
          <Typography className="mt-12 line-clamp-2 text-secondary w-full">
            {subcategory.subCategoryDescription}
          </Typography>
        )}
        
        <Divider className="w-48 mt-16 h-2" />
      </div>

      {/* Bottom section */}
      <div className="flex flex-col flex-auto justify-end w-full mb-16">
        {/* Submission metrics */}
        <div className="flex justify-between items-center mt-16">
          <Chip
            size="small"
            label={subcategory.hasDetailsPage ? "دارای صفحه جزئیات" : "بدون صفحه جزئیات"}
            variant="outlined"
            color={subcategory.hasDetailsPage ? "primary" : "default"}
          />
          
          <Tooltip title="تعداد سرویس‌های ثبت شده">
            <Chip
              size="small"
              icon={<FuseSvgIcon size={16}>heroicons-outline:document-text</FuseSvgIcon>}
              label={`${submissionCount} سرویس`}
              variant="outlined"
              color="info"
            />
          </Tooltip>
        </div>
        
        {/* Recent submissions */}
        <div className="flex items-center mt-16">
          <AvatarGroup 
            max={3} 
            sx={{ 
              '& .MuiAvatar-root': { width: 32, height: 32 },
              flexDirection: 'row-reverse' // Fixes RTL avatar order
            }}
          >
            {recentSubmissions.map((submission, index) => (
              <Avatar key={index} alt={submission.name} src={submission.avatar} />
            ))}
          </AvatarGroup>
          <Typography className="mr-12" variant="body2" color="text.secondary">
            آخرین ثبت‌کنندگان
          </Typography>
        </div>
        
        {/* Last updated */}
        <div className="flex items-center mt-12">
          <Typography variant="body2" color="text.secondary" className="ml-4">
            آخرین بروزرسانی:
          </Typography>
          <Typography variant="body2" className="truncate">
            {subcategory.updatedAt
              ? formatDistanceToNow(new Date(subcategory.updatedAt), { addSuffix: true })
              : "نامشخص"}
          </Typography>
        </div>
      </div>
      
      {/* Bottom action hint */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-12 px-16 bg-secondary bg-opacity-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FuseSvgIcon className="ml-8" color="secondary" size={18}>
          heroicons-outline:arrow-right
        </FuseSvgIcon>
        <Typography variant="body2" color="secondary" className="font-medium">
          تنظیم اسکیما و فرم سرویس
        </Typography>
      </motion.div>
    </Card>
  );
}

export default SubcategoryCard;