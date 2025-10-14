// src/app/excel-templates/ExcelTemplateApp.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import ExcelTemplateHeader from './components/ExcelTemplateHeader';
import ExcelTemplateContent from './components/ExcelTemplateContent';

const Root = styled(FusePageCarded)(({ theme }) => ({
  '& .FusePageCarded-header': {
    minHeight: 72,
    height: 72,
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      minHeight: 136,
      height: 136,
    },
  },
}));

function ExcelTemplateApp() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  
  return (
    <Root
      header={<ExcelTemplateHeader />}
      content={<ExcelTemplateContent />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default ExcelTemplateApp;