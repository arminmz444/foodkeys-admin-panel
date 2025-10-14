// src/app/excel-templates/CustomExcelTemplateApp.jsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseLoading from '@fuse/core/FuseLoading';
import CustomTemplateHeader from './components/CustomTemplateHeader';
import CustomTemplateContent from './components/CustomTemplateContent';
import { useGetExcelTemplateQuery } from './store/ExcelTemplateApi';

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

function CustomExcelTemplateApp() {
  const { templateId } = useParams();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  
  const { 
    data: template, 
    isLoading, 
    isError 
  } = useGetExcelTemplateQuery(templateId);

  if (isLoading) {
    return <FuseLoading />;
  }

  if (isError || !template) {
    return (
      <div className="flex items-center justify-center h-full">
        <h2>Template not found</h2>
      </div>
    );
  }

  return (
    <Root
      header={<CustomTemplateHeader template={template} />}
      content={<CustomTemplateContent template={template} />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default CustomExcelTemplateApp;