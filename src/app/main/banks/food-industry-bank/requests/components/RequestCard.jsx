import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Collapse,
  Tooltip,
  Chip,
  Skeleton,
  Badge,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { red, green, orange, grey } from '@mui/material/colors';
import { MoreVertical, Info, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
// import jalaali from 'dayjs/plugin/jalaali';
// import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fa';

import { useGetFoodIndustryCompanyDetailsQuery } from '../../FoodIndustryBankApi';
import ApprovalModal from './ApprovalModal';

// dayjs.extend(jalaali);
// dayjs.extend(relativeTime);
dayjs.locale('fa');

const ExpandMore = styled(({ expand, ...other }) => <IconButton {...other} />)(
  ({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  })
);

const requestStatusMap = {
  INIT: { label: 'ثبت اولیه', color: 'default', icon: Clock, bgColor: grey[100], textColor: grey[800] },
  PENDING: { label: 'در انتظار', color: 'warning', icon: AlertCircle, bgColor: orange[100], textColor: orange[800] },
  APPROVED: { label: 'تایید شده', color: 'success', icon: CheckCircle, bgColor: green[100], textColor: green[800] },
  DENIED: { label: 'رد شده', color: 'error', icon: XCircle, bgColor: red[100], textColor: red[800] },
  UNKNOWN: { label: 'نامشخص', color: 'default', icon: Clock, bgColor: grey[100], textColor: grey[800] }
};

const requestTypeMap = {
  UNKNOWN: 'نامشخص',
  CONSUMER_CREATE_COMPANY_REQUEST: 'درخواست ایجاد شرکت',
  CONSUMER_UPDATE_COMPANY_REQUEST: 'درخواست ویرایش شرکت',
  CONSUMER_DELETE_COMPANY_REQUEST: 'درخواست حذف شرکت',
  OTHER_REQUEST_TYPE: 'سایر درخواست‌ها',
  ASK_FOR_REVISION: 'درخواست بازبینی',
  SUBMIT_COMPANY: 'ثبت شرکت',
  SUBMIT_SERVICE: 'ثبت سرویس',
  BUY_SUBSCRIPTION: 'خرید اشتراک',
  UPDATE_COMPANY: 'به‌روزرسانی شرکت',
  UPDATE_SERVICE: 'به‌روزرسانی سرویس',
  ADMIN_REVIEW: 'بررسی مدیر'
};

export default function RequestCard({ request, onActionComplete }) {
  console.log(`Request: ${JSON.stringify(request)}`)
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: companyDetails, isFetching: isCompanyLoading } = useGetFoodIndustryCompanyDetailsQuery(
    request?.company?.companyId,
    { 
      skip: !expanded && !modalOpen,  
      refetchOnMountOrArgChange: true 
    }
  );

  const company = companyDetails || request?.company;

  console.log(`Company: ${JSON.stringify(company)}`)
  const handleExpandClick = () => setExpanded(!expanded);
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('jYYYY/jMM/jDD HH:mm');
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return '-';
    return dayjs(dateString).fromNow();
  };

  const getStatusDetails = (status) => {
    return requestStatusMap[status] || requestStatusMap[4];
  };

  const getRequestTypeName = (type) => {
    return requestTypeMap[type] || requestTypeMap[0];
  };

  const statusDetails = getStatusDetails(request.requestStatus);
  const StatusIcon = statusDetails.icon;
  
  const logoUrl = company?.logo || 'assets/images/placeholders/company-logo.png';
  
  const backgroundUrl = company?.backgroundImage || 'assets/images/placeholders/company-banner.png';

  const canTakeAction = request.requestStatus === "PENDING"; 
  const { requester } = request;

  const hasComments = request.employeeComment || (request.childRequests && request.childRequests.length > 0);

  return (
    <>
      <Card 
        sx={{ 
          width: '100%', 
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
          },
          position: 'relative',
          overflow: 'visible'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: 16,
            zIndex: 1
          }}
        >
          <Chip
            icon={<StatusIcon size={14} />}
            label={statusDetails.label}
            size="small"
            sx={{
              backgroundColor: statusDetails.bgColor,
              color: statusDetails.textColor,
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
        </Box>
        
        <CardHeader
          avatar={
            <Avatar 
              src={logoUrl} 
              sx={{ 
                bgcolor: red[500],
                width: 45,
                height: 45,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              alt={company?.companyName || request?.companyName}
            />
          }
          action={
            <Tooltip title={canTakeAction ? "بررسی درخواست" : "نمایش جزئیات"}>
              <span>
                <IconButton 
                  onClick={() => setModalOpen(true)}
                  color={canTakeAction ? "primary" : "default"}
                >
                  <Info size={20} />
                </IconButton>
              </span>
            </Tooltip>
          }
          title={
            <Tooltip title={company?.name || request?.companyName || 'نامشخص'}>
              <Typography width={150} variant="subtitle1" component="div" fontWeight="medium" noWrap>
                {company?.name || request?.companyName || (
                  <Skeleton width={150} />
                )}
              </Typography>
            </Tooltip>
          }
          subheader={
            <Typography variant="caption" color="text.secondary" noWrap>
              {request?.createdAtStr || (request.createdAt ? formatRelativeTime(request.createdAt) : <Skeleton width={100} />)}
            </Typography>
          }
        />

        <CardMedia
          component="img"
          height="140"
          image={backgroundUrl}
          alt={company?.companyName}
          sx={{ objectFit: 'cover', height: 120 }}
        />

        <CardContent sx={{ pt: 1.5, pb: 1 }}>
          <div className="flex justify-between items-center mb-2">
            <Typography variant="caption" color="text.secondary">
              {request.requestType ? getRequestTypeName(request.requestType) : <Skeleton width={120} />}
            </Typography>
            
            {hasComments && (
              <Badge color="secondary" variant="dot">
                <MessageSquare size={16} color={grey[600]} />
              </Badge>
            )}
          </div>
          
          <Typography variant="body2" color="text.secondary" sx={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: '40px'
          }}>
            {company?.description || 'بدون توضیحات'}
          </Typography>
        </CardContent>

        <CardActions disableSpacing sx={{ pt: 0 }}>
          <Tooltip title="نمایش اطلاعات بیشتر">
            <span>
              <IconButton
                onClick={() => setModalOpen(true)}
                color={canTakeAction ? "primary" : "default"}
              >
                <Info size={18} />
              </IconButton>
            </span>
          </Tooltip>

          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>اطلاعات درخواست:</Typography>
            
            <div className="grid grid-cols-2 gap-16">
              <Typography variant="body2" color="text.secondary">درخواست کننده:</Typography>
              <Typography variant="body2">
                {requester ? `${requester.name} ` : 'نامشخص'}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">تاریخ درخواست:</Typography>
              <Typography variant="body2">{request.createdAtStr || "-"}</Typography>
              
              <Typography variant="body2" color="text.secondary">نوع درخواست:</Typography>
              <Typography variant="body2">{getRequestTypeName(request.requestType)}</Typography>
              
              <Typography variant="body2" color="text.secondary">وضعیت:</Typography>
              <Chip 
                size="small" 
                label={statusDetails.label} 
                color={statusDetails.color} 
                icon={<StatusIcon size={14} />}
              />
              
              {request.answeredAtStr && (
                <>
                  <Typography variant="body2" color="text.secondary">تاریخ پاسخ:</Typography>
                  <Typography variant="body2">{request.answeredAtStr}</Typography>
                </>
              )}
              
              {request.responder && (
                <>
                  <Typography variant="body2" color="text.secondary">پاسخ دهنده:</Typography>
                  <Typography variant="body2">
                    {`${request.responder.name || ''}`}
                  </Typography>
                </>
              )}
            </div>
            
            {request.employeeComment && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>توضیحات کارشناس:</Typography>
                <Typography variant="body2" paragraph sx={{ 
                  p: 1, 
                  borderRadius: 1, 
                  bgcolor: grey[50],
                  border: `1px solid ${grey[200]}`
                }}>
                  {request.employeeComment}
                </Typography>
              </>
            )}
            
            {(company?.ceo || company?.companyType || company?.subjectOfActivity) && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>اطلاعات شرکت:</Typography>
                <div className="grid grid-cols-2 gap-16">
                  {company.ceo && (
                    <>
                      <Typography variant="body2" color="text.secondary">مدیرعامل:</Typography>
                      <Typography variant="body2">{company.ceo}</Typography>
                    </>
                  )}
                  
                  {company.companyType && (
                    <>
                      <Typography variant="body2" color="text.secondary">نوع شرکت:</Typography>
                      <Typography variant="body2">{company.companyTypeStr}</Typography>
                    </>
                  )}
                  
                  {company.subjectOfActivity && (
                    <>
                      <Typography variant="body2" color="text.secondary">موضوع فعالیت:</Typography>
                      <Typography variant="body2">{company.subjectOfActivity}</Typography>
                    </>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Collapse>
      </Card>

      {modalOpen && (
        <ApprovalModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          request={{...request, company}}
          onActionComplete={onActionComplete}
        />
      )}
    </>
  );
}