// src/app/excel-templates/components/ExcelTemplateHeader.jsx
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useLocation, useParams } from 'react-router-dom';
import { useGetExcelTemplateQuery } from '../store/ExcelTemplateApi';

function ExcelTemplateHeader() {
  const location = useLocation();
  const { templateId } = useParams();
  
  // Only fetch the template if we're on a details page
  const { data: template } = useGetExcelTemplateQuery(
    templateId, 
    { skip: !templateId || location.pathname.includes('upload') }
  );
  
  const getTitle = () => {
    if (location.pathname.includes('/upload')) {
      return 'آپلود قالب جدید';
    }
    
    if (location.pathname.includes('/details/') && template) {
      return `قالب: ${template.name}`;
    }
    
    if (location.pathname.includes('/processor')) {
      return 'تولید فایل های اکسل';
    }
    
    return 'قالب های اکسل';
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
      <div className="flex flex-col items-center sm:items-start">
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.3 } }}
        >
          <Typography
            className="flex items-center sm:mb-12"
            component="div"
            role="button"
            color="inherit"
            variant="h4"
            sx={{ fontWeight: 500 }}
          >
            {getTitle()}
          </Typography>
        </motion.div>
      </div>
    </div>
  );
}

export default ExcelTemplateHeader;